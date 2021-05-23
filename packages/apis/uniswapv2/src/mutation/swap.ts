import {
  ChainId,
  Ethereum_Mutation,
  Ethereum_TxReceipt,
  Input_execCall,
} from "./w3";
import {
  getChainIdKey,
  Input_exec,
  Input_approve,
  Input_swap,
  Trade,
  TradeType,
  SwapParameters,
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
import { Ethereum_Query } from "../query/w3";

import { BigInt } from "@web3api/wasm-as";

const MAX_UINT_256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export function exec(input: Input_exec): Ethereum_TxReceipt {
  const swapParameters = swapCallParameters({
    trade: input.trade,
    tradeOptions: input.tradeOptions,
  });
  return execCall({
    parameters: swapParameters,
    chainId: input.trade.inputAmount.token.chainId,
  });
}

export function execCall(input: Input_execCall): Ethereum_TxReceipt {
  const swapParameters: SwapParameters = input.parameters;
  const chainId: ChainId = input.chainId;
  const gasEstimate: string = Ethereum_Query.estimateContractCallGas({
    address: UNISWAP_ROUTER_CONTRACT,
    method: getSwapMethodAbi(swapParameters.methodName),
    args: swapParameters.args,
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(chainId),
    },
  });
  // gasLimit is based on uniswap interface calculateGasMargin(value) method
  const gasLimit: string = BigInt.fromString(gasEstimate)
    .mulInt(11000)
    .divInt(10000)
    .toString();

  const txReceipt: Ethereum_TxReceipt = Ethereum_Mutation.callContractMethodAndWait(
    {
      address: UNISWAP_ROUTER_CONTRACT,
      method: getSwapMethodAbi(swapParameters.methodName),
      args: swapParameters.args,
      connection: {
        node: null,
        networkNameOrChainId: getChainIdKey(chainId),
      },
      txOverrides: {
        value: swapParameters.value,
        gasPrice: null,
        gasLimit: gasLimit,
        nonce: null,
      },
    }
  );
  return txReceipt;
}

export function swap(input: Input_swap): Ethereum_TxReceipt {
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

export function approve(input: Input_approve): Ethereum_TxReceipt {
  const txReceipt: Ethereum_TxReceipt = Ethereum_Mutation.callContractMethodAndWait(
    {
      address: input.token.address,
      method:
        "function approve(address spender, uint value) external returns (bool)",
      args: [UNISWAP_ROUTER_CONTRACT, toHex(BigInt.fromString(MAX_UINT_256))],
      connection: {
        node: null,
        networkNameOrChainId: getChainIdKey(input.token.chainId),
      },
      txOverrides: {
        value: null,
        gasPrice: null,
        gasLimit: null,
        nonce: null,
      },
    }
  );
  return txReceipt;
}
