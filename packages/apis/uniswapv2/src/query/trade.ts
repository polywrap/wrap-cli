import { BestTradeOptions, ChainId, Pair, Token, TokenAmount, Trade, TradeType } from "./w3";
import { midPrice, routeMidPrice, routeOutput, routePath } from "./route";
import Price from "../utils/Price";
import { pairInputAmount, pairInputNextPair, pairOutputAmount, pairOutputNextPair } from "./pair";
import { BigInt } from "as-bigint";
import Fraction from "../utils/Fraction";
import { tokenAmountEquals, tokenEquals } from "./token";
import { PriorityQueue } from "../utils/PriorityQueue";

interface TradeData {
  trade: Trade;
  processedTrade: ProcessedTrade;
}

interface ProcessedTrade {
  nextPairs: Pair[];
  amounts: TokenAmount[];
  inputAmount: TokenAmount;
  outputAmount: TokenAmount;
  tradeType: TradeType;
}

// TODO: handle unwrapped Ether
// The average price that the trade would execute at.
export function tradeExecutionPrice(input: Input_tradeExecutionPrice): TokenAmount {
  const trade: Trade = input.trade;
  const processedTrade: ProcessedTrade = processTrade(trade);
  const executionPrice = new Price(
    processedTrade.inputAmount.token,
    processedTrade.outputAmount.token,
    BigInt.fromString(processedTrade.inputAmount.amount),
    BigInt.fromString(processedTrade.outputAmount.amount)
  );
  return {
    token: executionPrice.quoteToken,
    amount: executionPrice.adjusted().quotient().toString(), // TODO: should this be adjusted or raw price? also needs formatting
  };
}

// What the new mid price would be if the trade were to execute.
export function tradeNextMidPrice(input: Input_tradeNextMidPrice): TokenAmount {
  const trade: Trade = input.trade;
  const processedTrade: ProcessedTrade = processTrade(trade);
  const nextPairs: Pair[] = processedTrade.nextPairs;
  return routeMidPrice({ route: { pairs: nextPairs, input: trade.route.input }});
}

// TODO: needs formatted output
// The slippage incurred by the trade. (strictly > 0.30%)
// result is a percent like 100.0%, not a decimal like 1.00, but there is no decimal point in the string
export function tradeSlippage(input: Input_tradeSlippage): TokenAmount {
  const trade: Trade = input.trade;
  const processedTrade: ProcessedTrade = processTrade(trade);
  const midPrice: Price = midPrice(trade.route);
  // compute price impact
  const inputFraction: Fraction = new Fraction(BigInt.fromString(processedTrade.inputAmount.amount));
  const outputFraction: Fraction = new Fraction(BigInt.fromString(processedTrade.outputAmount.amount));
  const exactQuote: Fraction = midPrice.raw().mul(inputFraction);
  const slippage = exactQuote.sub(outputFraction).div(exactQuote);
  return {
    token: processedTrade.outputAmount.token,
    amount: slippage.mul(new Fraction(BigInt.fromString("100"))).quotient().toString(),
  };
}

export function tradeMinimumAmountOut(input: Input_tradeMinimumAmountOut): TokenAmount {
  const trade: Trade = input.trade;
  const slippageTolerance = Fraction.fromString(input.slippageTolerance);

  if (slippageTolerance.lt(new Fraction(BigInt.ZERO))) {
    throw new RangeError("slippage tolerance cannot be less than zero");
  }
  if (trade.tradeType == TradeType.EXACT_OUTPUT) {
    return processTrade(trade).outputAmount;
  } else {
    const processedTrade = processTrade(trade);
    const biOutAmt = BigInt.fromString(processedTrade.outputAmount.amount);
    const slippageAdjustedAmountOut = new Fraction(BigInt.ONE)
      .add(slippageTolerance)
      .invert()
      .mul(new Fraction(biOutAmt))
      .quotient();
    return {
      token: processedTrade.outputAmount.token,
      amount: slippageAdjustedAmountOut.toString(),
    };
  }
}

export function tradeMaximumAmountIn(input: Input_tradeMaximumAmountIn): TokenAmount {
  const trade: Trade = input.trade;
  const slippageTolerance = Fraction.fromString(input.slippageTolerance);

  if (slippageTolerance.lt(new Fraction(BigInt.ZERO))) {
    throw new RangeError("slippage tolerance cannot be less than zero");
  }
  if (trade.tradeType == TradeType.EXACT_INPUT) {
    return processTrade(trade).inputAmount;
  } else {
    const processedTrade = processTrade(trade);
    const biInputAmt = BigInt.fromString(processedTrade.inputAmount.amount);
    const slippageAdjustedAmountIn = new Fraction(BigInt.ONE)
      .add(slippageTolerance)
      .mul(new Fraction(biInputAmt))
      .quotient();
    return {
      token: processedTrade.inputAmount.token,
      amount: slippageAdjustedAmountIn.toString(),
    };
  }
}

/* Given a list of pairs, a fixed amount in, and token amount out, this method
 returns the best maxNumResults trades that swap an input token amount to an
 output token, making at most maxHops hops. The returned trades are sorted by
 output amount, in decreasing order, and all share the given input amount. */
export function bestTradeExactIn(input: Input_bestTradeExactIn): Trade[] {
  const pairs: Pair[] = input.pairs;
  const amountIn: TokenAmount = input.amountIn;
  const tokenOut: Token = input.tokenOut;
  const options: BestTradeOptions =
    input.options != null
      ? input.options! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      : {
          maxNumResults: 3,
          maxHops: 3,
        };
  if (pairs.length == 0) {
    throw new Error("Pairs array is empty");
  }
  if (options.maxHops == 0) {
    throw new Error("maxHops must be greater than zero");
  }
  const bestTrades = _bestTradeExactIn(pairs, amountIn, tokenOut, options);
  return bestTrades.toArray().map<Trade>((v: TradeData) => v.trade);
}

export function bestTradeExactOut(input: Input_bestTradeExactOut): Trade[] {
  const pairs: Pair[] = input.pairs;
  const tokenIn: Token = input.tokenIn;
  const amountOut: TokenAmount = input.amountOut;
  const options: BestTradeOptions =
    input.options != null
      ? input.options! // eslint-disable-line @typescript-eslint/no-non-null-assertion
      : {
        maxNumResults: 3,
        maxHops: 3,
      };
  if (pairs.length == 0) {
    throw new Error("Pairs array is empty");
  }
  if (options.maxHops == 0) {
    throw new Error("maxHops must be greater than zero");
  }
  const bestTrades = _bestTradeExactOut(pairs, tokenIn, amountOut, options);
  return bestTrades.toArray().map<Trade>((v: TradeData) => v.trade);
}

// helper function for use in tradeExecutinPrice, tradeMidPrice, and tradeSlippage functions
function processTrade(trade: Trade): ProcessedTrade {
  const path: Token[] = routePath({ route: trade.route });
  const amounts: TokenAmount[] = new Array(path.length);
  const nextPairs: Pair[] = new Array(trade.route.pairs.length);
  if (trade.tradeType == TradeType.EXACT_INPUT) {
    if (trade.amount.token != trade.route.input) {
      throw new Error("Trade input token must be the same as trade route input token");
    }
    amounts[0] = trade.amount;
    for (let i = 0; i < path.length - 1; i++) {
      const pair = trade.route.pairs[i];
      const outputAmount: TokenAmount = pairOutputAmount({pair: pair, inputAmount: amounts[i]});
      const nextPair: Pair = pairOutputNextPair({pair: pair, inputAmount: amounts[i]});
      amounts[i + 1] = outputAmount;
      nextPairs[i] = nextPair;
    }
  } else {
    const routeOutput: Token = routeOutput({ route: trade.route });
    if (trade.amount.token != routeOutput) {
      throw new Error("Trade input token must be the same as trade route input token");
    }
    amounts[amounts.length - 1] = trade.amount;
    for (let i = path.length - 1; i > 0; i--) {
      const pair = trade.route.pairs[i - 1]
      const inputAmount: TokenAmount = pairInputAmount({pair: pair, outputAmount: amounts[i]});
      const nextPair: Pair = pairInputNextPair({pair: pair, outputAmount: amounts[i]});
      amounts[i - 1] = inputAmount;
      nextPairs[i - 1] = nextPair;
    }
  }
  const inputAmount: TokenAmount = trade.tradeType == TradeType.EXACT_INPUT ? trade.amount : amounts[0];
  const outputAmount: TokenAmount = trade.tradeType == TradeType.EXACT_OUTPUT ? trade.amount : amounts[amounts.length - 1];
  return {
    nextPairs: nextPairs,
    amounts: amounts,
    inputAmount: inputAmount,
    outputAmount: outputAmount,
    tradeType: trade.tradeType,
  };
}

// trades with higher output and lower input have highest priority
function tradeComparator(a: TradeData, b: TradeData): i32 {
  const aInput = a.processedTrade.inputAmount;
  const bInput = b.processedTrade.inputAmount;
  if (tokenEquals({ token: aInput.token, other: bInput.token })) {
    throw new Error("To be compared, trades must the same input token");
  }
  const aOutput = a.processedTrade.outputAmount;
  const bOutput = b.processedTrade.outputAmount;
  if (tokenEquals({ token: aOutput.token, other: bOutput.token })) {
    throw new Error("To be compared, trades must the same output token");
  }
  const aOutputBI = BigInt.fromString(aOutput.amount);
  const bOutputBI = BigInt.fromString(bOutput.amount);
  const outCmp = aOutputBI.compareTo(bOutputBI);
  if (outCmp == 0) {
    const aInputBI = BigInt.fromString(aInput.amount);
    const bInputBI = BigInt.fromString(bInput.amount);
    const inCmp = aInputBI.compareTo(bInputBI);
    if (inCmp == 0) {
      return 0;
    } else if (inCmp < 0) {
      return 1;
    } else {
      return -1;
    }
  } else {
    if (outCmp > 0) {
      return 1;
    } else {
      return -1;
    }
  }
}

function _bestTradeExactIn(pairs: Pair[],
                           amountIn: TokenAmount,
                           tokenOut: Token,
                           options: BestTradeOptions,
                           currentPairs: Pair[] = [],
                           originalAmountIn: TokenAmount = amountIn,
                           bestTrades: PriorityQueue<TradeData> = new PriorityQueue<TradeData>(tradeComparator)): PriorityQueue<TradeData> {
  const sameTokenAmount = tokenAmountEquals({ tokenAmount0: originalAmountIn, tokenAmount1: amountIn });
  if (!sameTokenAmount && currentPairs.length == 0) {
    throw new Error("Recursion error: invariants are false");
  }
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    const isToken0 = tokenEquals({ token: amountIn.token, other: pair.tokenAmount0.token });
    const isToken1 = tokenEquals({ token: amountIn.token, other: pair.tokenAmount1.token });
    if (!isToken0 && !isToken1) continue;

    const biTokenAmt0 = BigInt.fromString(pair.tokenAmount0.amount);
    const biTokenAmt1 = BigInt.fromString(pair.tokenAmount1.amount);
    if (biTokenAmt0.eq(BigInt.ZERO) || biTokenAmt1.eq(BigInt.ZERO)) continue;
    const biAmtIn = BigInt.fromString(amountIn.amount);
    if (biAmtIn.eq(BigInt.ZERO)) continue;

    const amountOutToken = isToken0 ? pair.tokenAmount1 : pair.tokenAmount0;
    if (tokenEquals({ token: amountOutToken, other: tokenOut })) {
      const newTrade: Trade = {
        route: {
          pairs: currentPairs.concat([pair]),
          input: originalAmountIn.token,
        },
        amount: originalAmountIn,
        tradeType: TradeType.EXACT_INPUT,
      };
      bestTrades.insert({
        trade: newTrade,
        processedTrade: processTrade(newTrade),
      });
    } else if (options.maxHops > 1 && pairs.length > 1) {
      const amountOut: TokenAmount = pairOutputAmount({ pair: pair, inputAmount: amountIn });
      const otherPairs = pairs.slice(0, i).concat(pairs.slice(i + 1));
      _bestTradeExactIn(
        otherPairs,
        amountOut,
        tokenOut,
        {
          maxNumResults: options.maxNumResults,
          maxHops: options.maxHops - 1,
        },
        currentPairs.concat([pair]),
        originalAmountIn,
        bestTrades
      );
    }
  }
  return bestTrades;
}

function _bestTradeExactOut(pairs: Pair[],
                           tokenIn: Token,
                           amountOut: TokenAmount,
                           options: BestTradeOptions,
                           currentPairs: Pair[] = [],
                           originalAmountOut: TokenAmount = amountOut,
                           bestTrades: PriorityQueue<TradeData> = new PriorityQueue<TradeData>(tradeComparator)): PriorityQueue<TradeData> {
  const sameTokenAmount = tokenAmountEquals({ tokenAmount0: originalAmountOut, tokenAmount1: amountOut });
  if (!sameTokenAmount && currentPairs.length == 0) {
    throw new Error("Recursion error: invariants are false");
  }
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    const isToken0 = tokenEquals({ token: amountOut.token, other: pair.tokenAmount0.token });
    const isToken1 = tokenEquals({ token: amountOut.token, other: pair.tokenAmount1.token });
    if (!isToken0 && !isToken1) continue;

    const biTokenAmt0 = BigInt.fromString(pair.tokenAmount0.amount);
    const biTokenAmt1 = BigInt.fromString(pair.tokenAmount1.amount);
    if (biTokenAmt0.eq(BigInt.ZERO) || biTokenAmt1.eq(BigInt.ZERO)) continue;
    const biAmtOut = BigInt.fromString(amountOut.amount);
    if (biAmtOut.eq(BigInt.ZERO)) continue;

    const amountInToken = isToken0 ? pair.tokenAmount1 : pair.tokenAmount0;
    if (tokenEquals({ token: amountInToken, other: tokenIn })) {
      const newTrade: Trade = {
        route: {
          pairs: [pair].concat(currentPairs),
          input: originalAmountOut.token,
        },
        amount: originalAmountOut,
        tradeType: TradeType.EXACT_OUTPUT,
      };
      bestTrades.insert({
        trade: newTrade,
        processedTrade: processTrade(newTrade),
      });
    } else if (options.maxHops > 1 && pairs.length > 1) {
      const amountIn: TokenAmount = pairInputAmount({ pair: pair, outputAmount: amountOut });
      const otherPairs = pairs.slice(0, i).concat(pairs.slice(i + 1));
      _bestTradeExactOut(
        otherPairs,
        tokenIn,
        amountIn,
        {
          maxNumResults: options.maxNumResults,
          maxHops: options.maxHops - 1,
        },
        [pair].concat(currentPairs),
        originalAmountOut,
        bestTrades
      );
    }
  }
  return bestTrades;
}
