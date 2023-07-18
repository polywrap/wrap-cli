import { utf8ToKeccak256 } from "./utils";

const namehash = require('eth-ens-namehash');
const tld = "eth";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

interface ENSRegistry {
  deploy: Function;
  deployed: Function;
  setSubnodeOwner: Function;
  setResolver: Function;
  address: string;
}

interface FIFSRegistrar {
  deploy: Function;
  deployed: Function;
  address: string;
}

interface ReverseRegistrar {
  deploy: Function;
  deployed: Function;
  address: string;
}

interface PublicResolver {
  deploy: Function;
  deployed: Function;
  setAddr: Function;
  address: string;
}

export async function deployENS(ethers: { getContractFactory: (arg0: string) => any; getSigners: () => any; }) {
  const ENSRegistry: ENSRegistry = await ethers.getContractFactory("ENSRegistry")
  const FIFSRegistrar: FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar")
  const ReverseRegistrar : ReverseRegistrar= await ethers.getContractFactory("ReverseRegistrar")
  const PublicResolver: PublicResolver = await ethers.getContractFactory("PublicResolver")
  const signers: { address: string; }[] = await ethers.getSigners();
  const accounts: string[] = signers.map((s) => s.address)

  console.log("deploying ENS Registry");
  const ens = await ENSRegistry.deploy();
  await ens.deployed();

  console.log("deploying Public Resolver");
  const resolver = await PublicResolver.deploy(ens.address, ZERO_ADDRESS);
  await resolver.deployed();
  await setupResolver(ens, resolver, accounts);

  console.log("deploying FIFS Registrar");
  const registrar = await  FIFSRegistrar.deploy(ens.address, namehash.hash(tld));
  await registrar.deployed();
  await setupRegistrar(ens, registrar);

  console.log("deploying Reverse Registrar");
  const reverse = await ReverseRegistrar.deploy(ens.address, resolver.address);
  await reverse.deployed();
  await setupReverseRegistrar(ens, registrar, reverse, accounts);

  return {
    ensAddress: ens.address,
    resolverAddress: resolver.address,
    registrarAddress: registrar.address,
    reverseAddress: reverse.address,
  };
}

async function setupResolver(ens: ENSRegistry, resolver: PublicResolver, accounts: string[]): Promise<void> {
  const resolverNode = namehash.hash("resolver");
  const resolverLabel = utf8ToKeccak256("resolver");
  await ens.setSubnodeOwner(ZERO_HASH, resolverLabel, accounts[0]);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver.setAddr(resolverNode, resolver.address);
}

async function setupRegistrar(ens: ENSRegistry, registrar: FIFSRegistrar): Promise<void> {
  await ens.setSubnodeOwner(ZERO_HASH, utf8ToKeccak256(tld), registrar.address);
}

async function setupReverseRegistrar(ens: ENSRegistry, registrar: FIFSRegistrar, reverseRegistrar: ReverseRegistrar, accounts: string[]): Promise<void> {
  await ens.setSubnodeOwner(ZERO_HASH, utf8ToKeccak256("reverse"), accounts[0]);
  await ens.setSubnodeOwner(namehash.hash("reverse"), utf8ToKeccak256("addr"), reverseRegistrar.address);
}
