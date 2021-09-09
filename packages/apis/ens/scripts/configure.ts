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
  const network = "rinkeby";
  const domain = "open.web3api.eth";
  const privKey = process.env.ETH_PRIV_KEY as string;

  if (!privKey) {
    throw Error("ETH_PRIV_KEY env variable is missing");
  }

  // Get the test ens address
  const { data } = await axios.get("http://localhost:4040/ens");
  const testnetEnsAddress = data.ensAddress as string;

  const rinkebyProvider = ethers.getDefaultProvider("rinkeby");

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
              provider: rinkebyProvider as EthereumProvider,
              signer: new Wallet(privKey, rinkebyProvider)
            },
            testnet: {
              provider: "http://localhost:8545"
            }
          }
        }),
      }
    ]
  })

  // Deploy a new instance of the FIFS registrar
  const deployFifs = await client.query<{
    deployFIFSRegistrar: string
  }>({
    uri,
    query: `mutation {
      deployFIFSRegistrar(
        registryAddress: "${ensAddress}"
        tld: "${domain}"
        connection: {
          networkNameOrChainId: "${network}"
        }
      )
    }`
  });

  if (!deployFifs.errors) {
    console.log("Deployed FIFSRegistrar!")
    console.log(deployFifs.data?.deployFIFSRegistrar);
  } else {
    throw Error(`Failed to deploy FIFSRegistrar: ${deployFifs.errors}`);
  }

  const fifsAddress = deployFifs.data?.deployFIFSRegistrar;

  // Set the subdomain's owner to the FIFSRegistrar
  const setOwner = await client.query<{
    setOwner: string
  }>({
    uri,
    query: `mutation {
      setOwner(
        domain: "${domain}"
        newOwner: "${fifsAddress}"
        registryAddress: "${ensAddress}"
        connection: {
          networkNameOrChainId: "${network}"
        }
      )
    }`
  });

  if (!setOwner.errors) {
    console.log("Set Owner Succeeded!")
    console.log(setOwner.data?.setOwner);
  } else {
    throw Error(`Failed to Set Owner: ${setOwner.errors}`);
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
