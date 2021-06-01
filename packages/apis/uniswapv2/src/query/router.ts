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
        methodName =
          !useFeeOnTransfer.isNull && useFeeOnTransfer.value
            ? "swapExactETHForTokensSupportingFeeOnTransferTokens"
            : "swapExactETHForTokens";
        // (uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountOut, path, to, deadline];
        value = amountIn;
      } else if (etherOut) {
        methodName =
          !useFeeOnTransfer.isNull && useFeeOnTransfer.value
            ? "swapExactTokensForETHSupportingFeeOnTransferTokens"
            : "swapExactTokensForETH";
        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountIn, amountOut, path, to, deadline];
        value = ZERO_HEX;
      } else {
        methodName =
          !useFeeOnTransfer.isNull && useFeeOnTransfer.value
            ? "swapExactTokensForTokensSupportingFeeOnTransferTokens"
            : "swapExactTokensForTokens";
        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountIn, amountOut, path, to, deadline];
        value = ZERO_HEX;
      }
      break;
    case TradeType.EXACT_OUTPUT:
      if (!useFeeOnTransfer.isNull && useFeeOnTransfer.value) {
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
      throw new Error("method name not found");
  }

  return {
    methodName: methodName,
    args: args,
    value: value,
  };
}

export function estimateGas(input: Input_estimateGas): string {
  const swapParameters: SwapParameters = input.parameters;
  const chainId: Nullable<ChainId> = input.chainId;
  return Ethereum_Query.estimateContractCallGas({
    address: UNISWAP_ROUTER_CONTRACT,
    method: getSwapMethodAbi(swapParameters.methodName),
    args: swapParameters.args,
    connection: chainId.isNull
      ? null
      : {
          node: null,
          networkNameOrChainId: getChainIdKey(chainId.value),
        },
    txOverrides: {
      value: swapParameters.value,
      gasPrice: null,
      gasLimit: null,
    },
  });
}

// returns empty string if call would be successful, otherwise returns solidity contract error
export function execCallStatic(input: Input_execCallStatic): string {
  const swapParameters: SwapParameters = input.parameters;
  const chainId: ChainId = input.chainId;
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const gasPrice: string | null =
    txOverrides.gasPrice === null ? null : txOverrides.gasPrice!.toString();
  const gasLimit: string | null =
    txOverrides.gasLimit === null ? null : txOverrides.gasLimit!.toString();

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
    },
  });
}
