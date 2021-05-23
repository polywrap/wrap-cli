import { ETHER } from "../utils/Currency";
import { tradeMaximumAmountIn, tradeMinimumAmountOut } from "./trade";
import {
  ChainId,
  Ethereum_Query,
  getChainIdKey,
  Input_estimateGas,
  Input_swapCallParameters,
  Input_execCallStatic,
  SwapParameters,
  TradeType,
  TxOverrides,
} from "./w3";
import { currencyEquals } from "./token";
import { UNISWAP_ROUTER_CONTRACT } from "../utils/constants";
import { getSwapMethodAbi } from "../mutation/abi";

import { BigInt, Nullable } from "@web3api/wasm-as";

const ZERO_HEX = "0x0";

export function toHex(currencyAmount: BigInt): string {
  return "0x" + currencyAmount.toString(16);
}

export function swapCallParameters(
  input: Input_swapCallParameters
): SwapParameters {
  const etherIn = currencyEquals({
    currency: input.trade.inputAmount.token.currency,
    other: ETHER,
  });
  const etherOut = currencyEquals({
    currency: input.trade.outputAmount.token.currency,
    other: ETHER,
  });

  if (etherIn && etherOut) {
    throw new Error("Ether can't be trade input and output");
  }

  if (input.tradeOptions.ttl.isNull && input.tradeOptions.deadline.isNull) {
    throw new Error("Either ttl or deadline have to be defined for trade");
  }

  const to = input.tradeOptions.recipient;
  const amountIn = toHex(
    tradeMaximumAmountIn({
      trade: input.trade,
      slippageTolerance: input.tradeOptions.allowedSlippage,
    }).amount
  );
  const amountOut = toHex(
    tradeMinimumAmountOut({
      trade: input.trade,
      slippageTolerance: input.tradeOptions.allowedSlippage,
    }).amount
  );

  const pathArray = input.trade.route.path.map<string>(
    (token) => token.address
  );
  const path = '["' + pathArray.join('","') + '"]';
  const deadline = !input.tradeOptions.ttl.isNull
    ? "0x" +
      (
        input.tradeOptions.unixTimestamp + input.tradeOptions.ttl.value
      ).toString(16)
    : "0x" + (input.tradeOptions.deadline.value as u32).toString(16);
  const useFeeOnTransfer = input.tradeOptions.feeOnTransfer;

  let methodName: string;
  let args: string[];
  let value: string;

  switch (input.trade.tradeType) {
    case TradeType.EXACT_INPUT:
      if (etherIn) {
        methodName = !useFeeOnTransfer.isNull
          ? "swapExactETHForTokensSupportingFeeOnTransferTokens"
          : "swapExactETHForTokens";
        // (uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountOut, path, to, deadline];
        value = amountIn;
      } else if (etherOut) {
        methodName = !useFeeOnTransfer.isNull
          ? "swapExactTokensForETHSupportingFeeOnTransferTokens"
          : "swapExactTokensForETH";
        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountIn, amountOut, path, to, deadline];
        value = ZERO_HEX;
      } else {
        methodName = !useFeeOnTransfer.isNull
          ? "swapExactTokensForTokensSupportingFeeOnTransferTokens"
          : "swapExactTokensForTokens";
        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountIn, amountOut, path, to, deadline];
        value = ZERO_HEX;
      }
      break;
    case TradeType.EXACT_OUTPUT:
      if (!useFeeOnTransfer.isNull) {
        throw new Error("Cannot use fee on transfer with exact out trade");
      }

      if (etherIn) {
        methodName = "swapETHForExactTokens";
        // (uint amountOut, address[] calldata path, address to, uint deadline)
        args = [amountOut, path, to, deadline];
        value = amountIn;
      } else if (etherOut) {
        methodName = "swapTokensForExactETH";
        // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        args = [amountOut, amountIn, path, to, deadline];
        value = ZERO_HEX;
      } else {
        methodName = "swapTokensForExactTokens";
        // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        args = [amountOut, amountIn, path, to, deadline];
        value = ZERO_HEX;
      }
      break;
    default:
      methodName = "";
      // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
      args = [];
      value = ZERO_HEX;
  }

  return {
    methodName: methodName,
    value: value,
    args: args,
  };
}

export function estimateGas(input: Input_estimateGas): string {
  const swapParameters: SwapParameters = input.parameters;
  const chainId: Nullable<ChainId> = input.chainId;
  const txOverrides: TxOverrides =
    input.txOverrides == null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const gasLimit: string | null =
    txOverrides.gasLimit === null ? null : txOverrides.gasLimit!.toString();
  const gasPrice: string | null =
    txOverrides.gasPrice === null ? null : txOverrides.gasPrice!.toString();
  return Ethereum_Query.estimateContractCallGas({
    address: UNISWAP_ROUTER_CONTRACT,
    method: getSwapMethodAbi(swapParameters.methodName),
    args: swapParameters.args,
    connection: chainId.isNull
      ? {
          node: null,
          networkNameOrChainId: getChainIdKey(chainId.value),
        }
      : null,
    txOverrides: {
      value: swapParameters.value,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      nonce: null,
    },
  });
}

// returns empty string if call would be successful, otherwise returns solidity contract error
export function execCallStatic(input: Input_execCallStatic): string {
  const swapParameters: SwapParameters = input.parameters;
  const chainId: ChainId = input.chainId;
  const txOverrides: TxOverrides =
    input.txOverrides == null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  // gasLimit is based on uniswap interface calculateGasMargin(value) method
  let gasLimit: string;
  if (txOverrides.gasLimit !== null) {
    gasLimit = txOverrides.gasLimit!.toString();
  } else {
    const gasEstimate: string = estimateGas({
      parameters: swapParameters,
      chainId: Nullable.fromValue(chainId),
    });
    gasLimit = BigInt.fromString(gasEstimate)
      .mulInt(11000)
      .divInt(10000)
      .toString();
  }
  const gasPrice: string | null =
    txOverrides.gasPrice === null ? null : txOverrides.gasPrice!.toString();

  return Ethereum_Query.callContractMethodStatic({
    address: UNISWAP_ROUTER_CONTRACT,
    method: getSwapMethodAbi(swapParameters.methodName),
    args: swapParameters.args,
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(chainId),
    },
    txOverrides: {
      value: swapParameters.value,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      nonce: null,
    },
  });
}
