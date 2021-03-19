import { Web3ApiClient, UriRedirect } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";

export async function setupWeb3ApiClient(): Promise<Web3ApiClient> {
  const ethereum = (window as any).ethereum;
  if (ethereum && ethereum.enable) {
    await ethereum.enable();
  }

  const redirects: UriRedirect[] = [
    {
      from: "w3://ens/ethereum.web3api.eth",
      to: ethereumPlugin({ provider: ethereum }),
    },
    {
      from: "w3://ens/ipfs.web3api.eth",
      to: ipfsPlugin({ provider: "https://ipfs.io" }),
    },
    {
      from: "w3://ens/ens.web3api.eth",
      to: ensPlugin({}),
    }
  ];

  return new Web3ApiClient({ redirects });
}
