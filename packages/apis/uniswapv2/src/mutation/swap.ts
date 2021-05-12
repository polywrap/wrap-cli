import { Ethereum_Mutation } from "./w3/imported";
import { getChainIdKey, Input_exec, Input_approve } from "./w3";
import { swapCallParameters, toHex } from "../query";
import { UNISWAP_ROUTER_CONTRACT } from "../utils/constants";

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
    method: getMethodAbi(swapParameters.methodName),
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

export function approve(input: Input_approve): string {
  return Ethereum_Mutation.sendTransaction({
    method:
      "function approve(address spender, uint value) external returns (bool)",
    args: [UNISWAP_ROUTER_CONTRACT, toHex(BigInt.fromString(MAX_UINT_256))],
    value: null,
    address: input.trade.inputAmount.token.address,
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(
        input.trade.inputAmount.token.chainId
      ),
    },
    gasPrice: null,
    gasLimit: null,
  });
}

function getMethodAbi(methodName: string): string {
  if (methodName == "swapExactTokensForTokens")
    return `function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)`;
  else if (methodName == "swapTokensForExactTokens")
    return `function swapTokensForExactTokens(uint amountOut,uint amountInMax,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)`;
  else if (methodName == "swapExactETHForTokens")
    return `function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)`;
  else if (methodName == "swapTokensForExactETH")
    return `function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)`;
  else if (methodName == "swapExactTokensForETH")
    return `function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)`;
  else if (methodName == "swapETHForExactTokens")
    return `function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)`;
  else if (
    methodName == "swapExactTokensForTokensSupportingFeeOnTransferTokens"
  )
    return `function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external`;
  else if (methodName == "swapExactETHForTokensSupportingFeeOnTransferTokens")
    return `function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline) external payable`;
  else if (methodName == "swapExactTokensForETHSupportingFeeOnTransferTokens")
    return `function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external`;
  else {
    throw new Error("Invalid method name " + methodName);
  }
}
