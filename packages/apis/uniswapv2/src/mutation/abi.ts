export function getSwapMethodAbi(methodName: string): string {
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
