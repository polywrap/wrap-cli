import { tokenAmountEquals, tokenEquals, tokenSortsBefore } from "../../query";
import { ChainId } from "../../query/w3";

import { BigInt } from "as-bigint";

const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
const ADDRESS_TWO = '0x0000000000000000000000000000000000000002'

describe('tokenEquals', () => {
  test("returns false if address differs", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_TWO,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      }
    });

    expect(result).toBe(false);
  });

  test("returns false if chain id differse", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      },
      other: {
        chainId: ChainId.ROPSTEN,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      }
    });

    expect(result).toBe(false);
  });

  test("returns true if only decimals differ", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 9,
          name: null,
          symbol: null
        }
      }
    });

    expect(result).toBe(true);
  });

  test("returns true if address is the same", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      }
    });

    expect(result).toBe(true);
  });

  test("returns true if name/symbol/decimals differ", () => {
    const result = tokenEquals({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: "token0",
          symbol: "a"
        }
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 9,
          name: "token1",
          symbol: "b"
        }
      }
    });

    expect(result).toBe(true);
  });
})

describe('tokenAmountEquals', () => {

  test("returns true if TokenAmounts have same token and same amounts", () => {
    const result = tokenAmountEquals({
      tokenAmount0: {
        token: {
          chainId: ChainId.MAINNET,
          address: ADDRESS_ONE,
          currency: {
            decimals: 18,
            name: null,
            symbol: null
          }
        },
        amount: BigInt.fromString("1000")
      },
      tokenAmount1: {
        token: {
          chainId: ChainId.MAINNET,
          address: ADDRESS_ONE,
          currency: {
            decimals: 18,
            name: null,
            symbol: null
          }
        },
        amount: BigInt.fromString("1000")
      },
    });

    expect(result).toBe(true);
  });

  test("returns false if TokenAmounts have same token and different amounts", () => {
    const result = tokenAmountEquals({
      tokenAmount0: {
        token: {
          chainId: ChainId.MAINNET,
          address: ADDRESS_ONE,
          currency: {
            decimals: 18,
            name: null,
            symbol: null
          }
        },
        amount: BigInt.fromString("1001")
      },
      tokenAmount1: {
        token: {
          chainId: ChainId.MAINNET,
          address: ADDRESS_ONE,
          currency: {
            decimals: 18,
            name: null,
            symbol: null
          }
        },
        amount: BigInt.fromString("1000")
      },
    });

    expect(result).toBe(false);
  });

  test("returns false if TokenAmounts have different tokens and same amounts", () => {
    const result = tokenAmountEquals({
      tokenAmount0: {
        token: {
          chainId: ChainId.MAINNET,
          address: ADDRESS_ONE,
          currency: {
            decimals: 18,
            name: null,
            symbol: null
          }
        },
        amount: BigInt.fromString("1000")
      },
      tokenAmount1: {
        token: {
          chainId: ChainId.MAINNET,
          address: ADDRESS_TWO,
          currency: {
            decimals: 18,
            name: null,
            symbol: null
          }
        },
        amount: BigInt.fromString("1000")
      },
    });

    expect(result).toBe(false);
  });

});

describe('tokenSortsBefore', () => {

  test("returns true if address sorts before other", () => {
    const result = tokenSortsBefore({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_TWO,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      }
    });

    expect(result).toBe(true);
  });

  test("returns false if address sorts after other", () => {
    const result = tokenSortsBefore({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_TWO,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      }
    });

    expect(result).toBe(false);
  });

  test("returns false if addresses are the same", () => {
    const result = tokenSortsBefore({
      token: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      },
      other: {
        chainId: ChainId.MAINNET,
        address: ADDRESS_ONE,
        currency: {
          decimals: 18,
          name: null,
          symbol: null
        }
      }
    });

    expect(result).toBe(false);
  });

});
