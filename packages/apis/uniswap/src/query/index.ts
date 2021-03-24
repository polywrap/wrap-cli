import { Ethereum_Query } from "./w3/imported";

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 420,
  KOVAN = 42
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export type Token = {
  chainId: ChainId;
  address: string;
  decimals: u8;
  symbol?: string;
  name?: string;
}

export type TokenAmount = {
  token: Token;
  amount: u256;
}

export type Pair = {
  token0: Token;
  token1: Token;
}

export type Route = {
  pairs: Pair[];
  input: Token;
}

export type Trade = {
  route: Route;
  amount: TokenAmount;
  tradeType: TradeType;
}

// Token functions /////////////////////////////////////////////////////////////

export function tokenEquals(input: Input_tokenEquals): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.chainId === other.chainId && token.address === other.address
}

export function tokenSortsBefore(input: Input_tokenSortsBefore): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.address.localeCompare(other.address) < 0;
}

// Pair functions //////////////////////////////////////////////////////////////

export function pairAddress(input: Input_pairAddress): string {
  const pair: Pair = input.pair;
  return "";
}

export function pairLiquidityToken(input: Input_pairLiquidityToken): Token {
  const pair: Pair = input.pair;
  return "";
}

export function pairReserve0(input: Input_pairReserve0): u256 {
  const pair: Pair = input.pair;
  return "";
}

export function pairReserve1(input: Input_pairReserve1): u256 {
  const pair: Pair = input.pair;
  return "";
}

export function pairOutputAmount(input: Input_pairOutputAmount): TokenAmount {
  const pair: Pair = input.pair;
  const inputAmount: TokenAmount = input.inputAmount;
  return "";
}

export function pairInputAmount(input: Input_pairInputAmount): TokenAmount {
  const pair: Pair = input.pair;
  const outputAmount: TokenAmount = input.outputAmount;
  return "";
}

export function pairLiquidityValue(input: Input_pairLiquidityValue): TokenAmount {
  const pair: Pair = input.pair;
  const token: Token = input.token;
  const totalSupply: TokenAmount = input.totalSupply;
  const liquidity: TokenAmount = input.liquidity;
  return "";
}