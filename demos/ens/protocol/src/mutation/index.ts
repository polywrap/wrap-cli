import { getResolver } from "../query";
import { getLabelFromDomain, namehash, sha3 } from "../utils";
import {
  Ethereum_Mutation,
  Input_registerDomain,
  Input_reverseRegisterDomain,
  Input_setAddress,
  Input_setAddressFromDomain,
  Input_setContentHash,
  Input_setContentHashFromDomain,
  Input_setName,
  Input_setResolver,
} from "./w3";

export function setResolver(input: Input_setResolver): string {
  const setResolverTx = Ethereum_Mutation.sendTransaction({
    address: input.registryAddress,
    method: "function setResolver(bytes32 node, address owner)",
    args: [namehash(input.domain), input.resolverAddress],
  });

  return setResolverTx;
}

export function registerDomain(input: Input_registerDomain): string {
  const label = getLabelFromDomain(input.domain);

  Ethereum_Mutation.sendTransaction({
    address: input.registrarAddress,
    method: "function register(bytes32 label, address owner)",
    args: [sha3(label), input.owner],
  });

  const setResolverTx = setResolver({
    domain: input.domain,
    registryAddress: input.registryAddress,
    resolverAddress: input.resolverAddress,
  });

  return setResolverTx;
}

export function setName(input: Input_setName): string {
  const setNameTx = Ethereum_Mutation.sendTransaction({
    address: input.reverseRegistryAddress,
    method: "function setName(string name)",
    args: [input.domain],
  });

  return setNameTx;
}

export function reverseRegisterDomain(
  input: Input_reverseRegisterDomain
): string {
  Ethereum_Mutation.sendTransaction({
    address: input.reverseRegistryAddress,
    method: "function claim(address owner)",
    args: [input.owner],
  });

  const setNameTx = setName({
    reverseRegistryAddress: input.reverseRegistryAddress,
    domain: input.domain,
  });

  return setNameTx;
}

export function setAddress(input: Input_setAddress): string {
  const setAddrTx = Ethereum_Mutation.sendTransaction({
    address: input.resolverAddress,
    method: "function setAddr(bytes32 node, address addr)",
    args: [namehash(input.domain), input.address],
  });

  return setAddrTx;
}

export function setContentHash(input: Input_setContentHash): string {
  const setContentHash = Ethereum_Mutation.sendTransaction({
    address: input.resolverAddress,
    method: "function setContenthash(bytes32 node, bytes hash)",
    args: [namehash(input.domain), input.cid],
  });

  return setContentHash;
}

export function setAddressFromDomain(input: Input_setAddressFromDomain): string {
  const resolverAddress = getResolver({
    domain: input.domain,
    registryAddress: input.registryAddress
  })
  
  const setAddrTx = Ethereum_Mutation.sendTransaction({
    address: resolverAddress,
    method: "function setAddr(bytes32 node, address addr)",
    args: [namehash(input.domain), input.address],
  });

  return setAddrTx;
}

export function setContentHashFromDomain(input: Input_setContentHashFromDomain): string {
  const resolverAddress = getResolver({
    domain: input.domain,
    registryAddress: input.registryAddress
  })

  const setContentHash = Ethereum_Mutation.sendTransaction({
    address: resolverAddress,
    method: "function setContenthash(bytes32 node, bytes hash)",
    args: [namehash(input.domain), input.cid],
  });

  return setContentHash;
}
