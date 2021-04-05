import { tokenEquals } from "./token";
import { BigInt } from "../utils/BigInt";
import { Input_routeMidPrice, Input_routeOutput, Input_routePath, Pair, Route, Token, TokenAmount } from "./w3";

// returns the full path from input token to output token.
export function routePath(input: Input_routePath): Token[] {
  const pairs: Pair[] = input.route.pairs;
  const inToken: Token = input.route.input;
  const path: Token[] = [inToken];
  for (let i = 0; i < pairs.length; i++) {
    const currentIn = path[i];
    const token0 = pairs[i].tokenAmount0.token;
    const token1 = pairs[i].tokenAmount1.token;
    const isToken0In = tokenEquals({token: currentIn, other: token0});
    const isToken1In = tokenEquals({token: currentIn, other: token1});
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
// TODO: this function is not yet implemented
export function routeMidPrice(input: Input_routeMidPrice): TokenAmount {
  const route: Route = input.route;

  return {
    amount: "0",
    token: route.input
  }
}

// public get midPrice(): Price {
//   const prices: Price[] = []
//   for (const [i, pair] of this.pairs.entries()) {
//     prices.push(
//       this.path[i].equals(pair.token0)
//         ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw)
//         : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw)
//     )
//   }
//   return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
// }


// class Price {
//
//   baseToken: Token;
//   quoteToken: Token;
//   scalar: number;
//   raw: number;
//   adjusted: number;
//
//   constructor(base: Token, quote: Token) {
//     this.baseToken = base;
//     this.quoteToken = quote;
//   }
//
//   invert(): Price {
//
//   }
//
//   multiply(other: Price): Price {
//
//   }
//
//   quote(tokenAmont: TokenAmount): TokenAmount {
//
//   }
//
//
// }



// given some amount of an asset and pair reserves, returns an equivalent amount of the other asset
function quote(amountA: string, reserveA: string, reserveB: string): string {
  const amtA = BigInt.fromString(amountA);
  const resA = BigInt.fromString(reserveA);
  const resB = BigInt.fromString(reserveB);
  if (amtA.eq(BigInt.ZERO)) {
    throw new RangeError("Insufficient input amount: Input amount must be greater than zero");
  }
  if (resA.eq(BigInt.ZERO) || resB.eq(BigInt.ZERO)) {
    throw new RangeError("Insufficient liquidity: Pair reserves must be greater than zero");
  }
  return amtA.mul(resB).div(resA).toString();
}