import { Uri, UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";

export async function setupWeb3ApiClient(): Promise<Web3ApiClient> {
  const ethereum = (window as any).ethereum;
  if (ethereum && ethereum.enable) {
    await ethereum.enable();
  }

  const redirects: UriRedirect[] = [
    {
      from: new Uri("w3://ens/ethereum.web3api.eth"),
      to: {
        factory: () => new EthereumPlugin({ provider: ethereum }),
        manifest: EthereumPlugin.manifest()
      }
    },
    {
      from: new Uri("w3://ens/ipfs.web3api.eth"),
      to: {
        factory: () => new IpfsPlugin({ provider: 'https://ipfs.io' }),
        manifest: IpfsPlugin.manifest()
      }
    },
    {
      from: new Uri("w3://ens/ens.web3api.eth"),
      to: {
        factory: () => new EnsPlugin({ }),
        manifest: EnsPlugin.manifest()
      }
    }
  ];

  return new Web3ApiClient({ redirects });
}
