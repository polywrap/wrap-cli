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
  defaultEmbeddedWrapperPaths,
  defaultPackages,
} from "@polywrap/client-config-builder-js";
import fs from "fs";
import path from "path";
import { WasmPackage } from "@polywrap/wasm-js";
import { httpPlugin } from "@polywrap/http-plugin-js";

export const getClient = () => {
  const ipfsHttpClientPath = defaultEmbeddedWrapperPaths.ipfsHttpClient;
  const ipfsResolverPath = defaultEmbeddedWrapperPaths.ipfsResolver;

  return new PolywrapClient(
    {
      envs: [
        {
          uri: defaultPackages.ipfsResolver,
          env: {
            provider: providers.ipfs,
          },
        },
      ],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            defaultPackages.ipfsResolver,
            defaultPackages.ensResolver,
          ],
        },
      ],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: defaultPackages.ipfsHttpClient,
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
              uri: defaultPackages.ensResolver,
              package: ensResolverPlugin({
                addresses: {
                  testnet: ensAddresses.ensAddress,
                },
              }),
            },
            {
              uri: defaultPackages.http,
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
