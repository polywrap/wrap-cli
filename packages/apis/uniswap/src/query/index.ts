import { Ethereum_Query } from "./w3/imported";

// constants ///////////////////////////////////////////////////////////////////

const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const MINIMUM_LIQUDIITY = 10**3;

// types ///////////////////////////////////////////////////////////////////////

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
}

// Token functions /////////////////////////////////////////////////////////////

// Checks if the current instance is equal to another (has an identical chainId and address).
export function tokenEquals(input: Input_tokenEquals): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.chainId === other.chainId && token.address === other.address
}

// Checks if the current instance sorts before another, by address.
export function tokenSortsBefore(input: Input_tokenSortsBefore): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.address.localeCompare(other.address) < 0;
}

// Pair functions //////////////////////////////////////////////////////////////

// TODO: this can be calculated off-chain with keccack256
export function pairAddress(input: Input_pairAddress): string {
  const token0: Token = input.token0.address;
  const token1: Token = input.token1.address;
  return Ethereum_Query.callView({
    address: FACTORY_ADDRESS,
    method: "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    args: [token0, token1]
  });
}

export function pairLiquidityToken(input: Input_pairLiquidityToken): Token {
  const pair: Pair = input.pair;
  const token0: Token = pair.token0.token;
  const token1: Token = pair.token1.token;
  return fetchTokenData({
    chainId: pair.token0.token.chainId,
    address: pairAddress({token0, token1}),
  });
}

// export function pairReserve0(input: Input_pairReserve0): u256 {
//   const pair: Pair = input.pair;
//   return "";
// }
//
// export function pairReserve1(input: Input_pairReserve1): u256 {
//   const pair: Pair = input.pair;
//   return "";
// }
//
// export function pairOutputAmount(input: Input_pairOutputAmount): TokenAmount {
//   const pair: Pair = input.pair;
//   const inputAmount: TokenAmount = input.inputAmount;
//   return "";
// }
//
// export function pairInputAmount(input: Input_pairInputAmount): TokenAmount {
//   const pair: Pair = input.pair;
//   const outputAmount: TokenAmount = input.outputAmount;
//   return "";
// }
//
// export function pairLiquidityValue(input: Input_pairLiquidityValue): TokenAmount {
//   const pair: Pair = input.pair;
//   const token: Token = input.token;
//   const totalSupply: TokenAmount = input.totalSupply;
//   const liquidity: TokenAmount = input.liquidity;
//   return "";
// }

// Fetch functions /////////////////////////////////////////////////////////////

export function fetchTokenData(input: Input_fetchTokenData): Token {
  const address: string = input.address;
  const chainId: ChainId = input.chainId; // TODO: make nullable
  const symbol: string = input.symbol ?? Ethereum_Query.callView({
    address: address,
    method: "function symbol() external pure returns (string memory)",
    args: []
  });
  const name: string = input.name ?? Ethereum_Query.callView({
    address: address,
    method: "function name() external pure returns (string memory)",
    args: []
  });
  const decimals: string = Ethereum_Query.callView({
    address: address,
    method: "function decimals() external pure returns (uint8)",
    args: []
  });
  return {
    chainId: chainId,
    address: address,
    decimals: U8.parseInt(decimals),
    symbol: symbol,
    name: name,
  };
}

export function fetchPairData(input: Input_fetchPairData): Pair {
  const token0: Token = input.token0;
  const token1: Token = input.token1;

  // get amounts
  const address = pairAddress({ token0, token1 });
  const amounts: string = Ethereum_Query.callView({
    address: address,
    method: "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    args: []
  });
  const [amountA, amountB, _] = amounts.substring(1, amounts.length - 1).split(",");

  // returned amounts are ordered by token sort order
  const token0SortsBefore: boolean = tokenSortsBefore({token0, token1});
  const amount0 = token0SortsBefore ? amountA : amountB;
  const amount1 = token0SortsBefore ? amountB : amountA;

  return {
    token0: {
      token: token0,
      amount: U256.parseInt(amount0),
    },
    token1: {
      token: token1,
      amount: U256.parseInt(amount1),
    }
  };
}