import { UriRedirect } from "../client";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";

export function getCorePluginRedirects(env: () => any): UriRedirect[] {
  return [
    // IPFS is required for downloading Web3API packages
    {
      from: "ipfs.web3api.eth",
      to: () => new IpfsPlugin({
        provider:
          env()["ipfs.web3api.eth"]?.provider ||
          "https://ipfs.infura.io"
      })
    },
    // ENS is required for resolving domain to IPFS hashes
    {
      from: "ethereum.web3api.eth",
      to: () => new EthereumPlugin({
        provider:
          env()["ethereum.web3api.eth"]?.provider ||
          "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6"
      })
    }
  ]
}
