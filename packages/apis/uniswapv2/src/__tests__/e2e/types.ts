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
  EXACT_INPUT="EXACT_INPUT",
  EXACT_OUTPUT="EXACT_OUTPUT"
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

export interface Log {
  blockNumber: number
  blockHash: string
  transactionIndex: number
  removed: boolean
  address: string
  data: string
  topics: string[]
  transactionHash: string
  logIndex: number
}

export interface TxReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  root: string
  gasUsed: string
  logsBloom: string
  blockHash: string
  transactionHash: string
  logs: Log[]
  blockNumber: number
  confirmations: number
  cumulativeGasUsed: string
  byzantium: boolean
  status: number
}

export interface TxOverrides {
  gasPrice: string | null
  gasLimit: string | null
}