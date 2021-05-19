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
import { wrapIfEther } from "../utils/utils";

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
  if (!(pairs.length > 0)) {
    throw new Error("Route has to define at least on pair");
  }
  const inToken: Token = input.input;

  const path: Token[] = [wrapIfEther(inToken)];
  for (let i = 0; i < pairs.length; i++) {
    const currentIn = path[i];
    const token0 = pairs[i].tokenAmount0.token;
    const token1 = pairs[i].tokenAmount1.token;
    const isToken0In = tokenEquals({ token: currentIn, other: token0 });
    const isToken1In = tokenEquals({ token: currentIn, other: token1 });
    if (!(isToken0In || isToken1In)) {
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
export function routeMidPrice(input: Input_routeMidPrice): string {
  const route: Route = input.route;
  const finalPrice = midPrice(route);
  return finalPrice.toFixed(18);
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
    prices.push(
      tokenEquals({ token: path[i], other: reserve0.token })
        ? new Price(
            reserve0.token,
            reserve1.token,
            reserve0.amount,
            reserve1.amount
          )
        : new Price(
            reserve1.token,
            reserve0.token,
            reserve1.amount,
            reserve0.amount
          )
    );
  }
  return prices.slice(1).reduce((k, v) => k.mul(v), prices[0]);
}
