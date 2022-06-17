import {
  w3_subinvoke,
  w3_subinvokeImplementation,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  Result
} from "@web3api/wasm-as";
import {
  serializecallContractViewArgs,
  deserializecallContractViewResult,
  Input_callContractView,
  serializecallContractStaticArgs,
  deserializecallContractStaticResult,
  Input_callContractStatic,
  serializegetBalanceArgs,
  deserializegetBalanceResult,
  Input_getBalance,
  serializeencodeParamsArgs,
  deserializeencodeParamsResult,
  Input_encodeParams,
  serializeencodeFunctionArgs,
  deserializeencodeFunctionResult,
  Input_encodeFunction,
  serializesolidityPackArgs,
  deserializesolidityPackResult,
  Input_solidityPack,
  serializesolidityKeccak256Args,
  deserializesolidityKeccak256Result,
  Input_solidityKeccak256,
  serializesoliditySha256Args,
  deserializesoliditySha256Result,
  Input_soliditySha256,
  serializegetSignerAddressArgs,
  deserializegetSignerAddressResult,
  Input_getSignerAddress,
  serializegetSignerBalanceArgs,
  deserializegetSignerBalanceResult,
  Input_getSignerBalance,
  serializegetSignerTransactionCountArgs,
  deserializegetSignerTransactionCountResult,
  Input_getSignerTransactionCount,
  serializegetGasPriceArgs,
  deserializegetGasPriceResult,
  Input_getGasPrice,
  serializeestimateTransactionGasArgs,
  deserializeestimateTransactionGasResult,
  Input_estimateTransactionGas,
  serializeestimateContractCallGasArgs,
  deserializeestimateContractCallGasResult,
  Input_estimateContractCallGas,
  serializecheckAddressArgs,
  deserializecheckAddressResult,
  Input_checkAddress,
  serializetoWeiArgs,
  deserializetoWeiResult,
  Input_toWei,
  serializetoEthArgs,
  deserializetoEthResult,
  Input_toEth,
  serializeawaitTransactionArgs,
  deserializeawaitTransactionResult,
  Input_awaitTransaction,
  serializewaitForEventArgs,
  deserializewaitForEventResult,
  Input_waitForEvent,
  serializegetNetworkArgs,
  deserializegetNetworkResult,
  Input_getNetwork,
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

export class Ethereum_Module {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  public static callContractView(
    input: Input_callContractView
  ): Result<string, string> {
    const args = serializecallContractViewArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "callContractView",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializecallContractViewResult(result.unwrap())
    );
  }

  public static callContractStatic(
    input: Input_callContractStatic
  ): Result<Types.Ethereum_StaticTxResult, string> {
    const args = serializecallContractStaticArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "callContractStatic",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_StaticTxResult, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_StaticTxResult, string>(
      deserializecallContractStaticResult(result.unwrap())
    );
  }

  public static getBalance(
    input: Input_getBalance
  ): Result<BigInt, string> {
    const args = serializegetBalanceArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "getBalance",
      args
    );

    if (result.isErr) {
      return Result.Err<BigInt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<BigInt, string>(
      deserializegetBalanceResult(result.unwrap())
    );
  }

  public static encodeParams(
    input: Input_encodeParams
  ): Result<string, string> {
    const args = serializeencodeParamsArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "encodeParams",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializeencodeParamsResult(result.unwrap())
    );
  }

  public static encodeFunction(
    input: Input_encodeFunction
  ): Result<string, string> {
    const args = serializeencodeFunctionArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "encodeFunction",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializeencodeFunctionResult(result.unwrap())
    );
  }

  public static solidityPack(
    input: Input_solidityPack
  ): Result<string, string> {
    const args = serializesolidityPackArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "solidityPack",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializesolidityPackResult(result.unwrap())
    );
  }

  public static solidityKeccak256(
    input: Input_solidityKeccak256
  ): Result<string, string> {
    const args = serializesolidityKeccak256Args(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "solidityKeccak256",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializesolidityKeccak256Result(result.unwrap())
    );
  }

  public static soliditySha256(
    input: Input_soliditySha256
  ): Result<string, string> {
    const args = serializesoliditySha256Args(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "soliditySha256",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializesoliditySha256Result(result.unwrap())
    );
  }

  public static getSignerAddress(
    input: Input_getSignerAddress
  ): Result<string, string> {
    const args = serializegetSignerAddressArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "getSignerAddress",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializegetSignerAddressResult(result.unwrap())
    );
  }

  public static getSignerBalance(
    input: Input_getSignerBalance
  ): Result<BigInt, string> {
    const args = serializegetSignerBalanceArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "getSignerBalance",
      args
    );

    if (result.isErr) {
      return Result.Err<BigInt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<BigInt, string>(
      deserializegetSignerBalanceResult(result.unwrap())
    );
  }

  public static getSignerTransactionCount(
    input: Input_getSignerTransactionCount
  ): Result<BigInt, string> {
    const args = serializegetSignerTransactionCountArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "getSignerTransactionCount",
      args
    );

    if (result.isErr) {
      return Result.Err<BigInt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<BigInt, string>(
      deserializegetSignerTransactionCountResult(result.unwrap())
    );
  }

  public static getGasPrice(
    input: Input_getGasPrice
  ): Result<BigInt, string> {
    const args = serializegetGasPriceArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "getGasPrice",
      args
    );

    if (result.isErr) {
      return Result.Err<BigInt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<BigInt, string>(
      deserializegetGasPriceResult(result.unwrap())
    );
  }

  public static estimateTransactionGas(
    input: Input_estimateTransactionGas
  ): Result<BigInt, string> {
    const args = serializeestimateTransactionGasArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "estimateTransactionGas",
      args
    );

    if (result.isErr) {
      return Result.Err<BigInt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<BigInt, string>(
      deserializeestimateTransactionGasResult(result.unwrap())
    );
  }

  public static estimateContractCallGas(
    input: Input_estimateContractCallGas
  ): Result<BigInt, string> {
    const args = serializeestimateContractCallGasArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "estimateContractCallGas",
      args
    );

    if (result.isErr) {
      return Result.Err<BigInt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<BigInt, string>(
      deserializeestimateContractCallGasResult(result.unwrap())
    );
  }

  public static checkAddress(
    input: Input_checkAddress
  ): Result<bool, string> {
    const args = serializecheckAddressArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "checkAddress",
      args
    );

    if (result.isErr) {
      return Result.Err<bool, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<bool, string>(
      deserializecheckAddressResult(result.unwrap())
    );
  }

  public static toWei(
    input: Input_toWei
  ): Result<BigInt, string> {
    const args = serializetoWeiArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "toWei",
      args
    );

    if (result.isErr) {
      return Result.Err<BigInt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<BigInt, string>(
      deserializetoWeiResult(result.unwrap())
    );
  }

  public static toEth(
    input: Input_toEth
  ): Result<string, string> {
    const args = serializetoEthArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "toEth",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializetoEthResult(result.unwrap())
    );
  }

  public static awaitTransaction(
    input: Input_awaitTransaction
  ): Result<Types.Ethereum_TxReceipt, string> {
    const args = serializeawaitTransactionArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "awaitTransaction",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_TxReceipt, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_TxReceipt, string>(
      deserializeawaitTransactionResult(result.unwrap())
    );
  }

  public static waitForEvent(
    input: Input_waitForEvent
  ): Result<Types.Ethereum_EventNotification, string> {
    const args = serializewaitForEventArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "waitForEvent",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_EventNotification, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_EventNotification, string>(
      deserializewaitForEventResult(result.unwrap())
    );
  }

  public static getNetwork(
    input: Input_getNetwork
  ): Result<Types.Ethereum_Network, string> {
    const args = serializegetNetworkArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "getNetwork",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.Ethereum_Network, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.Ethereum_Network, string>(
      deserializegetNetworkResult(result.unwrap())
    );
  }

  public static callContractMethod(
    input: Input_callContractMethod
  ): Result<Types.Ethereum_TxResponse, string> {
    const args = serializecallContractMethodArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
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
