import { tokenEquals } from "./token";

// returns the full path from input token to output token.
export function routePath(input: Input_routePath): Token[] {
  const {pairs, input: inToken} = input.route;
  const path: Token[] = [inToken];
  for (let i = 0; i < pairs.length; i++) {
    const currentIn = path[i];
    const token0 = pairs[i].tokenAmount0.token
    const token1 = pairs[i].tokenAmount1.token
    const isToken0In = tokenEquals({token: currentIn, other: token0});
    const isToken1In = tokenEquals({token: currentIn, other: token1});
    if (!isToken0In && isToken1In) {
      throw Error("Invalid or unordered route: Route must contain ordered pairs such that adjacent pairs contain one token in common.");
    }
    const currentOut = isToken0In ? token1 : token0;
    path.push(currentOut);
  }
}

// Returns the output token.
export function routeOutput(input: Input_routeOutput): Token {
  const path = routePath({...input});
  return path[path.length - 1];
}

// Returns the current mid price along the route.
// TODO: this function is not yet implemented
export function routeMidPrice(input: Input_routeMidPrice): TokenAmount {
  const route: Route = input.route;
  return {
    amount: 0,
    token: route.input
  }
}


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
function quote(amountA: u256, reserveA: u256, reserveB: u256): u256 {
  if (amountA == 0) {
    throw new RangeError("Insufficient input amount: Input amount must be greater than zero");
  }
  if (reserveA == 0 || reserveB == 0) {
    throw new RangeError("Insufficient liquidity: Pair reserves must be greater than zero")
  }
  return amountA * reserveB / reserveA;
}