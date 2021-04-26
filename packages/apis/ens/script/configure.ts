import { Web3ApiClient } from "@web3api/client-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin, EthereumProvider } from "@web3api/ethereum-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";

import { ethers, Wallet } from "ethers";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// TODO:
// - deploy web3api to testnet at testnet/ens.eth
// - create Web3ApiClient pointed to rinkeby w/ signer($ETH_PRIV_KEY)
// - send queries

async function main() {
  const uri = "ipfs/QmfPBVeJkVL78yecnTXx4tKd6kyFcGkAXSNtznKacHWvbG";
  const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  // const resolverAddress = "0xf6305c19e814d2a75429Fd637d01F7ee0E77d615";
  const network = "rinkeby";
  const domain = "open.someopendomain.eth";
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

/*
//PSEUDO-CODE Recipe to deploy and configure public subdomain
x const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
x const publicResolverAddress = "0x..."
x const label = "mysubdomain"
const owner = "0x..."
x const domain = "public.domain.eth"

x const fifsRegistrarAddress = await deployFIFSRegistrar(ensAddress, domain)
x await setSubdomainOwner(domain, fifsRegistrarAddress, ensAddress)
*/
