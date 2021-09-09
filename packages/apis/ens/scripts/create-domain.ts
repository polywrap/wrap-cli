import { Web3ApiClient } from "@web3api/client-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin, EthereumProvider } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";

import { ethers, Wallet } from "ethers";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const uri = "ipfs/QmdAsjKDB8rJEdYc8nqCCXVMcCweDArau2oZ9qaF33KJZr";
  const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  const fifsAddress = "0x7bED8d0f143D14665bc438Fea4f4a952797D30fc";
  const resolverAddress = "0xf6305c19e814d2a75429Fd637d01F7ee0E77d615";
  const network = "rinkeby";
  const domain = "open.web3api.eth";
  const label = "test";
  const privKey = process.env.ETH_PRIV_KEY as string;

  if (!privKey) {
    throw Error("ETH_PRIV_KEY env variable is missing");
  }

  // Get the test ens address
  const { data } = await axios.get("http://localhost:4040/ens");
  const testnetEnsAddress = data.ensAddress as string;

  const provider = ethers.getDefaultProvider(network);
  const signer = new Wallet(privKey, provider);

  const client = new Web3ApiClient({
    redirects: [
      {
        from: "w3://ens/ipfs.web3api.eth",
        to: ipfsPlugin({
          provider: "http://localhost:5001",
          fallbackProviders: ["https://ipfs.io"]
        }),
      },
      {
        from: "w3://ens/ens.web3api.eth",
        to: ensPlugin({
          addresses: {
            testnet: testnetEnsAddress
          }
        }),
      },
      {
        from: "w3://ens/ethereum.web3api.eth",
        to: ethereumPlugin({
          networks: {
            rinkeby: {
              provider: provider as EthereumProvider,
              signer
            },
            testnet: {
              provider: "http://localhost:8545"
            }
          }
        }),
      }
    ]
  });

  const reg = await client.query<{
    registerSubnodeOwnerWithFIFSRegistrar: string
  }>({
    uri,
    query: `mutation {
      registerSubnodeOwnerWithFIFSRegistrar(
        label: "${label}"
        owner: "${await signer.getAddress()}"
        fifsRegistrarAddress: "${fifsAddress}"
        connection: {
          networkNameOrChainId: "${network}"
        }
      )
    }`
  });

  if (!reg.errors) {
    console.log(`Registered Subdomain "${label}"!`)
    console.log(reg.data?.registerSubnodeOwnerWithFIFSRegistrar);
  } else {
    throw Error(`Failed to register subdomain: ${reg.errors}`);
  }

  const setRes = await client.query<{
    setResolver: string
  }>({
    uri,
    query: `mutation {
      setResolver(
        domain: "${label}.${domain}"
        resolverAddress: "${resolverAddress}"
        registryAddress: "${ensAddress}"
        connection: {
          networkNameOrChainId: "${network}"
        }
      )
    }`
  });

  if (!setRes.errors) {
    console.log(`Set Resolver!`)
    console.log(setRes.data?.setResolver);
  } else {
    throw Error(`Failed to set resolver: ${setRes.errors}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() =>
    process.exit(0)
  );
