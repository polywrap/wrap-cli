import { ClientConfig } from ".";

import { Uri, coreInterfaceUris } from "@web3api/core-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { uts46Plugin } from "@web3api/uts46-plugin-js";
import { sha3Plugin } from "@web3api/sha3-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";
import { Tracer } from "@web3api/tracing-js";

export const getDefaultClientConfig = Tracer.traceFunc(
  "client-js: getDefaultClientConfig",
  (): ClientConfig<Uri> => {
    return {
      environments: [],
      redirects: [],
      plugins: [
        // IPFS is required for downloading Web3API packages
        {
          uri: new Uri("w3://ens/ipfs.web3api.eth"),
          plugin: ipfsPlugin({ provider: "https://ipfs.io" }),
        },
        // ENS is required for resolving domain to IPFS hashes
        {
          uri: new Uri("w3://ens/ens.web3api.eth"),
          plugin: ensPlugin({}),
        },
        {
          uri: new Uri("w3://ens/ethereum.web3api.eth"),
          plugin: ethereumPlugin({
            networks: {
              mainnet: {
                provider:
                  "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
              },
            },
          }),
        },
        {
          uri: new Uri("w3://ens/js-logger.web3api.eth"),
          plugin: loggerPlugin(),
        },
        {
          uri: new Uri("w3://ens/uts46.web3api.eth"),
          plugin: uts46Plugin(),
        },
        {
          uri: new Uri("w3://ens/sha3.web3api.eth"),
          plugin: sha3Plugin(),
        },
      ],
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: [
            new Uri("w3://ens/ipfs.web3api.eth"),
            new Uri("w3://ens/ens.web3api.eth"),
          ],
        },
        {
          interface: coreInterfaceUris.logger,
          implementations: [new Uri("w3://ens/js-logger.web3api.eth")],
        },
      ],
    };
  }
);
