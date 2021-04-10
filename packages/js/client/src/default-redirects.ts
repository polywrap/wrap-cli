import { Uri, UriRedirect } from "@web3api/core-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";

export function getDefaultRedirects(): UriRedirect<Uri>[] {
  // NOTE: These are high-level primitives for core plugins,
  //       over time, we will further de-abstract these core plugins
  return [
    // IPFS is required for downloading Web3API packages
    {
      from: new Uri("w3://ens/ipfs.web3api.eth"),
      to: ipfsPlugin({ provider: "https://ipfs.io" }),
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      from: new Uri("w3://ens/ens.web3api.eth"),
      to: ensPlugin({}),
    },
    {
      from: new Uri("w3://ens/ethereum.web3api.eth"),
      to: ethereumPlugin({
        mainnet: {
          provider:
          "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
        }
      }),
    },
    {
      from: new Uri("w3://w3/logger"),
      to: loggerPlugin(),
    },
  ];
}
