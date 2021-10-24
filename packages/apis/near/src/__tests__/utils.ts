import { ClientConfig, coreInterfaceUris } from "@web3api/client-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { nearPlugin, KeyStores } from "@web3api/near-plugin-js";

export function getPlugins(ethereum: string, ipfs: string, ensAddress: string, nearKeyStore: KeyStores.KeyStore): ClientConfig {
  return {
    redirects: [],
    plugins: [
      {
        uri: "w3://ens/ipfs.web3api.eth",
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: "w3://ens/ens.web3api.eth",
        plugin: ensPlugin({ addresses: { testnet: ensAddress } }),
      },
      {
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereum
            },
          },
          defaultNetwork: "testnet"
        }),
      },
      {
        uri: "w3://ens/near.web3api.eth",
        plugin: nearPlugin({
          networkId: "testnet",
          keyStore: nearKeyStore,
          nodeUrl: "https://rpc.testnet.near.org",
          walletUrl: "https://wallet.testnet.near.org",
          helperUrl: "https://helper.testnet.near.org",
          explorerUrl: "https://explorer.testnet.near.org",
        }),
      },
    ],
    interfaces: [
      {
        interface: coreInterfaceUris.uriResolver.uri,
        implementations: [
          "w3://ens/ipfs.web3api.eth",
          "w3://ens/ens.web3api.eth",
        ],
      },
      {
        interface: coreInterfaceUris.logger.uri,
        implementations: ["w3://ens/js-logger.web3api.eth"],
      },
    ],
  };
}