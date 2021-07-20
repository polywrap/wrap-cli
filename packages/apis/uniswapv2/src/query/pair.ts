import { fetchTokenData } from "./fetch";
import { tokenSortsBefore } from "./token";
import { factoryAddress, initCodeHash, minimumLiquidity } from "./index";
import {
  Input_pairAddress,
  Input_pairInputAmount,
  Input_pairInputNextPair,
  Input_pairLiquidityMinted,
  Input_pairLiquidityToken,
  Input_pairLiquidityValue,
  Input_pairOutputAmount,
  Input_pairOutputNextPair,
  Input_pairReserves,
  Input_pairToken0Price,
  Input_pairToken1Price,
  Pair,
  SHA3_Query,
  Token,
  TokenAmount,
} from "./w3";
import { ProcessedPair } from "../utils/ProcessedPair";
import Price from "../utils/Price";
import { concat, getChecksumAddress } from "../utils/addressUtils";

import { BigInt } from "@web3api/wasm-as";

// returns address of pair liquidity token contract
// see https://uniswap.org/docs/v2/javascript-SDK/getting-pair-addresses/
// and https://eips.ethereum.org/EIPS/eip-1014
export function pairAddress(input: Input_pairAddress): string {
  let tokenA: string;
  let tokenB: string;
  if (tokenSortsBefore({ token: input.token0, other: input.token1 })) {
    tokenA = input.token0.address;
    tokenB = input.token1.address;
  } else {
    tokenA = input.token1.address;
    tokenB = input.token0.address;
  }
  const salt: string = SHA3_Query.hex_keccak_256({
    message: tokenA.substring(2) + tokenB.substring(2),
  });
  const concatenatedItems: Uint8Array = concat([
    "0xff",
    getChecksumAddress(factoryAddress()),
    salt,
    initCodeHash(),
  ]);
  const concatenationHash: string = SHA3_Query.buffer_keccak_256({
    message: concatenatedItems.buffer,
  });
  return getChecksumAddress(concatenationHash.substring(24));
}

// returns pair liquidity token
export function pairLiquidityToken(input: Input_pairLiquidityToken): Token {
  const pair: Pair = input.pair;
  const token0: Token = pair.tokenAmount0.token;
  const token1: Token = pair.tokenAmount1.token;
  return fetchTokenData({
    chainId: token0.chainId,
    address: pairAddress({ token0, token1 }),
    symbol: null,
    name: null,
  });
}

// returns the reserves for pair tokens in sorted order
export function pairReserves(input: Input_pairReserves): TokenAmount[] {
  const pair: Pair = input.pair;
  if (
    tokenSortsBefore({
      token: pair.tokenAmount0.token,
      other: pair.tokenAmount1.token,
    })
  ) {
    return [pair.tokenAmount0, pair.tokenAmount1];
  }
  return [pair.tokenAmount1, pair.tokenAmount0];
}

// Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
export function pairToken0Price(input: Input_pairToken0Price): string {
  const pair = input.pair;
  const price = new Price(
    pair.tokenAmount0.token,
    pair.tokenAmount1.token,
    pair.tokenAmount0.amount,
    pair.tokenAmount1.amount
  );
  return price.toFixed(18);
}

// Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
export function pairToken1Price(input: Input_pairToken1Price): string {
  const pair = input.pair;
  const price = new Price(
    pair.tokenAmount1.token,
    pair.tokenAmount0.token,
    pair.tokenAmount1.amount,
    pair.tokenAmount0.amount
  );
  return price.toFixed(18);
}

// Pricing function for exact input amounts. Returns maximum output amount, based on current reserves, if the trade were executed.
export function pairOutputAmount(input: Input_pairOutputAmount): TokenAmount {
  const pair: Pair = input.pair;
  const tradeTokenAmount: TokenAmount = input.inputAmount;
  return ProcessedPair.pairOutputForExactInput(pair, tradeTokenAmount).amount;
}

// Pricing function for exact input amounts. Returns next pair state, based on current reserves, if the trade were executed.
export function pairOutputNextPair(input: Input_pairOutputNextPair): Pair {
  const pair: Pair = input.pair;
  const tradeTokenAmount: TokenAmount = input.inputAmount;
  return ProcessedPair.pairOutputForExactInput(pair, tradeTokenAmount).nextPair;
}

// Pricing function for exact output amounts. Returns minimum input amount, based on current reserves, if the trade were executed.
export function pairInputAmount(input: Input_pairInputAmount): TokenAmount {
  const pair: Pair = input.pair;
  const tradeTokenAmount: TokenAmount = input.outputAmount;
  return ProcessedPair.pairInputForExactOutput(pair, tradeTokenAmount).amount;
}

// Pricing function for exact output amounts. Returns next pair state, based on current reserves, if the trade were executed.
export function pairInputNextPair(input: Input_pairInputNextPair): Pair {
  const pair: Pair = input.pair;
  const tradeTokenAmount: TokenAmount = input.outputAmount;
  return ProcessedPair.pairInputForExactOutput(pair, tradeTokenAmount).nextPair;
}

/*
Calculates the exact amount of liquidity tokens minted from a given amount of token0 and token1.
  totalSupply is total supply of pair liquidity token.
  totalSupply must be looked up on-chain.
  The value returned from this function cannot be used as an input to getLiquidityValue.
*/
export function pairLiquidityMinted(
  input: Input_pairLiquidityMinted
): TokenAmount {
  const pair: Pair = input.pair;
  const totalSupply: TokenAmount = input.totalSupply;
  const tokenAmount0: TokenAmount = input.tokenAmount0;
  const tokenAmount1: TokenAmount = input.tokenAmount1;
  // sort order
  const pairTokens = tokenSortsBefore({
    token: pair.tokenAmount0.token,
    other: pair.tokenAmount1.token,
  })
    ? [pair.tokenAmount0, pair.tokenAmount1]
    : [pair.tokenAmount1, pair.tokenAmount0];
  const tokenAmounts = tokenSortsBefore({
    token: tokenAmount0.token,
    other: tokenAmount1.token,
  })
    ? [tokenAmount0, tokenAmount1]
    : [tokenAmount1, tokenAmount0];
  // calculate liquidity to mint
  let liquidity: BigInt;
  let amount0 = tokenAmounts[0].amount;
  let amount1 = tokenAmounts[1].amount;
  const supply = totalSupply.amount;
  if (supply.eq(BigInt.ZERO)) {
    const minLiq = BigInt.fromUInt32(minimumLiquidity());
    liquidity = amount0.mul(amount1).sqrt().sub(minLiq);
  } else {
    const pairAmt0 = pairTokens[0].amount;
    const pairAmt1 = pairTokens[1].amount;
    amount0 = amount0.mul(supply).div(pairAmt0);
    amount1 = amount1.mul(supply).div(pairAmt1);
    liquidity = amount0.lt(amount1) ? amount0 : amount1;
  }
  if (liquidity.eq(BigInt.ZERO)) {
    throw new Error(
      "Insufficient liquidity: liquidity minted must be greater than zero"
    );
  }
  return {
    token: totalSupply.token,
    amount: liquidity,
  };
}

/*
Calculates the exact amount of token0 or token1 that the given amount of liquidity tokens represent.
  totalSupply is total supply of pair liquidity token.
  totalSupply must be looked up on-chain.
  If the protocol charge is on, feeOn must be set to true, and kLast must be provided from an on-chain lookup.
  Values returned from this function cannot be used as inputs to getLiquidityMinted.
*/
export function pairLiquidityValue(
  input: Input_pairLiquidityValue
): TokenAmount[] {
  const pair: Pair = input.pair;
  const totalSupply: TokenAmount = input.totalSupply;
  const liquidity: TokenAmount = input.liquidity;
  const feeOn: bool = !input.feeOn.isNull && input.feeOn.value;
  const kLast: BigInt = input.kLast === null ? BigInt.ZERO : input.kLast!;
  const amount0 = pair.tokenAmount0.amount;
  const amount1 = pair.tokenAmount1.amount;
  const liqAmt = liquidity.amount;
  let totalSupplyAmount = totalSupply.amount;
  if (feeOn && kLast.gt(BigInt.ZERO)) {
    const rootK = amount0.mul(amount1).sqrt();
    const rootKLast = kLast.sqrt();
    if (rootK.gt(rootKLast)) {
      const numerator1 = totalSupplyAmount;
      const numerator2 = rootK.sub(rootKLast);
      const denominator = rootK.mul(BigInt.fromUInt16(5)).add(rootKLast);
      const feeLiquidity = numerator1.mul(numerator2).div(denominator);
      totalSupplyAmount = totalSupplyAmount.add(feeLiquidity);
    }
  }
  const token0Value = amount0.mul(liqAmt).div(totalSupplyAmount);
  const token1Value = amount1.mul(liqAmt).div(totalSupplyAmount);

  return [
    { token: pair.tokenAmount0.token, amount: token0Value },
    { token: pair.tokenAmount1.token, amount: token1Value },
  ];
}
