/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadContract, deploy } from "./utils";

import utils from "web3-utils";
import namehash from "eth-ens-namehash";
import Web3 from "web3";

const ensJSON = loadContract("ens", "ENSRegistry");
const fifsRegistrarJSON = loadContract("ens", "FIFSRegistrar");
const reverseRegistrarJSON = loadContract("ens", "ReverseRegistrar");
const publicResolverJSON = loadContract("resolver", "PublicResolver");

const tld = "eth";

export async function deployENS(
  web3: Web3,
  accounts: string[]
): Promise<{
  ensAddress: string;
  resolverAddress: string;
  registrarAddress: string;
  reverseAddress: string;
}> {
  // Registry
  const ens: any = await deploy(web3, accounts[0], ensJSON);

  // Resolver
  const resolver: any = await deploy(
    web3,
    accounts[0],
    publicResolverJSON,
    ens._address
  );
  await setupResolver(ens, resolver, accounts);

  // Registrar
  const registrar: any = await deploy(
    web3,
    accounts[0],
    fifsRegistrarJSON,
    ens._address,
    namehash.hash(tld)
  );
  await setupRegistrar(ens, registrar, accounts);

  // Reverse Registrar
  const reverse: any = await deploy(
    web3,
    accounts[0],
    reverseRegistrarJSON,
    ens._address,
    resolver._address
  );
  await setupReverseRegistrar(ens, resolver, reverse, accounts);

  return {
    ensAddress: ens._address,
    resolverAddress: resolver._address,
    registrarAddress: registrar._address,
    reverseAddress: reverse._address,
  };
}

async function setupResolver(ens, resolver, accounts) {
  const resolverNode = namehash.hash("resolver");
  const resolverLabel = utils.sha3("resolver");

  await send(
    ens.methods.setSubnodeOwner(
      "0x0000000000000000000000000000000000000000",
      resolverLabel,
      accounts[0]
    ),
    accounts[0]
  );
  await send(
    ens.methods.setResolver(resolverNode, resolver._address),
    accounts[0]
  );
  await send(
    resolver.methods.setAddr(resolverNode, resolver._address),
    accounts[0]
  );
}

async function setupRegistrar(ens, registrar, accounts) {
  await send(
    ens.methods.setSubnodeOwner(
      "0x0000000000000000000000000000000000000000",
      utils.sha3(tld),
      registrar._address
    ),
    accounts[0]
  );
}

async function setupReverseRegistrar(
  ens,
  resolver,
  reverseRegistrar,
  accounts
) {
  await send(
    ens.methods.setSubnodeOwner(
      "0x0000000000000000000000000000000000000000",
      utils.sha3("reverse"),
      accounts[0]
    ),
    accounts[0]
  );
  await send(
    ens.methods.setSubnodeOwner(
      namehash.hash("reverse"),
      utils.sha3("addr"),
      reverseRegistrar._address
    ),
    accounts[0]
  );
}

async function send(method, account) {
  return await method.send({ from: account });
}
