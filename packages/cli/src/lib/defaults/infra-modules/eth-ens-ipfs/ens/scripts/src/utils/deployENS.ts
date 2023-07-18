import { loadContract, deploy, utf8ToKeccak256 } from "./utils";

import { ethers } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ensJSON = loadContract( "registry", "ENSRegistry");
const fifsRegistrarJSON = loadContract( "registry", "FIFSRegistrar");
const reverseRegistrarJSON = loadContract("deployments", "ReverseRegistrar");
const publicResolverJSON = loadContract( "deployments", "PublicResolver");

const tld = "eth";

export async function deployENS(provider: ethers.providers.JsonRpcProvider) {
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  // Registry
  const ens = await deploy(provider, ensJSON);

  // Registrar
  const registrar = await deploy(
    provider,
    fifsRegistrarJSON,
    ens.address,
    ethers.utils.namehash(tld)
  );
  await setupRegistrar(ens, registrar, signerAddress);

  // Reverse Registrar
  const reverse = await deploy(
    provider,
    reverseRegistrarJSON,
    ens.address
  );
  await setupReverseRegistrar(ens, reverse, signerAddress);

  // Resolver
  const resolver = await deploy(
    provider,
    publicResolverJSON,
    ens.address,
    ZERO_ADDRESS,
    registrar.address,
    reverse.address,
  );
  await setupResolver(ens, resolver, signerAddress);

  return {
    ensAddress: ens.address,
    resolverAddress: resolver.address,
    registrarAddress: registrar.address,
    reverseAddress: reverse.address,
  };
}

async function setupResolver(
  ens: ethers.Contract,
  resolver: ethers.Contract,
  accountAddress: string
) {
  const resolverNode = ethers.utils.namehash("resolver");
  const resolverLabel = utf8ToKeccak256("resolver");

  await ens.setSubnodeOwner(
    ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32),
    resolverLabel,
    accountAddress
  );
  await ens.setResolver(resolverNode, resolver.address);
  await resolver["setAddr(bytes32,address)"](resolverNode, resolver.address);
}

async function setupRegistrar(
  ens: ethers.Contract,
  registrar: ethers.Contract,
  accountAddress: string
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
