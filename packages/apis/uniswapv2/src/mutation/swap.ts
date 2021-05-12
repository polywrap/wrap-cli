import { Ethereum_Mutation } from "./w3/imported";
import {
  getChainIdKey,
  Input_exec,
  Input_approve,
  Input_swap,
  Trade,
  TradeType,
} from "./w3";
import {
  bestTradeExactIn,
  bestTradeExactOut,
  fetchPairData,
  swapCallParameters,
  toHex,
} from "../query";
import { UNISWAP_ROUTER_CONTRACT } from "../utils/constants";
import { getSwapMethodAbi } from "./abi";

import { BigInt } from "as-bigint";

const GAS_LIMIT = "200000";
const MAX_UINT_256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export function exec(input: Input_exec): string {
  const swapParameters = swapCallParameters({
    trade: input.trade,
    tradeOptions: input.tradeOptions,
  });

  const txHash = Ethereum_Mutation.sendTransaction({
    method: getSwapMethodAbi(swapParameters.methodName),
    args: swapParameters.args,
    value: swapParameters.value,
    address: UNISWAP_ROUTER_CONTRACT,
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(
        input.trade.inputAmount.token.chainId
      ),
    },
    gasPrice: null,
    gasLimit: GAS_LIMIT,
  });
  return txHash;
}

export function swap(input: Input_swap): string {
  let trade: Trade;
  const pair = fetchPairData({
    token0: input.tokenIn,
    token1: input.tokenOut,
  });

  if (input.tradeType == TradeType.EXACT_INPUT) {
    trade = bestTradeExactIn({
      pairs: [pair],
      amountIn: {
        token: input.tokenIn,
        amount: input.amount,
      },
      tokenOut: input.tokenOut,
      options: null,
    })[0];
  } else {
    trade = bestTradeExactOut({
      pairs: [pair],
      amountOut: {
        token: input.tokenOut,
        amount: input.amount,
      },
      tokenIn: input.tokenIn,
      options: null,
    })[0];
  }

  return exec({
    trade: trade,
    tradeOptions: input.tradeOptions,
  });
}

export function approve(input: Input_approve): string {
  return Ethereum_Mutation.sendTransaction({
    method:
      "function approve(address spender, uint value) external returns (bool)",
    args: [UNISWAP_ROUTER_CONTRACT, toHex(BigInt.fromString(MAX_UINT_256))],
    value: null,
    address: input.token.address,
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(input.token.chainId),
    },
    gasPrice: null,
    gasLimit: null,
  });
}
