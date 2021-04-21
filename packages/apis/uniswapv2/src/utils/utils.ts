import { ChainId, Token } from "../query/w3";

export function compareAddresses(ref: string, other: string): i32 {
  const n: i32 = ref.length < other.length ? ref.length : other.length;
  for (let i = 0; i < n; i++) {
    if (ref.charAt(i) < other.charAt(i)) return -1;
    if (ref.charAt(i) > other.charAt(i)) return 1;
  }
  return ref.length - other.length;
}

export function resolveChainId(chainId: ChainId): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "1";
    case ChainId.ROPSTEN:
      return "3";
    case ChainId.RINKEBY:
      return "4";
    case ChainId.GOERLI:
      return "5";
    case ChainId.KOVAN:
      return "42";
    default:
      throw new Error("Unknown chain ID. This should never happen.");
  }
}

export function getWETH9(chainId: ChainId): Token {
  switch (chainId) {
    case ChainId.MAINNET:
      return {
        chainId: ChainId.MAINNET,
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: 18,
        symbol: "WETH9",
        name: "Wrapped Ether",
      };
    case ChainId.ROPSTEN:
      return {
        chainId: ChainId.ROPSTEN,
        address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        decimals: 18,
        symbol: "WETH9",
        name: "Wrapped Ether",
      };
    case ChainId.RINKEBY:
      return {
        chainId: ChainId.RINKEBY,
        address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        decimals: 18,
        symbol: "WETH9",
        name: "Wrapped Ether",
      };
    case ChainId.GOERLI:
      return {
        chainId: ChainId.GOERLI,
        address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        decimals: 18,
        symbol: "WETH9",
        name: "Wrapped Ether",
      };
    case ChainId.KOVAN:
      return {
        chainId: ChainId.KOVAN,
        address: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
        decimals: 18,
        symbol: "WETH9",
        name: "Wrapped Ether",
      };
    default:
      throw new Error("Unknown chain ID. This should never happen.");
  }
}
