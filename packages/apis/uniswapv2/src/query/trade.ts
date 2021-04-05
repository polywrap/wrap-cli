import { BestTradeOptions, Pair, Token, TokenAmount, Trade } from "./w3";

/*
type Route {
  pairs: [Pair!]!
  input: Token!
}

type Trade {
  route: Route!
  amount: TokenAmount!
  tradeType: TradeType!
}

enum TradeType {
  EXACT_INPUT
  EXACT_OUTPUT
}
*/

export function tradeExecutionPrice(input: Input_tradeExecutionPrice): TokenAmount {
  const trade = input.trade;
}

export function tradeNextMidPrice(input: Input_tradeNextMidPrice): TokenAmount {
  const trade: Trade = input.trade;
}

export function tradeSlippage(input: Input_tradeSlippage): TokenAmount {
  const trade: Trade = input.trade;
}

export function tradeMinimumAmountOut(input: Input_tradeMinimumAmountOut): TokenAmount {
  const trade: Trade = input.trade;
  const slippageTolerance: string = input.slippageTolerance;
}

export function tradeMinimumAmountIn(input: Input_tradeMinimumAmountIn): TokenAmount {
  const trade: Trade = input.trade;
  const slippageTolerance: string = input.slippageTolerance;
}

export function bestTradeExactIn(input: Input_bestTradeExactIn): Trade {
  const pairs: Pair[] = input.pairs;
  const amountIn: TokenAmount = input.amountIn;
  const tokenOut: Token = input.tokenOut;
  const options: BestTradeOptions = input.options;
}

export function bestTradeExactIn(input: Input_bestTradeExactIn): Trade {
  const pairs: Pair[] = input.pairs;
  const tokenIn: Token = input.tokenIn;
  const amountOut: TokenAmount = input.amountOut;
  const options: BestTradeOptions = input.options;
}
