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
  defaultWrapperAliases,
} from "@polywrap/client-config-builder-js";
import fs from "fs";
import path from "path";
import { WasmPackage } from "@polywrap/wasm-js";

export const getClient = () => {
  const ipfsHttpClientPath = defaultEmbeddedWrapperPaths.ipfsHttpClient;
  const ipfsResolverPath = defaultEmbeddedWrapperPaths.ipfsResolver;

  return new PolywrapClient(
    {
      envs: [
        {
          uri: defaultWrapperAliases.ipfsResolver,
          env: {
            provider: providers.ipfs,
          },
        },
      ],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            defaultWrapperAliases.ipfsResolver,
            defaultPackages.ensResolver,
          ],
        },
      ],
      resolver: RecursiveResolver.from([
        PackageToWrapperCacheResolver.from(
          [
            {
              uri: defaultWrapperAliases.ipfsHttpClient,
              package: WasmPackage.from(
                fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.info")),
                fs.readFileSync(path.join(ipfsHttpClientPath, "wrap.wasm"))
              ),
            },
            {
              uri: defaultWrapperAliases.ipfsResolver,
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
            new ExtendableUriResolver(),
          ],
          new WrapperCache()
        )
      ]),
    },
    { noDefaults: true }
  );
};
