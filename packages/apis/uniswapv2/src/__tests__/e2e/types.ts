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
  currency: Currency;
}

export interface Currency {
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
  path: Token[];
  pairs: Pair[];
  input: Token;
  output: Token;
}

export interface Trade {
  route: Route;
  inputAmount: TokenAmount;
  outputAmount: TokenAmount;
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

export interface TradeOptions {
  allowedSlippage: string;
  recipient: string;
  unixTimestamp: number;
  ttl: number;
  deadline: number;
  feeOnTransfer: boolean;
}