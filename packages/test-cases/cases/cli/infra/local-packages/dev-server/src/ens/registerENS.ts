import { loadContract } from "./utils";

import contentHash from "content-hash";
import utils from "web3-utils";
import namehash from "eth-ens-namehash";
import Web3 from "web3";

const ensJSON = loadContract("ens", "ENSRegistry");
const fifsRegistrarJSON = loadContract("ens", "FIFSRegistrar");
const publicResolverJSON = loadContract("resolver", "PublicResolver");

interface RegisterParams {
  web3: Web3;
  accounts: string[];
  addresses: {
    ensAddress: string;
    registrarAddress: string;
    resolverAddress: string;
  };
  domain: string;
  cid: string;
}

export async function registerENS({
  web3,
  accounts,
  addresses: { ensAddress, registrarAddress, resolverAddress },
  domain,
  cid,
}: RegisterParams): Promise<void> {
  const ens = new web3.eth.Contract(ensJSON.abi, ensAddress);

  const registrar = new web3.eth.Contract(
    fifsRegistrarJSON.abi,
    registrarAddress
  );

  const resolver = new web3.eth.Contract(
    publicResolverJSON.abi,
    resolverAddress
  );

  await registrar.methods
    .register(utils.sha3(domain.replace(".eth", "")), accounts[0])
    .send({ from: accounts[0] });

  await ens.methods
    .setResolver(namehash.hash(domain), resolverAddress)
    .send({ from: accounts[0] });

  await resolver.methods
    .setContenthash(namehash.hash(domain), `0x${contentHash.fromIpfs(cid)}`)
    .send({ gas: 5000000, from: accounts[0] });
}
