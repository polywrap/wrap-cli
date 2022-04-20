import { Ethereum_Mutation, Ethereum_Query } from "./w3/imported";
import {
  Input_setDataWithLargeArgs,
  Input_deployContract,
  Input_localVarMethod,
  Input_globalVarMethod,
  Input_subsequentInvokes,
  Input_setDataWithManyArgs,
  Input_setDataWithManyStructuredArgs,
} from "./w3/index";
import { returnTrue } from "../query";

export function setDataWithLargeArgs(
  input: Input_setDataWithLargeArgs
): string {
  const largeString = input.value;

  Ethereum_Mutation.callContractMethod({
    address: input.address,
    method: "function set(uint256 value)",
    args: ["66"],
    connection: input.connection,
  }).unwrap();

  return largeString;
}

export function setDataWithManyArgs(input: Input_setDataWithManyArgs): string {
  const argsA = input.valueA;
  const argsB = input.valueB;
  const argsC = input.valueC;
  const argsD = input.valueD;
  const argsE = input.valueE;
  const argsF = input.valueF;
  const argsG = input.valueG;
  const argsH = input.valueH;
  const argsI = input.valueI;
  const argsJ = input.valueJ;
  const argsK = input.valueK;
  const argsL = input.valueL;

  Ethereum_Mutation.callContractMethod({
    address: input.address,
    method: "function set(uint256 value)",
    args: ["55"],
    connection: input.connection,
  }).unwrap();

  return argsA + argsB + argsC + argsD + argsE + argsF + argsG + argsH + argsI + argsJ + argsK + argsL;
}

export function setDataWithManyStructuredArgs(
  input: Input_setDataWithManyStructuredArgs
): boolean {

  Ethereum_Mutation.callContractMethod({
    address: input.address,
    method: "function set(uint256 value)",
    args: ["44"],
    connection: input.connection,
  }).unwrap();

  return true;
}

export function deployContract(input: Input_deployContract): string {
  return Ethereum_Mutation.deployContract({
    abi: `[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"}],"name":"DataSet","type":"event"},{"inputs":[],"name":"get","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}]`,
    bytecode:
      "0x608060405234801561001057600080fd5b5061012a806100206000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b606860eb565b6040518082815260200191505060405180910390f35b806000819055507f3d38713ec8fb49acced894a52df2f06a371a15960550da9ba0f017cb7d07a8ec33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150565b6000805490509056fea2646970667358221220f312fe8d32f77c74cc4eb4a1f5c805d8bb124755ca4e8a1db2cce10cbb133dc564736f6c63430006060033",
    args: null,
    connection: input.connection,
  }).unwrap();
}

export function localVarMethod(input: Input_localVarMethod): boolean {
  let functionArg = false;

  functionArg = returnTrue();

  Ethereum_Mutation.callContractMethod({
    address: input.address,
    method: "function set(uint256 value)",
    args: ["88"],
    connection: input.connection,
  }).unwrap();

  return functionArg;
}

let globalValue = false;

export function globalVarMethod(input: Input_globalVarMethod): boolean {
  globalValue = true;

  Ethereum_Mutation.callContractMethod({
    address: input.address,
    method: "function set(uint256 value)",
    args: ["77"],
    connection: input.connection,
  }).unwrap();

  return globalValue;
}

export function subsequentInvokes(input: Input_subsequentInvokes): string[] {
  const result: string[] = [];

  for (let i = 0; i < input.numberOfTimes; i++) {
    Ethereum_Mutation.callContractMethod({
      address: input.address,
      method: "function set(uint256 value)",
      args: [i.toString()],
      connection: input.connection,
    }).unwrap();

    result[i] = Ethereum_Query.callContractView({
      address: input.address,
      method: "function get() view returns (uint256)",
      args: null,
      connection: input.connection,
    }).unwrap();
  }

  return result;
}
