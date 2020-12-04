import { UriRedirect } from "../client";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";

export function getCorePluginRedirects(): UriRedirect[] {
  // NOTE: These are high-level primitives for core plugins,
  //       over time, we will further de-abstract these core plugins
  return [
    // IPFS is required for downloading Web3API packages
    {
      from: "ipfs.web3api.eth",
      to: () => new IpfsPlugin({
        provider: "https://ipfs.infura.io"
      })
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      from: "ethereum.web3api.eth",
      to: () => new EthereumPlugin({
        // TODO: move away from centralized gateway
        provider: "https://eth-mainnet.gateway.pokt.network/v1/5fc677007c6654002ed13350"
      })
    }
  ]
}
