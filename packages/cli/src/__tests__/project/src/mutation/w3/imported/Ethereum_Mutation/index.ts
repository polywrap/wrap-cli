import {
  w3_subinvoke,
  w3_subinvokeImplementation,
  Nullable,
  BigInt,
  JSON,
  Result
} from "@web3api/wasm-as";
import {
  serializecallContractMethodArgs,
  deserializecallContractMethodResult,
  Input_callContractMethod,
  serializecallContractMethodAndWaitArgs,
  deserializecallContractMethodAndWaitResult,
  Input_callContractMethodAndWait,
  serializesendTransactionArgs,
  deserializesendTransactionResult,
  Input_sendTransaction,
  serializesendTransactionAndWaitArgs,
  deserializesendTransactionAndWaitResult,
  Input_sendTransactionAndWait,
  serializedeployContractArgs,
  deserializedeployContractResult,
  Input_deployContract,
  serializesignMessageArgs,
  deserializesignMessageResult,
  Input_signMessage,
  serializesendRPCArgs,
  deserializesendRPCResult,
  Input_sendRPC
} from "./serialization";
import * as Types from "../..";

export class Ethereum_Mutation {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  public static callContractMethod(
    input: Input_callContractMethod
  ): Result<Types.Ethereum_TxResponse, string> {
    const args = serializecallContractMethodArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "mutation",
      "callContractMethod",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_TxResponse, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_TxResponse, string>(
      deserializecallContractMethodResult(result.unwrap())
    );
  }

  public static callContractMethodAndWait(
    input: Input_callContractMethodAndWait
  ): Result<Types.Ethereum_TxReceipt, string> {
    const args = serializecallContractMethodAndWaitArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "mutation",
      "callContractMethodAndWait",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_TxReceipt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_TxReceipt, string>(
      deserializecallContractMethodAndWaitResult(result.unwrap())
    );
  }

  public static sendTransaction(
    input: Input_sendTransaction
  ): Result<Types.Ethereum_TxResponse, string> {
    const args = serializesendTransactionArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "mutation",
      "sendTransaction",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_TxResponse, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_TxResponse, string>(
      deserializesendTransactionResult(result.unwrap())
    );
  }

  public static sendTransactionAndWait(
    input: Input_sendTransactionAndWait
  ): Result<Types.Ethereum_TxReceipt, string> {
    const args = serializesendTransactionAndWaitArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "mutation",
      "sendTransactionAndWait",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_TxReceipt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_TxReceipt, string>(
      deserializesendTransactionAndWaitResult(result.unwrap())
    );
  }

  public static deployContract(
    input: Input_deployContract
  ): Result<string, string> {
    const args = serializedeployContractArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "mutation",
      "deployContract",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializedeployContractResult(result.unwrap())
    );
  }

  public static signMessage(
    input: Input_signMessage
  ): Result<string, string> {
    const args = serializesignMessageArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "mutation",
      "signMessage",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializesignMessageResult(result.unwrap())
    );
  }

  public static sendRPC(
    input: Input_sendRPC
  ): Result<string | null, string> {
    const args = serializesendRPCArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "mutation",
      "sendRPC",
      args
    );

    if (result.isErr) {
      return Result.Err<string | null, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string | null, string>(
      deserializesendRPCResult(result.unwrap())
    );
  }
}
