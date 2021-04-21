import { tokenEquals } from "./token";
import {
  Input_routeMidPrice,
  Input_routePath,
  Input_createRoute,
  Pair,
  Route,
  Token,
  TokenAmount,
} from "./w3";
import Price from "../utils/Price";
import { pairReserves } from "./pair";

import { BigInt } from "as-bigint";

export function createRoute(input: Input_createRoute): Route {
  const path = routePath({
    pairs: input.pairs,
    input: input.input,
  });

  let output: Token;
  if (input.output != null) {
    output = input.output as Token;
  } else {
    output = path[path.length - 1];
  }

  return {
    path: path,
    pairs: input.pairs,
    input: input.input,
    output: output,
  };
}

// returns the full path from input token to output token.
export function routePath(input: Input_routePath): Token[] {
  const pairs: Pair[] = input.pairs;
  const inToken: Token = input.input;
  const path: Token[] = [inToken];
  for (let i = 0; i < pairs.length; i++) {
    const currentIn = path[i];
    const token0 = pairs[i].tokenAmount0.token;
    const token1 = pairs[i].tokenAmount1.token;
    const isToken0In = tokenEquals({ token: currentIn, other: token0 });
    const isToken1In = tokenEquals({ token: currentIn, other: token1 });
    if (!isToken0In && isToken1In) {
      throw new Error(
        "Invalid or unordered route: Route must contain ordered pairs such that adjacent pairs contain one token in common."
      );
    }
    const currentOut = isToken0In ? token1 : token0;
    path.push(currentOut);
  }
  return path;
}

// Returns the current mid price along the route.
export function routeMidPrice(input: Input_routeMidPrice): TokenAmount {
  const route: Route = input.route;
  const finalPrice = midPrice(route);
  return {
    token: finalPrice.quoteToken,
    amount: finalPrice.adjusted().quotient().toString(), // TODO: should this be adjusted or raw price? also needs formatting
  };
}

// helper function for use in routeMidPrice and trade query functions
export function midPrice(route: Route): Price {
  const path = route.path;
  const prices: Price[] = [];
  for (let i = 0; i < route.pairs.length; i++) {
    const pair = route.pairs[i];
    const reserves: TokenAmount[] = pairReserves({ pair: pair });
    const reserve0: TokenAmount = reserves[0];
    const reserve1: TokenAmount = reserves[1];
    const amount0 = BigInt.fromString(reserve0.amount);
    const amount1 = BigInt.fromString(reserve1.amount);
    prices.push(
      tokenEquals({ token: path[i], other: reserve0.token })
        ? new Price(reserve0.token, reserve1.token, amount0, amount1)
        : new Price(reserve1.token, reserve0.token, amount1, amount0)
    );
  }
  return prices.slice(1).reduce((k, v) => k.mul(v), prices[0]);
}
