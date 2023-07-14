import { loadContract, utf8ToKeccak256 } from "./utils";

import { ethers } from "ethers";

const contentHash = require("content-hash");
const ensJSON = loadContract( "ENSRegistry");
const fifsRegistrarJSON = loadContract( "FIFSRegistrar");
const publicResolverJSON = loadContract( "PublicResolver");

interface RegisterArgs {
  provider: ethers.providers.JsonRpcProvider;
  addresses: {
    ensAddress: string;
    registrarAddress: string;
    resolverAddress: string;
  };
  domain: string;
  cid: string;
}

export async function registerENS({
  provider,
  addresses: { ensAddress, registrarAddress, resolverAddress },
  domain,
  cid,
}: RegisterArgs) {
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  const ens = new ethers.Contract(ensAddress, ensJSON.abi, signer);

  const registrar = new ethers.Contract(
    registrarAddress,
    fifsRegistrarJSON.abi,
    signer
  );

  const resolver = new ethers.Contract(
    resolverAddress,
    publicResolverJSON.abi,
    signer
  );

  await registrar.methods.register(
    utf8ToKeccak256(domain.replace(".eth", "")),
    signerAddress
  );

  await ens.methods.setResolver(ethers.utils.namehash(domain), resolverAddress);

  await resolver.methods.setContenthash(
    ethers.utils.namehash(domain),
    `0x${contentHash.fromIpfs(cid)}`,
    { gas: 5000000 }
  );
}
