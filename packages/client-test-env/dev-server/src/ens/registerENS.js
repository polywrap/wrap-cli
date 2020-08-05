import { registerName, loadContract, namehash, deploy } from "./utils"
import contentHash from 'content-hash'

const baseRegistrarJSON = loadContract('ethregistrar', 'BaseRegistrarImplementation');
const ensJSON = loadContract('ens', 'ENSRegistry');
const controllerJSON = loadContract('ethregistrar', 'ETHRegistrarController');
const resolverJSON = loadContract('resolver', 'PublicResolver');

async function registerENS({
  web3,
  accounts,
  addresses: {
    ensAddress,
    controllerAddress,
    resolverAddress,
    baseRegistrarAddress
  },
  domain,
  cid
}) {
  const baseRegistrarContract = (new web3.eth.Contract(baseRegistrarJSON.abi, baseRegistrarAddress)).methods;
  const ensContract = (new web3.eth.Contract(ensJSON.abi, ensAddress)).methods;
  const controllerContract = (new web3.eth.Contract(controllerJSON.abi, controllerAddress)).methods;
  const resolverContract = (new web3.eth.Contract(resolverJSON.abi, resolverAddress)).methods;

  /*console.log("HERERERE")
  console.log(await controllerContract.available(domain).call())

  // Register the name in the registrar
  await registerName(
    web3,
    accounts[0],
    controllerContract,
    domain
  );

  console.log("HERERERE")
  console.log(await controllerContract.available(domain).call())

  // Create the new resolver
  const newResolver = await deploy(
    web3,
    accounts[0],
    resolverJSON,
    ensAddress
  );

  console.log("11111")
  console.log(await ensContract.recordExists(namehash(domain)).call())
  console.log(await ensContract.owner(namehash(domain)).call())
  // Point it to the public resolver
  await ensContract
    .setResolver(namehash(domain), newResolver._address)
    .send({ from: accounts[0] });

  console.log("222222")

  // Set the CID
  await newResolver.methods
    .setContenthash(namehash(domain), `0x${contentHash.fromIpfs(cid)}`)
    .send({ gas: 5000000, from: accounts[0] });*/

  /*
  // Set up baz.eth with a resolver and addr record
  ens.setSubnodeOwner(tldnode, sha3('baz'), this);
  var bazDotEth = sha3(tldnode, sha3('baz'));
  ens.setResolver(bazDotEth, resolver);
  resolver.setAddr(bazDotEth, this);
  */

  console.log(await ensContract.owner(namehash('eth')).call())

  console.log("11111")
  // Register the name in the registrar
  console.log(await baseRegistrarContract.available(namehash(domain)).call())
  await baseRegistrarContract
    .registerOnly(namehash(domain.replace('.eth', '')), accounts[0], 365 * 24 * 60 * 60)
    .send({ from: accounts[0] });

  console.log("222222222222222")
  // Create the new resolver
  const newResolver = await deploy(
    web3,
    accounts[0],
    resolverJSON,
    ensAddress
  );

  console.log(await ensContract.owner(namehash(domain)).call())
  console.log(accounts[0])

  console.log("333333333333")
  await ensContract
    .setResolver(namehash(domain), newResolver._address)
    .send({ from: accounts[0] });

  console.log("4444444444444")
  // Set the CID
  await newResolver.methods
    .setContenthash(namehash(domain), `0x${contentHash.fromIpfs(cid)}`)
    .send({ from: accounts[0] });

  console.log("5555555555555555")
}

export default registerENS
