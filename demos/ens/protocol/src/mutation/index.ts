import { getResolver } from "../query";
import { namehash, keccak256 } from "../utils";
import { abi, bytecode} from "../contracts/FIFSRegistrar"
import {
  Ethereum_Mutation,
  Input_registerDomain,
  Input_reverseRegisterDomain,
  Input_setAddress,
  Input_setAddressFromDomain,
  Input_setContentHash,
  Input_setContentHashFromDomain,
  Input_setName,
  Input_setOwner,
  Input_setResolver,
  Input_setSubdomainOwner,
  Input_setSubdomainRecord,
  Input_setRecord,
  Input_deployFIFSRegistrar,
  Input_registerSubnodeOwnerWithFIFSRegistrar
} from "./w3";

export function setResolver(input: Input_setResolver): string {
  const setResolverTx = Ethereum_Mutation.sendTransaction({
    address: input.registryAddress,
    method: "function setResolver(bytes32 node, address owner)",
    args: [namehash(input.domain), input.resolverAddress],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return setResolverTx;
}

export function registerDomain(input: Input_registerDomain): string {
  const label = input.domain.split(".")[0];

  const tx = Ethereum_Mutation.sendTransaction({
    address: input.registrarAddress,
    method: "function register(bytes32 label, address owner)",
    args: [keccak256(label), input.owner],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return tx;
}

export function setOwner(input: Input_setOwner): string {
  let tx = Ethereum_Mutation.sendTransaction({
    address: input.registryAddress,
    method: "function setOwner(bytes32 node, address owner) external",
    args: [namehash(input.domain), input.newOwner],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return tx
}

export function setSubdomainOwner(input: Input_setSubdomainOwner): string {
  const splitDomain = input.subdomain.split(".")
  const subdomainLabel = splitDomain[0]
  const domain = splitDomain.slice(1, splitDomain.length).join(".")
  
  let tx = Ethereum_Mutation.sendTransaction({
    address: input.registryAddress,
    method: "function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external",
    args: [namehash(domain), keccak256(subdomainLabel), input.owner],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return tx
}

export function setSubdomainRecord(input: Input_setSubdomainRecord): string {
  const tx = Ethereum_Mutation.sendTransaction({
    address: input.registryAddress,
    method: "function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl)",
    args: [namehash(input.domain), keccak256(input.label), input.owner, input.resolverAddress, input.ttl],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return tx
}

//TODO: Where could this be used on mainnet?
export function setRecord(input: Input_setRecord): string {
  const tx = Ethereum_Mutation.sendTransaction({
    address: input.registryAddress,
    method: "function setRecord(bytes32 node, address owner, address resolver, uint64 ttl)",
    args: [namehash(input.domain), input.owner, input.resolverAddress, input.ttl],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return tx
}

export function setName(input: Input_setName): string {
  const setNameTx = Ethereum_Mutation.sendTransaction({
    address: input.reverseRegistryAddress,
    method: "function setName(string name)",
    args: [input.domain],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
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
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
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
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return setAddrTx;
}

export function setContentHash(input: Input_setContentHash): string {
  const setContentHash = Ethereum_Mutation.sendTransaction({
    address: input.resolverAddress,
    method: "function setContenthash(bytes32 node, bytes hash)",
    args: [namehash(input.domain), input.cid],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
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
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
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
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return setContentHash;
}

export function deployFIFSRegistrar(input: Input_deployFIFSRegistrar): string {
  const address = Ethereum_Mutation.deployContract({
    abi,
    bytecode,
    args: [input.registryAddress, namehash(input.tld)],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    },
  })

  return address
}

//TODO: needs testing here with a recipe. Was tested in the Web3Hub

export function registerSubnodeOwnerWithFIFSRegistrar(input: Input_registerSubnodeOwnerWithFIFSRegistrar): string {
  const txHash = Ethereum_Mutation.sendTransaction({
    address: input.fifsRegistrarAddress,
    method: "function register(bytes32 label, address owner) external",
    args: [keccak256(input.label), input.owner],
    connection: {
      networkNameOrChainId: "testnet",
      node: null
    }
  });

  return txHash
}
