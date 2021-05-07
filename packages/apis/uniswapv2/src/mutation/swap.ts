import { Ethereum_Mutation } from "./w3/imported";
import { Input_exec } from "./w3";
import { swapCallParameters } from "../query";
import { UNISWAP_ROUTER_CONTRACT } from "../utils/constants";

const GAS_LIMIT = "200000";

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
    connection: null,
    gasPrice: null,
    gasLimit: GAS_LIMIT,
  });
  return txHash;
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
    return `function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external;`;
  else if (methodName == "swapExactETHForTokensSupportingFeeOnTransferTokens")
    return `function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline) external payable;`;
  else if (methodName == "swapExactTokensForETHSupportingFeeOnTransferTokens")
    return `function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external;`;
  else {
    throw new Error("Invalid method name " + methodName);
  }
}
