import { loadContract, loadLocalContract } from "./utils"
import contentHash from 'content-hash'

const utils = require("web3-utils")
const namehash = require("eth-ens-namehash");

const ensJSON = loadContract("ens", "ENSRegistry");
const fifsRegistrarJSON = loadContract("ens", "FIFSRegistrar");
const publicResolverJSON = loadContract("resolver", "PublicResolver");
const polywrapRegistryJSON = loadLocalContract("PolywrapRegistry");

export async function registerENS({
  web3,
  accounts,
  addresses: {
    ensAddress,
    registrarAddress,
    resolverAddress,
    polywrapRegistryAddress
  },
  domain,
  major,
  minor,
  patch,
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

  const polywrapRegistry = new web3.eth.Contract(
    polywrapRegistryJSON.abi, polywrapRegistryAddress
  );

  await registrar.methods.
    register(utils.sha3(domain.replace('.eth', '')), accounts[0])
    .send({ from: accounts[0] });

  await ens.methods
    .setResolver(namehash.hash(domain), resolverAddress)
    .send({ from: accounts[0] });

  await resolver.methods
    .setText(namehash.hash(domain), 'polywrap-controller', accounts[0])
    .send({ gas: 5000000, from: accounts[0] });

  await polywrapRegistry.methods
    .registerAPI(namehash.hash(domain))
    .send({ gas: 5000000, from: accounts[0] });

  console.log(`0x${contentHash.fromIpfs(cid)}`);

  await polywrapRegistry.methods
    .publishNewVersion(utils.keccak256(namehash.hash(domain)), major, minor, patch, `${cid}`)
    .send({ gas: 5000000, from: accounts[0] });
}
