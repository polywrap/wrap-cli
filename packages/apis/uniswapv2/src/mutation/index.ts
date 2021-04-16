import { Ethereum_Mutation } from "./w3/imported";
import { Input_exec } from "./w3";
import { swapCallParameters } from "../query";

export function exec(input: Input_exec): string {
  swapCallParameters({
    trade: input.trade,
    tradeOptions: input.tradeOptions,
  });
  return "Nope";
}
