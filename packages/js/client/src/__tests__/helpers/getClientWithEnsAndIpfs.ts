import { PolywrapClient, Uri } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  defaultInterfaces,
  defaultEmbeddedWrapperPaths,
  defaultPackages,
} from "@polywrap/client-config-builder-js";
import fs from "fs";
import path from "path";
import { WasmPackage } from "@polywrap/wasm-js";
import { httpPlugin } from "@polywrap/http-plugin-js";

export const getClientWithEnsAndIpfs = () => {
  const connections: Connections = new Connections({
    networks: {
      testnet: new Connection({
        provider: providers.ethereum,
      }),
    },
    defaultNetwork: "testnet",
  });

  const ipfsHttpClientPath = defaultEmbeddedWrapperPaths.ipfsHttpClient;
  const ipfsResolverPath = defaultEmbeddedWrapperPaths.ipfsResolver;

  return new PolywrapClient(
    {
      envs: [
        {
          uri: defaultPackages.ipfsResolver,
          env: {
            provider: providers.ipfs,
            retries: { tryResolveUri: 1, getFile: 1 },
          },
        },
      ],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            defaultPackages.ipfsResolver,
            defaultPackages.ensResolver,
            defaultPackages.fileSystemResolver,
          ],
        },
        {
          interface: new Uri(defaultInterfaces.ipfsHttpClient),
          implementations: [new Uri(defaultInterfaces.ipfsHttpClient)],
        },
      ],
      resolver: RecursiveResolver.from([
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: defaultInterfaces.ipfsHttpClient,
              package: WasmPackage.from(
                fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.info")),
                fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.wasm"))
              ),
            },
            {
              uri: defaultPackages.ipfsResolver,
              package: WasmPackage.from(
                fs.readFileSync(path.join(ipfsResolverPath, "wrap.info")),
                fs.readFileSync(path.join(ipfsResolverPath, "wrap.wasm"))
              ),
            },
            {
              uri: defaultPackages.ethereum,
              package: ethereumPlugin({ connections }),
            },
            {
              uri: defaultPackages.ensResolver,
              package: ensResolverPlugin({
                addresses: {
                  testnet: ensAddresses.ensAddress,
                },
              }),
            },
            {
              uri: defaultInterfaces.fileSystem,
              package: fileSystemPlugin({}),
            },
            {
              uri: defaultPackages.fileSystemResolver,
              package: fileSystemResolverPlugin({}),
            },
            {
              uri: defaultInterfaces.http,
              package: httpPlugin({}),
            },
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
      ]),
    },
    {
      noDefaults: true,
    }
  );
};
