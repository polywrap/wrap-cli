import {
  Ethereum_Mutation,
  Input_setData,
  Input_deployContract
} from "./w3";
import { abi, bytecode } from "../contracts/SimpleStorage";

export function setData(input: Input_setData): string {
  const res = Ethereum_Mutation.callContractMethod({
    address: input.address,
    method: "function set(uint256 value)",
    args: [input.value.toString()],
    connection: input.connection
  }).unwrap();

  return res.hash;
}

export function deployContract(input: Input_deployContract): string {
  return Ethereum_Mutation.deployContract({
    abi,
    bytecode,
    args: null,
    connection: input.connection
  }).unwrap();
}
