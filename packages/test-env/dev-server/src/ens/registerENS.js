import { loadContract } from "./utils"
import contentHash from 'content-hash'

const utils = require("web3-utils")
const namehash = require("eth-ens-namehash");

const ensJSON = loadContract("ens", "ENSRegistry");
const fifsRegistrarJSON = loadContract("ens", "FIFSRegistrar");
const publicResolverJSON = loadContract("resolver", "PublicResolver");

export async function registerENS({
  web3,
  accounts,
  addresses: {
    ensAddress,
    registrarAddress,
    resolverAddress
  },
  domain,
  cid
}) {

  const ens = new web3.eth.Contract(
    ensJSON.abi, ensAddress
  );

  const registrar = new web3.eth.Contract(
    fifsRegistrarJSON.abi, registrarAddress
  )

  const resolver = new web3.eth.Contract(
    publicResolverJSON.abi, resolverAddress
  );

  await registrar.methods.
    register(utils.sha3(domain.replace('.eth', '')), accounts[0])
    .send({ from: accounts[0] });

  await ens.methods
    .setResolver(namehash.hash(domain), resolverAddress)
    .send({ from: accounts[0] });

  await resolver.methods
    .setContenthash(namehash.hash(domain), `0x${contentHash.fromIpfs(cid)}`)
    .send({ gas: 5000000, from: accounts[0] });
}
