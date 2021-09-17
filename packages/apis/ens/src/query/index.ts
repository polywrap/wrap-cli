import { namehash, keccak256 } from "../utils";
import {
  Ethereum_Query,
  Input_getResolver,
  Input_getExpiryTimes,
  Input_getOwner,
  Input_getAddress,
  Input_getContentHash,
  Input_getReverseResolver,
  Input_getNameFromReverseResolver,
  Input_getNameFromAddress,
  Input_getContentHashFromDomain,
  Input_getAddressFromDomain,
  Input_getTextRecord,
} from "./w3";

export function getResolver(input: Input_getResolver): string {
  const domain = namehash(input.domain);

  const resolverAddress = Ethereum_Query.callContractView({
    address: input.registryAddress,
    method: "function resolver(bytes32 node) external view returns (address)",
    args: [domain],
    connection: input.connection,
  });

  return resolverAddress;
}

export function getOwner(input: Input_getOwner): string {
  const owner = Ethereum_Query.callContractView({
    address: input.registryAddress,
    method: "function owner(bytes32 node) external view returns (address)",
    args: [namehash(input.domain)],
    connection: input.connection,
  });

  return owner;
}

export function getAddress(input: Input_getAddress): string {
  const address = Ethereum_Query.callContractView({
    address: input.resolverAddress,
    method: "function addr(bytes32 node) external view returns (address)",
    args: [namehash(input.domain)],
    connection: input.connection,
  });

  return address;
}

export function getContentHash(input: Input_getContentHash): string {
  const hash = Ethereum_Query.callContractView({
    address: input.resolverAddress,
    method: "function contenthash(bytes32 node) external view returns (bytes)",
    args: [namehash(input.domain)],
    connection: input.connection,
  });

  return hash;
}

export function getAddressFromDomain(
  input: Input_getAddressFromDomain
): string {
  const resolverAddress = getResolver({
    registryAddress: input.registryAddress,
    domain: input.domain,
    connection: input.connection,
  });

  const address = Ethereum_Query.callContractView({
    address: resolverAddress,
    method: "function addr(bytes32 node) external view returns (address)",
    args: [namehash(input.domain)],
    connection: input.connection,
  });

  return address;
}

export function getContentHashFromDomain(
  input: Input_getContentHashFromDomain
): string {
  const resolverAddress = getResolver({
    registryAddress: input.registryAddress,
    domain: input.domain,
    connection: input.connection,
  });

  const hash = Ethereum_Query.callContractView({
    address: resolverAddress,
    method: "function contenthash(bytes32 node) external view returns (bytes)",
    args: [namehash(input.domain)],
    connection: input.connection,
  });

  return hash;
}

export function getExpiryTimes(input: Input_getExpiryTimes): string {
  const label = input.domain.split(".")[0];

  const expiryTime = Ethereum_Query.callContractView({
    address: input.registrarAddress,
    method:
      "function expiryTimes(bytes32 label) external view returns (uint256)",
    args: [keccak256(label)],
    connection: input.connection,
  });

  return expiryTime;
}

export function getReverseResolver(input: Input_getReverseResolver): string {
  const address = namehash(input.address.substr(2) + ".addr.reverse");

  const resolverAddress = Ethereum_Query.callContractView({
    address: input.registryAddress,
    method: "function resolver(bytes32 node) external view returns (address)",
    args: [address],
    connection: input.connection,
  });

  return resolverAddress;
}

export function getNameFromAddress(input: Input_getNameFromAddress): string {
  const address = namehash(input.address.substr(2) + ".addr.reverse");

  const resolverAddress = getReverseResolver({
    registryAddress: input.registryAddress,
    address: input.address,
    connection: input.connection,
  });

  const name = Ethereum_Query.callContractView({
    address: resolverAddress,
    method: "function name(bytes32 node) external view returns (string)",
    args: [address],
    connection: input.connection,
  });

  return name;
}

export function getNameFromReverseResolver(
  input: Input_getNameFromReverseResolver
): string {
  const address = namehash(input.address.substr(2) + ".addr.reverse");

  const name = Ethereum_Query.callContractView({
    address: input.resolverAddress,
    method: "function name(bytes32 node) external view returns (string)",
    args: [address],
    connection: input.connection,
  });

  return name;
}

export function getTextRecord(input: Input_getTextRecord): string {
  const value = Ethereum_Query.callContractView({
    address: input.resolverAddress,
    method: "function text(bytes32 node, string value) external view returns (string)",
    args: [namehash(input.domain), input.key],
    connection: input.connection,
  });

  return value;
}
