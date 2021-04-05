import { tokenEquals } from "./token";
import { BigInt } from "../utils/BigInt";
import { Input_routeMidPrice, Input_routeOutput, Input_routePath, Pair, Route, Token, TokenAmount } from "./w3";
import Price from "../utils/Price";
import { pairReserves } from "./pair";

// returns the full path from input token to output token.
export function routePath(input: Input_routePath): Token[] {
  const pairs: Pair[] = input.route.pairs;
  const inToken: Token = input.route.input;
  const path: Token[] = [inToken];
  for (let i = 0; i < pairs.length; i++) {
    const currentIn = path[i];
    const token0 = pairs[i].tokenAmount0.token;
    const token1 = pairs[i].tokenAmount1.token;
    const isToken0In = tokenEquals({ token: currentIn, other: token0 });
    const isToken1In = tokenEquals({ token: currentIn, other: token1 });
    if (!isToken0In && isToken1In) {
      throw new Error("Invalid or unordered route: Route must contain ordered pairs such that adjacent pairs contain one token in common.");
    }
    const currentOut = isToken0In ? token1 : token0;
    path.push(currentOut);
  }
  return path;
}

// Returns the output token.
export function routeOutput(input: Input_routeOutput): Token {
  const path = routePath({ route: input.route });
  return path[path.length - 1];
}

// Returns the current mid price along the route.
export function routeMidPrice(input: Input_routeMidPrice): TokenAmount {
  const route: Route = input.route;
  const path = routePath({ route: input.route });
  const prices: Price[] = [];
  for (let i = 0; i < route.pairs.length; i++) {
    const pair = route.pairs[i];
    const reserves: TokenAmount[] = pairReserves({ pair: pair });
    const reserve0: TokenAmount = reserves[0];
    const reserve1: TokenAmount = reserves[1];
    const amount0 = BigInt.fromString(reserve0.amount);
    const amount1 = BigInt.fromString(reserve1.amount);
    prices.push(
      tokenEquals({ token: path[i], other: pair.tokenAmount0.token })
        ? new Price(reserve0.token, reserve1.token, amount0, amount1)
        : new Price(reserve1.token, reserve0.token, amount1, amount0)
    );
  }
  const finalPrice = prices.slice(1).reduce((k, v) => k.mul(v), prices[0]);
  return {
    token: finalPrice.quoteToken,
    amount: finalPrice.quotient().toString(),
  };
}
