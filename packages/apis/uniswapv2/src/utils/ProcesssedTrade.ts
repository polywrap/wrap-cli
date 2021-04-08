import { Pair, Token, TokenAmount, Trade, TradeType } from "../query/w3";
import {
  pairInputAmount,
  pairInputNextPair,
  pairOutputAmount,
  pairOutputNextPair,
  routeOutput,
  routePath,
} from "../query";

export class ProcessedTrade {
  nextPairs: Pair[];
  amounts: TokenAmount[];
  inputAmount: TokenAmount;
  outputAmount: TokenAmount;
  tradeType: TradeType;

  constructor(trade: Trade) {
    const path: Token[] = routePath({ route: trade.route });
    const amounts: TokenAmount[] = new Array(path.length);
    const nextPairs: Pair[] = new Array(trade.route.pairs.length);
    if (trade.tradeType == TradeType.EXACT_INPUT) {
      if (trade.amount.token != trade.route.input) {
        throw new Error(
          "Trade input token must be the same as trade route input token"
        );
      }
      amounts[0] = trade.amount;
      for (let i = 0; i < path.length - 1; i++) {
        const pair = trade.route.pairs[i];
        const outputAmount: TokenAmount = pairOutputAmount({
          pair: pair,
          inputAmount: amounts[i],
        });
        const nextPair: Pair = pairOutputNextPair({
          pair: pair,
          inputAmount: amounts[i],
        });
        amounts[i + 1] = outputAmount;
        nextPairs[i] = nextPair;
      }
    } else {
      const routeOut: Token = routeOutput({ route: trade.route });
      if (trade.amount.token != routeOut) {
        throw new Error(
          "Trade input token must be the same as trade route input token"
        );
      }
      amounts[amounts.length - 1] = trade.amount;
      for (let i = path.length - 1; i > 0; i--) {
        const pair = trade.route.pairs[i - 1];
        const inputAmount: TokenAmount = pairInputAmount({
          pair: pair,
          outputAmount: amounts[i],
        });
        const nextPair: Pair = pairInputNextPair({
          pair: pair,
          outputAmount: amounts[i],
        });
        amounts[i - 1] = inputAmount;
        nextPairs[i - 1] = nextPair;
      }
    }
    const inputAmount: TokenAmount =
      trade.tradeType == TradeType.EXACT_INPUT ? trade.amount : amounts[0];
    const outputAmount: TokenAmount =
      trade.tradeType == TradeType.EXACT_OUTPUT
        ? trade.amount
        : amounts[amounts.length - 1];
    this.nextPairs = nextPairs;
    this.amounts = amounts;
    this.inputAmount = inputAmount;
    this.outputAmount = outputAmount;
    this.tradeType = trade.tradeType;
  }
}
