import { PluginRegistration, Uri } from "@web3api/core-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";
import { Tracer } from "@web3api/tracing-js";

export const getDefaultPlugins = Tracer.traceFunc(
  "client-js: getDefaultPlugins",
  (): PluginRegistration<Uri>[] => {
    return [
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
        uri: new Uri("w3://w3/logger"),
        plugin: loggerPlugin(),
      },
    ];
  }
);
