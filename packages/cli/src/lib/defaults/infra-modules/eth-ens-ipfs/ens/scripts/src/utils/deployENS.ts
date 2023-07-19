import { loadContract, deploy, utf8ToKeccak256, computeInterfaceId } from "./utils";

import { ethers } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ensJSON = loadContract( "registry", "ENSRegistry");
const fifsRegistrarJSON = loadContract( "registry", "FIFSRegistrar");
const reverseRegistrarJSON = loadContract("deployments", "ReverseRegistrar");
const nameWrapperJSON = loadContract( "deployments", "NameWrapper");
const iNameWrapperJSON = loadContract( "wrapper", "INameWrapper");
const publicResolverJSON = loadContract( "deployments", "PublicResolver");

const tld = "eth";

export async function deployENS(provider: ethers.providers.JsonRpcProvider) {
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  // Registry
  console.log("deploying registry");
  const ens = await deploy(provider, ensJSON);

  // Registrar
  console.log("deploying registrar");
  const registrar = await deploy(
    provider,
    fifsRegistrarJSON,
    ens.address,
    ethers.utils.namehash(tld)
  );
  console.log("setting up registrar");
  await setupRegistrar(ens, registrar);

  // Reverse Registrar
  console.log("deploying reverse registrar");
  const reverse = await deploy(
    provider,
    reverseRegistrarJSON,
    ens.address
  );
  console.log("setting up reverse registrar");
  await setupReverseRegistrar(ens, reverse, signerAddress);

  // Name Wrapper
  console.log("deploying name wrapper");
  const nameWrapper = await deploy(
    provider,
    nameWrapperJSON,
    ens.address,
    registrar.address,
    ZERO_ADDRESS,
  );
  console.log("setting up name wrapper");
  await setupNameWrapper(registrar, nameWrapper);

  // Resolver
  console.log("deploying resolver")
  const resolver = await deploy(
    provider,
    publicResolverJSON,
    ens.address,
    nameWrapper.address,
    registrar.address,
    reverse.address,
  );
  console.log("setting up resolver")
  await setupResolver(ens, resolver, reverse, nameWrapper);

  return {
    ensAddress: ens.address,
    resolverAddress: resolver.address,
    registrarAddress: registrar.address,
    reverseAddress: reverse.address,
  };
}

async function setupRegistrar(
  ens: ethers.Contract,
  registrar: ethers.Contract
) {
  await ens.setSubnodeOwner(
    ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32),
    utf8ToKeccak256(tld),
    registrar.address
  );
}

async function setupReverseRegistrar(
  ens: ethers.Contract,
  reverseRegistrar: ethers.Contract,
  accountAddress: string
) {
  await ens.setSubnodeOwner(
    ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32),
    utf8ToKeccak256("reverse"),
    accountAddress
  );
  await ens.setSubnodeOwner(
    ethers.utils.namehash("reverse"),
    utf8ToKeccak256("addr"),
    reverseRegistrar.address
  );
}

async function setupResolver(
  ens: ethers.Contract,
  resolver: ethers.Contract,
  reverseRegistrar: ethers.Contract,
  nameWrapper: ethers.Contract,
) {
  const tldNode = ethers.utils.namehash("eth");
  const iNameWrapper = new ethers.utils.Interface(iNameWrapperJSON.abi)
  const iNameWrapperId = computeInterfaceId(iNameWrapper);
  await resolver.setInterface(tldNode, iNameWrapperId, nameWrapper.address);

  const resolverNode = ethers.utils.namehash("resolver.eth");
  await ens.setResolver(resolverNode, resolver.address);
  await resolver["setAddr(bytes32,address)"](resolverNode, resolver.address);

  await reverseRegistrar.setDefaultResolver(resolver.address);
}

// async function setupNameWrapper(
//   registrar: ethers.Contract,
//   nameWrapper: ethers.Contract,
// ) {
//   await registrar.addController(nameWrapper.address)
// }
