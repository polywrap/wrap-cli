import { tokenEquals } from "../../query";
import { ChainId } from "../../query/w3";

const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
const ADDRESS_TWO = '0x0000000000000000000000000000000000000002'

describe('tokenEquals', () => {
  test("returns false if address differs", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 18,
        name: null,
        symbol: null
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_TWO,
        decimals: 18,
        name: null,
        symbol: null
      }
    });

    expect(result).toBe(false);
  });

  test("returns false if chain id differse", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 18,
        name: null,
        symbol: null
      },
      other: {
        chainId: ChainId.ROPSTEN,
        address: ADDRESS_ONE,
        decimals: 18,
        name: null,
        symbol: null
      }
    });

    expect(result).toBe(false);
  });

  test("returns true if only decimals differ", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 18,
        name: null,
        symbol: null
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 9,
        name: null,
        symbol: null
      }
    });

    expect(result).toBe(true);
  });

  test("returns true if address is the same", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 18,
        name: null,
        symbol: null
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 18,
        name: null,
        symbol: null
      }
    });

    expect(result).toBe(true);
  });

  test("returns true if name/symbol/decimals differ", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 18,
        name: "token0",
        symbol: "a"
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        decimals: 9,
        name: "token1",
        symbol: "b"
      }
    });

    expect(result).toBe(true);
  });
})
