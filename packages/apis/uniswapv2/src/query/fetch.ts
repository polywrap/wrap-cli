import { Ethereum_Query } from "./w3/imported";
import { resolveChainId } from "../utils";

export function fetchTokenData(input: Input_fetchTokenData): Token {
  const address: string = input.address;
  const chainId: ChainId = input.chainId;
  const symbol: string = input.symbol != null ? input.symbol : Ethereum_Query.callView({
    address: address,
    method: "function symbol() external pure returns (string memory)",
    args: [],
    network: resolveChainId(chainId)
  });
  const name: string = input.name != null ? input.name : Ethereum_Query.callView({
    address: address,
    method: "function name() external pure returns (string memory)",
    args: [],
    network: resolveChainId(chainId)
  });
  const decimals: string = Ethereum_Query.callView({
    address: address,
    method: "function decimals() external pure returns (uint8)",
    args: [],
    network: resolveChainId(chainId)
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
  const res: string = Ethereum_Query.callView({
    address: address,
    method: "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    args: [],
    network: resolveChainId(token0.chainId)
  });
  // TODO: confirm that this is what res will look like
  const [amountA, amountB, _] = res.substring(1, res.length - 1).split(",");

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

// returns total supply of ERC20-compliant token
export function fetchTotalSupply(input: Input_fetchTotalSupply): TokenAmount {
  const token: Token = input.token;
  const res: string = Ethereum_Query.callView({
    address: token.address,
    method: "function totalSupply() external view returns (uint)",
    args: [],
    network: resolveChainId(token.chainId)
  });
  return {
    token: token,
    amount: parseInt(res),
  }
}

// input token must be a pair liquidity token
// returns reserve0 * reserve1, as of immediately after the most recent liquidity event
export function fetchKLast(input: Input_fetchKLast): u256 {
  const token: Token = input.token;
  const res: string = Ethereum_Query.callView({
    address: token.address,
    method: "function kLast() external view returns (uint)",
    args: [],
    network: resolveChainId(token.chainId)
  });
  return parseInt(res);
}