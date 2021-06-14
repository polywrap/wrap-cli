import { tokenSortsBefore } from "./token";
import {
  ChainId,
  Ethereum_Query,
  getChainIdKey,
  Input_fetchKLast,
  Input_fetchPairData,
  Input_fetchTokenData,
  Input_fetchTotalSupply,
  Pair,
  Token,
  TokenAmount,
} from "./w3";
import { pairAddress } from "./pair";
import { wrapIfEther } from "../utils/utils";

import { BigInt } from "@web3api/wasm-as";

export function fetchTokenData(input: Input_fetchTokenData): Token {
  const address: string = input.address;
  const chainId: ChainId = input.chainId;
  const symbol: string =
    input.symbol != null
      ? input.symbol!
      : Ethereum_Query.callContractView({
          address: address,
          method: "function symbol() external pure returns (string memory)",
          args: [],
          connection: {
            node: null,
            networkNameOrChainId: getChainIdKey(chainId),
          },
        });
  const name: string =
    input.name != null
      ? input.name!
      : Ethereum_Query.callContractView({
          address: address,
          method: "function name() external pure returns (string memory)",
          args: [],
          connection: {
            node: null,
            networkNameOrChainId: getChainIdKey(chainId),
          },
        });
  const decimals: string = Ethereum_Query.callContractView({
    address: address,
    method: "function decimals() external pure returns (uint8)",
    args: [],
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(chainId),
    },
  });
  return {
    chainId: chainId,
    address: address,
    currency: {
      decimals: U8.parseInt(decimals),
      symbol: symbol,
      name: name,
    },
  };
}

// returns pair data in token-sorted order
export function fetchPairData(input: Input_fetchPairData): Pair {
  let token0: Token = input.token0;
  let token1: Token = input.token1;
  // wrap if ether
  token0 = wrapIfEther(token0);
  token1 = wrapIfEther(token1);
  // get amounts
  const address = pairAddress({ token0, token1 });
  const res: string = Ethereum_Query.callContractView({
    address: address,
    method:
      "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    args: [],
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(token0.chainId),
    },
  });
  const resArray: string[] = res.split(",");
  const amountA = resArray[0];
  const amountB = resArray[1];

  // returned amounts are ordered by token sort order
  const token0SortsBefore: boolean = tokenSortsBefore({
    token: token0,
    other: token1,
  });

  if (token0SortsBefore) {
    return {
      tokenAmount0: {
        token: token0,
        amount: BigInt.fromString(amountA),
      },
      tokenAmount1: {
        token: token1,
        amount: BigInt.fromString(amountB),
      },
    };
  } else {
    return {
      tokenAmount0: {
        token: token1,
        amount: BigInt.fromString(amountA),
      },
      tokenAmount1: {
        token: token0,
        amount: BigInt.fromString(amountB),
      },
    };
  }
}

// returns total supply of ERC20-compliant token
export function fetchTotalSupply(input: Input_fetchTotalSupply): TokenAmount {
  const token: Token = input.token;
  const res: string = Ethereum_Query.callContractView({
    address: token.address,
    method: "function totalSupply() external view returns (uint)",
    args: [],
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(token.chainId),
    },
  });
  return {
    token: token,
    amount: BigInt.fromString(res),
  };
}

// input token must be a pair liquidity token
// returns reserve0 * reserve1, as of immediately after the most recent liquidity event
export function fetchKLast(input: Input_fetchKLast): BigInt {
  const token: Token = input.token;
  const result: string = Ethereum_Query.callContractView({
    address: token.address,
    method: "function kLast() external view returns (uint)",
    args: [],
    connection: {
      node: null,
      networkNameOrChainId: getChainIdKey(token.chainId),
    },
  });
  return BigInt.fromString(result);
}
