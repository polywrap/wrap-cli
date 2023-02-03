import { ensResolverPlugin } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import {
  RecursiveResolver,
  PackageToWrapperCacheResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { PolywrapClient } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  defaultEmbeddedWrapperPaths, defaultInterfaces,
  defaultPackages,
} from "@polywrap/client-config-builder-js";
import fs from "fs";
import path from "path";
import { WasmPackage } from "@polywrap/wasm-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { Uri } from "@polywrap/core-js";

export const getClient = () => {
  const ipfsHttpClientPath = defaultEmbeddedWrapperPaths.ipfsHttpClient;
  const ipfsResolverPath = defaultEmbeddedWrapperPaths.ipfsResolver;

  return new PolywrapClient<string>(
    {
      envs: [{
        uri: defaultPackages.ipfsResolver,
        env: {
          provider: providers.ipfs,
          retries: { tryResolveUri: 1, getFile: 1 },
        },
      }],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri.uri,
          implementations: [
            defaultPackages.ipfsResolver,
            defaultPackages.ensResolver,
          ],
        },
        {
          interface: defaultInterfaces.ipfsHttpClient,
          implementations: [defaultInterfaces.ipfsHttpClient],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: Uri.from(defaultInterfaces.ipfsHttpClient),
              package: WasmPackage.from(
                fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.info")),
                fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.wasm"))
              ),
            },
            {
              uri: Uri.from(defaultPackages.ipfsResolver),
              package: WasmPackage.from(
                fs.readFileSync(path.join(ipfsResolverPath, "wrap.info")),
                fs.readFileSync(path.join(ipfsResolverPath, "wrap.wasm"))
              ),
            },
            {
              uri: Uri.from(defaultPackages.ethereum),
              package: ethereumPlugin({
                connections: new Connections({
                  networks: {
                    testnet: new Connection({
                      provider: providers.ethereum,
                    }),
                  },
                  defaultNetwork: "testnet",
                }),
              }),
            },
            {
              uri: Uri.from(defaultPackages.ensResolver),
              package: ensResolverPlugin({
                addresses: {
                  testnet: ensAddresses.ensAddress,
                },
              }),
            },
            {
              uri: Uri.from(defaultInterfaces.http),
              package: httpPlugin({}),
            },
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
      ),
    },
    { noDefaults: true }
  );
};
