import { Ethereum_Mutation } from "./w3/imported";
import { Input_swap } from "./w3";
import { swapCallParameters } from "../query";
import { UNISWAP_ROUTER_CONTRACT } from "../utils/constants";

export function swap(input: Input_swap): string {
  const swapParameters = swapCallParameters({
    trade: input.trade,
    tradeOptions: input.tradeOptions,
  });

  const txHash = Ethereum_Mutation.sendTransaction({
    method: swapParameters.methodName,
    args: swapParameters.args,
    value: swapParameters.value,
    address: UNISWAP_ROUTER_CONTRACT,
    connection: null,
    gasLimit: null,
  });
  return txHash;
}
