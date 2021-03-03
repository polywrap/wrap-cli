import { Ethereum_Mutation } from "./w3/imported";
import { Input_setData, Input_setResolver } from "./w3";

export function setData(input: Input_setData): string {
  return Ethereum_Mutation.sendTransaction({
    address: input.address,
    method: "function set(uint256 value)",
    args: [input.value.toString()],
  });
}

export function setResolver({
  contractAddress,
  resolverAddress,
}: Input_setResolver): string {
  return Ethereum_Mutation.sendTransaction({
    address: contractAddress,
    method: "function resolver(bytes32 node) constant returns (Resolver)",
    args: [resolverAddress.value.toString()],
  });
}
