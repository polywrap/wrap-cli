import { Ethereum_Query } from "./w3/imported";
import { resolveChainId } from "../utils";
import { mulDiv, sqrt } from "../mathUtils";
import { fetchTokenData } from "./fetch";

// TODO: this can be calculated off-chain with keccack256
// returns address of pair liquidity token contract
export function pairAddress(input: Input_pairAddress): string {
  const token0: Token = input.token0.address;
  const token1: Token = input.token1.address;
  return Ethereum_Query.callView({
    address: FACTORY_ADDRESS,
    method: "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    args: [token0, token1],
    network: resolveChainId(token0.chainId)
  });
}

// returns pair liquidity token
export function pairLiquidityToken(input: Input_pairLiquidityToken): Token {
  const pair: Pair = input.pair;
  const token0: Token = pair.token0.token;
  const token1: Token = pair.token1.token;
  return fetchTokenData({
    chainId: pair.token0.token.chainId,
    address: pairAddress({token0, token1}),
  });
}

// returns the reserve of token0
export function pairReserve0(input: Input_pairReserves): u256 {
  const pair: Pair = input.pair;
  return pair.token0.amount;
}

// returns the reserve of token1
export function pairReserve1(input: Input_pairReserves): u256 {
  const pair: Pair = input.pair;
  return pair.token1.amount;
}

// given some amount of an asset and pair reserves, returns an equivalent amount of the other asset
export function quote(amountA: u256, reserveA: u256, reserveB: u256): u256 {
  if (amountA == 0) {
    throw new RangeError("Insufficient input amount: Input amount must be greater than zero");
  }
  if (reserveA == 0 || reserveB == 0) {
    throw new RangeError("Insufficient liquidity: Pair reserves must be greater than zero")
  }
  return amountA * reserveB / reserveA;
}

// Pricing function for exact input amounts. Returns maximum output amount, based on current reserves, if the trade were executed.
export function pairOutputAmount(input: Input_pairOutputAmount): TokenAmount {
  const pair: Pair = input.pair;
  const tradeTokenAmount: TokenAmount = input.inputAmount;
  if (tradeTokenAmount.amount == 0) {
    throw new RangeError("Insufficient input amount: Input amount must be greater than zero");
  }
  if (pair.token0.amount == 0 || pair.token1.amount == 0) {
    throw new RangeError("Insufficient liquidity: Pair reserves must be greater than zero")
  }
  let inTokenAmount: TokenAmount;
  let outTokenAmount: TokenAmount;
  if (tokenEquals({ pair.token0.token, tradeTokenAmount.token })) {
    inTokenAmount = pair.token0;
    outTokenAmount = pair.token1;
  }  else {
    inTokenAmount = pair.token1;
    outTokenAmount = pair.token0;
  }
  const amountInWithFee: u256 = tradeTokenAmount.amount * 997;
  const numerator: u256 = amountInWithFee * outTokenAmount.amount;
  const denominator: u256 = (inTokenAmount.amount * 1000) + amountInWithFee;
  return {
    token: outTokenAmount.token,
    amount: numerator / denominator,
  };
}

// Pricing function for exact output amounts. Returns minimum input amount, based on current reserves, if the trade were executed.
export function pairInputAmount(input: Input_pairInputAmount): TokenAmount {
  const pair: Pair = input.pair;
  const tradeTokenAmount: TokenAmount = input.outputAmount;
  if (tradeTokenAmount.amount == 0) {
    throw new RangeError("Insufficient output amount: Output amount must be greater than zero");
  }
  if (pair.token0.amount == 0 || pair.token1.amount == 0) {
    throw new RangeError("Insufficient liquidity: Pair reserves must be greater than zero")
  }
  let inTokenAmount: TokenAmount;
  let outTokenAmount: TokenAmount;
  if (tokenEquals({ pair.token0.token, tradeTokenAmount.token })) {
    outTokenAmount = pair.token0;
    inTokenAmount = pair.token1;
  }  else {
    outTokenAmount = pair.token1;
    inTokenAmount = pair.token0;
  }
  const numerator: u256 = inTokenAmount.amount * tradeTokenAmount.amount * 1000;
  const denominator: u256 = (outTokenAmount - tradeTokenAmount.amount) * 997;
  return {
    token: inTokenAmount.token,
    amount: numerator / denominator + 1,
  };
}

/*
Calculates the exact amount of liquidity tokens minted from a given amount of token0 and token1.
  totalSupply is total supply of pair liquidity token.
  totalSupply must be looked up on-chain.
  The value returned from this function cannot be used as an input to getLiquidityValue.
*/
export function pairLiquidityMinted(input: Input_pairLiquidityMinted): TokenAmount {
  const pair: Pair = input.pair;
  const totalSupply: TokenAmount = input.totalSupply;
  const tokenAmount0: TokenAmount = input.tokenAmount0;
  const tokenAmount1: TokenAmount = input.tokenAmount1;
  // sort order
  const pairTokens = tokenSortsBefore({ pair.token0.token, pair.token1.token })
    ? [pair.token0, pair.token1]
    : [pair.token1, pair.token0];
  const tokenAmounts = tokenSortsBefore({ tokenAmount0.token, tokenAmount1.token })
    ? [tokenAmount0, tokenAmount1]
    : [tokenAmount1, tokenAmount0];
  // calculate liquidity to mint
  let liquidity: u256;
  if (totalSupply.amount == 0) {
    liquidity = sqrt( tokenAmounts[0].amount * tokenAmounts[1].amount) - MINIMUM_LIQUDIITY;
  } else {
    const amount0 = tokenAmounts[0].amount * totalSupply.amount / pairTokens[0].amount;
    const amount1 = tokenAmounts[1].amount * totalSupply.amount / pairTokens[1].amount;
    liquidity = Math.min(amount0, amount1);
  }
  if (liquidity == 0) {
    throw new Error("Insufficient liquidity: liquidity minted must be greater than zero");
  }
  return {
    token: totalSupply.token,
    amount: liquidity
  }
}

/*
Calculates the exact amount of token0 or token1 that the given amount of liquidity tokens represent.
  totalSupply is total supply of pair liquidity token.
  totalSupply must be looked up on-chain.
  If the protocol charge is on, feeOn must be set to true, and kLast must be provided from an on-chain lookup.
  Values returned from this function cannot be used as inputs to getLiquidityMinted.
*/
export function pairLiquidityValue(input: Input_pairLiquidityValue): TokenAmount[] {
  const pair: Pair = input.pair;
  const totalSupply: TokenAmount = input.totalSupply;
  const liquidity: TokenAmount = input.liquidity;
  const feeOn: boolean = input.feeOn != null ? input.feeOn : false;
  const kLast: Uint256 = input.kLast != null ? input.kLast : 0;

  let totalSupplyAmount = totalSupply.amount;
  if (feeOn && kLast > 0) {
    const rootK = sqrt(pair.token0.amount * pair.token1.amount);
    const rootKLast = sqrt(kLast);
    if (rootK > rootKLast) {
      const numerator1 = totalSupply;
      const numerator2 = rootK - rootKLast;
      const denominator = (rootK * 5) + rootKLast;
      const feeLiquidity = mulDiv(numerator1, numerator2, denominator);
      totalSupplyAmount = totalSupplyAmount + feeLiquidity;
    }
  }
  const token0Value = pair.token0.amount * liquidity.amount / totalSupplyAmount;
  const token1Value = pair.token1.amount * liquidity.amount / totalSupplyAmount;

  return [
    {token: pair.token0.token, amount: token0Value},
    {token: pair.token1.token, amount: token1Value}
  ]
}