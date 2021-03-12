import { Uri, UriRedirect } from "@web3api/core-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";

export function getDefaultRedirects(): UriRedirect[] {
  // NOTE: These are high-level primitives for core plugins,
  //       over time, we will further de-abstract these core plugins
  return [
    // IPFS is required for downloading Web3API packages
    {
      from: new Uri("w3://ens/ipfs.web3api.eth"),
      to: ipfsPlugin({ provider: "https://ipfs.infura.io " }),
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      from: new Uri("w3://ens/ens.web3api.eth"),
      to: ensPlugin({}),
    },
    {
      from: new Uri("w3://ens/ethereum.web3api.eth"),
      to: ethereumPlugin({
        provider:
          "https://eth-mainnet.gateway.pokt.network/v1/5fc677007c6654002ed13350",
      }),
    },
  ];
}
