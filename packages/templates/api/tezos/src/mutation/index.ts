import {
  Tezos_Mutation,
  Tezos_TxOperation,
  Input_callContractMethod
} from "./w3";

export function callContractMethod(input: Input_callContractMethod): Tezos_TxOperation {
  return Tezos_Mutation.callContractMethod({
    address: input.address,
    method: input.method,
    args: input.args,
    connection: input.connection
  })
}
