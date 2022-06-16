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
  Input_getNetwork
} from "./serialization";
import * as Types from "../..";

export class Ethereum_Query {

  public static uri: string = "w3://ens/ethereum.web3api.eth";

  public static callContractView(
    input: Input_callContractView
  ): Result<string, string> {
    const args = serializecallContractViewArgs(input);
    const result = w3_subinvoke(
      "w3://ens/ethereum.web3api.eth",
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
      "query",
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
}
