import { loadContract, deploy, utf8ToKeccak256 } from "./utils";

import { ethers } from "ethers";

const ensJSON = loadContract("ens", "ENSRegistry");
const fifsRegistrarJSON = loadContract("ens", "FIFSRegistrar");
const reverseRegistrarJSON = loadContract("ens", "ReverseRegistrar");
const publicResolverJSON = loadContract("resolver", "PublicResolver");

const tld = "eth";

export async function deployENS(provider: ethers.providers.JsonRpcProvider) {
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  // Registry
  const ens = await deploy(provider, ensJSON);

  // Resolver
  const resolver = await deploy(provider, publicResolverJSON, ens.address);
  await setupResolver(ens, resolver, signerAddress);

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
    ens.address,
    resolver.address
  );
  await setupReverseRegistrar(ens, reverse, signerAddress);

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
