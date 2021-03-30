import * as fetch from "./fetch";
import * as token from "./token";
import * as pair from "./pair";

export {fetch, token, pair};

// TODO: write safemath utils for assemblyscript? or bignumber class? Need u256 solution

// constants ///////////////////////////////////////////////////////////////////

export const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
export const MINIMUM_LIQUDIITY = 10**3;

// types ///////////////////////////////////////////////////////////////////////

/*export enum ChainId {
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
  token0: TokenAmount;
  token1: TokenAmount;
}

export type Route = {
  pairs: Pair[];
  input: Token;
}

export type Trade = {
  route: Route;
  amount: TokenAmount;
  tradeType: TradeType;
}*/