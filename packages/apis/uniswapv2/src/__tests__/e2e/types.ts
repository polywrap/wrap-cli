export enum ChainId {
  MAINNET="MAINNET",
  ROPSTEN="ROPSTEN",
  RINKEBY="RINKEBY",
  GOERLI="GOERLI",
  KOVAN="KOVAN"
}

export interface Token {
  chainId: ChainId;
  address: string;
  decimals: number;
  symbol: string | null
  name: string | null
}

export interface TokenAmount {
  token: Token;
  amount: string;
}

export interface Pair {
  tokenAmount0: TokenAmount;
  tokenAmount1: TokenAmount;
}

export interface Route {
  pairs: Pair[];
  input: Token;
}

export interface Trade {
  route: Route;
  amount: TokenAmount;
  tradeType: TradeType;
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export interface BestTradeOptions {
  maxNumResults: number;
  maxHops: number;
}