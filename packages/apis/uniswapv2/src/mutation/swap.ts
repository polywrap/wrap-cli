import {
  ChainId,
  Ethereum_Mutation,
  Ethereum_TxReceipt,
  Input_execCall,
  getChainIdKey,
  Input_exec,
  Input_approve,
  Input_swap,
  Trade,
  TradeType,
  SwapParameters,
  TxOverrides,
} from "./w3";
import {
  bestTradeExactIn,
  bestTradeExactOut,
  estimateGas,
  fetchPairData,
  swapCallParameters,
  toHex,
} from "../query";
import { UNISWAP_ROUTER_CONTRACT } from "../utils/constants";
import { getSwapMethodAbi } from "./abi";

import { BigInt, Nullable } from "@web3api/wasm-as";

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
    txOverrides: input.txOverrides,
  });
}

export function execCall(input: Input_execCall): Ethereum_TxReceipt {
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
        gasPrice: gasPrice,
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
    txOverrides: input.txOverrides,
  });
}

export function approve(input: Input_approve): Ethereum_TxReceipt {
  const txOverrides: TxOverrides =
    input.txOverrides == null
      ? { gasLimit: null, gasPrice: null }
      : input.txOverrides!;
  const gasPrice: string | null =
    txOverrides.gasPrice === null ? null : txOverrides.gasPrice!.toString();
  const gasLimit: string | null =
    txOverrides.gasLimit === null ? null : txOverrides.gasLimit!.toString();
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
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        nonce: null,
      },
    }
  );
  return txReceipt;
}
