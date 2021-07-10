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

export interface SwapParameters {
  methodName: string;
  args: string[];
  value: string;
}

export interface TradeOptions {
  allowedSlippage: string;
  recipient: string;
  unixTimestamp: number;
  ttl?: number;
  deadline?: number;
  feeOnTransfer?: boolean;
}

export interface Log {
  blockNumber: string;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: string[];
  transactionHash: string;
  logIndex: number;
}

export interface TxReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  root?: string;
  gasUsed: string;
  logsBloom: string;
  transactionHash: string;
  logs: Log[];
  blockNumber: string;
  blockHash: string;
  confirmations: number;
  cumulativeGasUsed: string;
  byzantium: boolean;
  status?: number;
}

export interface TxResponse {
  hash: string;
  to?: string;
  from: string;
  nonce: number;
  gasLimit: string;
  gasPrice: string;
  data: string;
  value: string;
  chainId: number;
  blockNumber?: string;
  blockHash?: string;
  timestamp?: number;
  confirmations: number;
  raw?: string;
  r?: string;
  s?: string;
  v?: number;
  type?: number;
  accessList?: Access[];
}

export interface Access {
  address: string;
  storageKeys: string[];
}

export interface StaticTxResult {
  result: string;
  error: boolean;
}

export interface TxOverrides {
  gasPrice: string | null
  gasLimit: string | null
}