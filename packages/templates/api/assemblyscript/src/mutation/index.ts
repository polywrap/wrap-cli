import {
  Ethereum_Mutation,
  Input_setData
} from "./w3";
import { abi, bytecode } from "../contracts/SimpleStorage";

export function setData(input: Input_setData): string {
  return Ethereum_Mutation.sendTransaction({
    address: input.address,
    method: "function set(uint256 value)",
    args: [input.value.toString()]
  });
}

export function deployContract(): string {
  return Ethereum_Mutation.deployContract({
    abi,
    bytecode
  });
}
