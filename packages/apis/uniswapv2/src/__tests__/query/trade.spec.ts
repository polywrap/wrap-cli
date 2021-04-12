import { Nullable } from "@web3api/wasm-as";
import { routePath, tokenEquals } from "../../query";
import { bestTradeExactIn, bestTradeExactOut, tradeMaximumAmountIn, tradeMinimumAmountOut } from "../../query/trade"
import { ChainId, Pair, Token, Trade, TradeType } from "../../query/w3";

const token0: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000001",
  decimals: 18,
  symbol: "t0",
  name: null,
}
const token1: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000002",
  decimals: 18,
  symbol: "t1",
  name: null,
}
const token2: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000003",
  decimals: 18,
  symbol: "t2",
  name: null,
}
const token3: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000004",
  decimals: 18,
  symbol: "t3",
  name: null,
}

const pair_0_1: Pair = {
  tokenAmount0: {
    amount: "1000",
    token: token0
  },
  tokenAmount1: {
    amount: "1000",
    token: token1
  }
}
const pair_0_2: Pair = {
  tokenAmount0: {
    amount: "1000",
    token: token0
  },
  tokenAmount1: {
    amount: "1100",
    token: token2
  }
}
const pair_0_3: Pair = {
  tokenAmount0: {
    amount: "1000",
    token: token0
  },
  tokenAmount1: {
    amount: "900",
    token: token3
  }
}
const pair_1_2: Pair = {
  tokenAmount0: {
    amount: "1200",
    token: token1
  },
  tokenAmount1: {
    amount: "1000",
    token: token2
  }
}
const pair_1_3: Pair = {
  tokenAmount0: {
    amount: "1200",
    token: token1
  },
  tokenAmount1: {
    amount: "1300",
    token: token3
  }
}

const empty_pair_0_1: Pair = {
  tokenAmount0: {
    amount: "0",
    token: token0
  },
  tokenAmount1: {
    amount: "0",
    token: token1
  }
}

const exactIn: Trade = {
  route: {
    pairs: [pair_0_1, pair_1_2],
    input: token0
  },
  amount: {
    token: token0,
    amount: "100"
  },
  tradeType: TradeType.EXACT_INPUT
}
const exactOut: Trade = {
  route: {
    pairs: [pair_0_1, pair_1_2],
    input: token0
  },
  amount: {
    token: token2,
    amount: "100"
  },
  tradeType: TradeType.EXACT_OUTPUT
}

describe("Trade", () => {

  describe("bestTradeExactIn", () => {
    test("throws with empty pairs", () => {
      expect(() => {
        bestTradeExactIn({
          pairs: [],
          amountIn: {
            token: token0,
            amount: "100"
          },
          tokenOut: token2,
          options: null,
        })
      }).toThrow();
    })

    test("throws with max hops of 0", () => {
      expect(() => {
        bestTradeExactIn({
          pairs: [pair_0_2],
          amountIn: {
            token: token0,
            amount: "100"
          },
          tokenOut: token2,
          options: {
            maxHops: Nullable.fromValue<u32>(0),
            maxNumResults: Nullable.fromNull<u32>(),
          },
        })
      }).toThrow();
    })

    test("provides best route", () => {
      const result = bestTradeExactIn({
        pairs: [
          pair_0_1, pair_0_2, pair_1_2
        ],
        amountIn: {
          token: token0,
          amount: "100"
        },
        tokenOut: token2,
        options: null,
      });

      const route0 = routePath({
        route: result[0].route
      });
      const route1 = routePath({
        route: result[1].route
      });

      expect(result.length).toStrictEqual(2);
      expect(result[0].route.pairs.length).toStrictEqual(1)
      expect(route0).toStrictEqual([token0, token2]);
      expect(result[0].amount).toStrictEqual({
        token: token0,
        amount: "100"
      })
      expect(result[1].route.pairs.length).toStrictEqual(2);
      expect(route1).toStrictEqual([token0, token1, token2]);
      expect(result[1].amount).toStrictEqual({
        token: token0,
        amount: "100"
      })
    });

    test("doesn't throw for zero liquidity pairs", () => {
      const result =  bestTradeExactIn({
        pairs: [empty_pair_0_1],
        amountIn: {
          token: token0,
          amount: "100"
        },
        tokenOut: token1,
        options: null
      });
      expect(result.length).toStrictEqual(0);
    });

    test("respects maxHops", () => {
      const result =  bestTradeExactIn({
        pairs: [pair_0_1, pair_0_2, pair_1_2],
        amountIn: {
          token: token0,
          amount: "10"
        },
        tokenOut: token2,
        options: {
          maxHops: Nullable.fromValue<u32>(1),
          maxNumResults: Nullable.fromNull<u32>(),
        }
      });

      expect(result.length).toStrictEqual(1);
      expect(result[0].route.pairs.length).toStrictEqual(1);
      expect(routePath({ route: result[0].route })).toStrictEqual([token0, token2]);
    });

    test("insufficient input for one pair", () => {
      const result =  bestTradeExactIn({
        pairs: [pair_0_1, pair_0_2, pair_1_2],
        amountIn: {
          token: token0,
          amount: "1"
        },
        tokenOut: token2,
        options: {
          maxHops: Nullable.fromValue<u32>(1),
          maxNumResults: Nullable.fromNull<u32>(),
        }
      });

      expect(result.length).toStrictEqual(1);
      expect(result[0].route.pairs.length).toStrictEqual(1);
      expect(routePath({ route: result[0].route })).toStrictEqual([token0, token2]);
      // TODO Missing output amount
      /*
      expect(result[0].amount).toStrictEqual({
        token: token2,
        amount: "1"
      })
      */
    });

    test("respects n", () => {
      const result =  bestTradeExactIn({
        pairs: [pair_0_1, pair_0_2, pair_1_2],
        amountIn: {
          token: token0,
          amount: "10"
        },
        tokenOut: token2,
        options: {
          maxHops: Nullable.fromNull<u32>(),
          maxNumResults: Nullable.fromValue<u32>(1),
        }
      });

      // TODO: respect maxNumResults param
      expect(result.length).toStrictEqual(1);
    });

    test("no path", () => {
      const result =  bestTradeExactIn({
        pairs: [pair_0_1, pair_0_3, pair_1_3],
        amountIn: {
          token: token0,
          amount: "10"
        },
        tokenOut: token2,
        options: null
      });

      expect(result.length).toStrictEqual(0);
    });

    // TODO: WETH implementation and tests
  });

  describe("bestTradeExactOut", () => {
    test("throws with empty pairs", () => {
      expect(() => {
        bestTradeExactOut({
          pairs: [],
          amountOut: {
            token: token2,
            amount: "100"
          },
          tokenIn: token0,
          options: null,
        })
      }).toThrow();
    })

    test("throws with max hops of 0", () => {
      expect(() => {
        bestTradeExactOut({
          pairs: [pair_0_2],
          amountOut: {
            token: token2,
            amount: "100"
          },
          tokenIn: token0,
          options: {
            maxHops: Nullable.fromValue<u32>(0),
            maxNumResults: Nullable.fromNull<u32>(),
          },
        })
      }).toThrow();
    })

    test("provides best route", () => {
      const result = bestTradeExactOut({
        pairs: [
          pair_0_1, pair_0_2, pair_1_2
        ],
        amountOut: {
          token: token2,
          amount: "100"
        },
        tokenIn: token0,
        options: null,
      });

      const route0 = routePath({
        route: result[0].route
      });
      const route1 = routePath({
        route: result[1].route
      });

      expect(result.length).toStrictEqual(2);
      expect(result[0].route.pairs.length).toStrictEqual(1)
      expect(route0).toStrictEqual([token0, token2]);
      expect(result[0].amount).toStrictEqual({
        token: token0,
        amount: "100"
      })
      // TODO: output amount
      expect(result[1].route.pairs.length).toStrictEqual(2);
      expect(route1).toStrictEqual([token0, token1, token2]);
      expect(result[1].amount).toStrictEqual({
        token: token0,
        amount: "100"
      })
      // TODO: output amount
    });

    test("doesn't throw for zero liquidity pairs", () => {
      const result =  bestTradeExactOut({
        pairs: [empty_pair_0_1],
        amountOut: {
          token: token1,
          amount: "100"
        },
        tokenIn: token1,
        options: null
      });
      expect(result.length).toStrictEqual(0);
    });

    test("respects maxHops", () => {
      const result =  bestTradeExactOut({
        pairs: [pair_0_1, pair_0_2, pair_1_2],
        amountOut: {
          token: token2,
          amount: "10"
        },
        tokenIn: token0,
        options: {
          maxHops: Nullable.fromValue<u32>(1),
          maxNumResults: Nullable.fromNull<u32>(),
        }
      });

      expect(result.length).toStrictEqual(1);
      expect(result[0].route.pairs.length).toStrictEqual(1);
      expect(routePath({ route: result[0].route })).toStrictEqual([token0, token2]);
    });

    test("insufficient liquidity", () => {
      const result =  bestTradeExactOut({
        pairs: [pair_0_1, pair_0_2, pair_1_2],
        amountOut: {
          token: token2,
          amount: "1200"
        },
        tokenIn: token0,
        options: null
      });

      expect(result.length).toStrictEqual(0);
    });

    test("insufficient liquidity in one pair but not the other", () => {
      const result =  bestTradeExactOut({
        pairs: [pair_0_1, pair_0_2, pair_1_2],
        amountOut: {
          token: token2,
          amount: "1050"
        },
        tokenIn: token0,
        options: null
      });

      expect(result.length).toStrictEqual(1);
    });

    test("respects n", () => {
      const result =  bestTradeExactOut({
        pairs: [pair_0_1, pair_0_2, pair_1_2],
        amountOut: {
          token: token2,
          amount: "10"
        },
        tokenIn: token0,
        options: {
          maxHops: Nullable.fromNull<u32>(),
          maxNumResults: Nullable.fromValue<u32>(1),
        }
      });

      // TODO: respect maxNumResults param
      expect(result.length).toStrictEqual(1);
    });

    test("no path", () => {
      const result =  bestTradeExactOut({
        pairs: [pair_0_1, pair_0_3, pair_1_3],
        amountOut: {
          token: token2,
          amount: "10"
        },
        tokenIn: token0,
        options: null
      });

      expect(result.length).toStrictEqual(0);
    });

    // TODO: WETH implementation and tests
  });

  describe("tradeMinimumAmountOut", () => {

    describe("tradeType = EXACT_INPUT", () => {
      test("throws if less than 0", () => {
        expect(() => {
          tradeMinimumAmountOut({
          trade: exactIn,
          slippageTolerance: "-1"
        })}).toThrow()
      })

      test("returns  exact if nonzero", () => {
        expect(tradeMinimumAmountOut({
          trade: exactIn,
          slippageTolerance: "2"
        })).toStrictEqual({
          token: token2,
          amount: "23"
        })

        expect(tradeMinimumAmountOut({
          trade: exactIn,
          slippageTolerance: "0.05"
        })).toStrictEqual({
          token: token2,
          amount: "65"
        })

        expect(tradeMinimumAmountOut({
          trade: exactIn,
          slippageTolerance: "0"
        })).toStrictEqual({
          token: token2,
          amount: "69"
        })
      })
    });

    describe("tradeType = EXACT_OUTPUT", () => {
      test("throws if less than 0", () => {
        expect(() => {
          tradeMinimumAmountOut({
          trade: exactOut,
          slippageTolerance: "-1"
        })}).toThrow()
      })

      test("returns exact if nonzero", () => {
        expect(tradeMinimumAmountOut({
          trade: exactOut,
          slippageTolerance: "2"
        })).toStrictEqual({
          token: token2,
          amount: "100"
        })

        expect(tradeMinimumAmountOut({
          trade: exactOut,
          slippageTolerance: "0.05"
        })).toStrictEqual({
          token: token2,
          amount: "100"
        })

        expect(tradeMinimumAmountOut({
          trade: exactOut,
          slippageTolerance: "0"
        })).toStrictEqual({
          token: token2,
          amount: "100"
        })
      })
    });
  });

  describe("tradeMaximumAmountIn", () => {

    describe("tradeType = EXACT_INPUT", () => {
      test("throws if less than 0", () => {
        expect(() => {
          tradeMaximumAmountIn({
          trade: exactIn,
          slippageTolerance: "-1"
        })}).toThrow()
      })

      test("returns  exact if nonzero", () => {
        expect(tradeMaximumAmountIn({
          trade: exactIn,
          slippageTolerance: "2"
        })).toStrictEqual({
          token: token0,
          amount: "100"
        })

        expect(tradeMaximumAmountIn({
          trade: exactIn,
          slippageTolerance: "0.05"
        })).toStrictEqual({
          token: token0,
          amount: "100"
        })

        expect(tradeMaximumAmountIn({
          trade: exactIn,
          slippageTolerance: "0"
        })).toStrictEqual({
          token: token0,
          amount: "100"
        })
      })
    });

    describe("tradeType = EXACT_OUTPUT", () => {
      test("throws if less than 0", () => {
        expect(() => {
          tradeMaximumAmountIn({
          trade: exactOut,
          slippageTolerance: "-1"
        })}).toThrow()
      })

      test("returns  exact if nonzero", () => {
        expect(tradeMaximumAmountIn({
          trade: exactOut,
          slippageTolerance: "2"
        })).toStrictEqual({
          token: token0,
          amount: "468"
        })

        expect(tradeMaximumAmountIn({
          trade: exactOut,
          slippageTolerance: "0.05"
        })).toStrictEqual({
          token: token0,
          amount: "163"
        })

        expect(tradeMaximumAmountIn({
          trade: exactOut,
          slippageTolerance: "0"
        })).toStrictEqual({
          token: token0,
          amount: "156"
        })
      })
    });
  });
})
