import {
  Ethereum_Module,
  Input_deployContract,
  Input_setData,
  Input_getData,
} from "./wrap";
import { abi, bytecode } from "./contracts/SimpleStorage";

export function getData(input: Input_getData): u32 {
  const res = Ethereum_Module.callContractView({
    address: input.address,
    method: "function get() view returns (uint256)",
    args: null,
    connection: input.connection,
  }).unwrap();

  return U32.parseInt(res);
}

export function setData(input: Input_setData): string {
  const res = Ethereum_Module.callContractMethod({
    address: input.address,
    method: "function set(uint256 value)",
    args: [input.value.toString()],
    connection: input.connection,
    txOverrides: null,
  }).unwrap();

  return res.hash;
}

export function deployContract(input: Input_deployContract): string {
  return Ethereum_Module.deployContract({
    abi,
    bytecode,
    args: null,
    connection: input.connection,
  }).unwrap();
}
