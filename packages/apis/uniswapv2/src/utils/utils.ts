import { ChainId, Token, TokenAmount } from "../query/w3";
import { ETHER } from "./Currency";
import { currencyEquals } from "../query";

export function getWETH9(chainId: ChainId): Token {
  switch (chainId) {
    case ChainId.MAINNET:
      return {
        chainId: ChainId.MAINNET,
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        currency: {
          decimals: 18,
          symbol: "WETH",
          name: "Wrapped Ether",
        },
      };
    case ChainId.ROPSTEN:
      return {
        chainId: ChainId.ROPSTEN,
        address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        currency: {
          decimals: 18,
          symbol: "WETH",
          name: "Wrapped Ether",
        },
      };
    case ChainId.RINKEBY:
      return {
        chainId: ChainId.RINKEBY,
        address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        currency: {
          decimals: 18,
          symbol: "WETH",
          name: "Wrapped Ether",
        },
      };
    case ChainId.GOERLI:
      return {
        chainId: ChainId.GOERLI,
        address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        currency: {
          decimals: 18,
          symbol: "WETH",
          name: "Wrapped Ether",
        },
      };
    case ChainId.KOVAN:
      return {
        chainId: ChainId.KOVAN,
        address: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
        currency: {
          decimals: 18,
          symbol: "WETH",
          name: "Wrapped Ether",
        },
      };
    default:
      throw new Error("Unknown chain ID. This should never happen.");
  }
}

// check if need to wrap ether
export function wrapIfEther(token: Token): Token {
  if (
    currencyEquals({ currency: token.currency, other: ETHER }) &&
    token.address == ""
  ) {
    return getWETH9(token.chainId);
  }
  return token;
}

export function copyToken(token: Token): Token {
  return {
    chainId: token.chainId,
    address: token.address,
    currency: {
      name: token.currency.name,
      symbol: token.currency.symbol,
      decimals: token.currency.decimals,
    },
  };
}

export function copyTokenAmount(tokenAmount: TokenAmount): TokenAmount {
  return {
    token: copyToken(tokenAmount.token),
    amount: tokenAmount.amount,
  };
}
