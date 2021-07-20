import {
  ChainId,
  Ethereum_Mutation,
  Input_execCall,
  getChainIdKey,
  Input_exec,
  Input_approve,
  Input_swap,
  Trade,
  TradeType,
  SwapParameters,
  TxOverrides,
  Pair,
  Ethereum_TxResponse,
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

import { BigInt } from "@web3api/wasm-as";

const MAX_UINT_256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export function exec(input: Input_exec): Ethereum_TxResponse {
  const swapParameters: SwapParameters = swapCallParameters({
    trade: input.trade,
    tradeOptions: input.tradeOptions,
  });
  return execCall({
    parameters: swapParameters,
    chainId: input.trade.inputAmount.token.chainId,
    txOverrides: input.txOverrides,
  });
}

export function execCall(input: Input_execCall): Ethereum_TxResponse {
  const swapParameters: SwapParameters = input.parameters;
  const chainId: ChainId = input.chainId;
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;

  const txResponse: Ethereum_TxResponse = Ethereum_Mutation.callContractMethod({
    address: UNISWAP_ROUTER_CONTRACT,
    method: getSwapMethodAbi(swapParameters.methodName),
    args: swapParameters.args,
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(chainId),
    },
    txOverrides: {
      value: BigInt.fromString(swapParameters.value.substring(2), 16),
      gasPrice: txOverrides.gasPrice,
      gasLimit: txOverrides.gasLimit,
    },
  });
  return txResponse;
}

export function swap(input: Input_swap): Ethereum_TxResponse {
  let trade: Trade;
  const pair: Pair = fetchPairData({
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
    txOverrides: input.txOverrides,
  });
}

export function approve(input: Input_approve): Ethereum_TxResponse {
  const amount: BigInt =
    input.amount === null ? BigInt.fromString(MAX_UINT_256) : input.amount!;
  const txOverrides: TxOverrides =
    input.txOverrides === null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;

  const txResponse: Ethereum_TxResponse = Ethereum_Mutation.callContractMethod({
    address: input.token.address,
    method:
      "function approve(address spender, uint value) external returns (bool)",
    args: [UNISWAP_ROUTER_CONTRACT, toHex(amount)],
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(input.token.chainId),
    },
    txOverrides: {
      value: null,
      gasPrice: txOverrides.gasPrice,
      gasLimit: txOverrides.gasLimit,
    },
  });
  return txResponse;
}
