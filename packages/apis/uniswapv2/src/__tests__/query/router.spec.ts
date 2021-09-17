import { Nullable } from "@web3api/wasm-as";

import { createRoute, createTrade, swapCallParameters, toHex } from "../../query";
import { ChainId, Pair, Token, TradeType, } from "../../query/w3";
import { ETHER } from "../../utils/Currency";
import { getWETH9 } from "../../utils/utils";
import { BigInt } from "as-bigint";

const token0: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000001",
  currency: {
    decimals: 18,
    symbol: "t0",
    name: null,
  }
}
const token1: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000002",
  currency: {
    decimals: 18,
    symbol: "t1",
    name: null,
  }
}

const pair_0_1: Pair = {
  tokenAmount0: {
    amount: BigInt.fromString("1000"),
    token: token0
  },
  tokenAmount1: {
    amount: BigInt.fromString("1000"),
    token: token1
  }
}
const pair_weth_0: Pair = {
  tokenAmount0: {
    amount: BigInt.fromString("1000"),
    token: getWETH9(ChainId.MAINNET)
  },
  tokenAmount1: {
    amount: BigInt.fromString("1000"),
    token: token0,
  }
}

describe("toHex", () => {
  test("returns valid hex string from number", () => {
    const result = toHex(BigInt.fromUInt32(999));

    expect(result).toStrictEqual("0x3e7");
  });
});

describe("swapCallParameters", () => {
  describe("exact in", () => {
    test("ether to token1", () => {
      const exactIn = createTrade({
        route: createRoute({
          pairs: [pair_weth_0, pair_0_1],
          input: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET
          },
          output: token1,
        }),
        amount: {
          token: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET,
          },
          amount: BigInt.fromString("100")
        },
        tradeType: TradeType.EXACT_INPUT
      })
      const result = swapCallParameters({
        trade: exactIn,
        tradeOptions: {
          ttl: Nullable.fromValue<u32>(50),
          recipient: "0x0000000000000000000000000000000000000004",
          unixTimestamp: <u32>Date.now() / 1000,
          allowedSlippage: "0.01",
          deadline: Nullable.fromNull<u32>(),
          feeOnTransfer: Nullable.fromNull<boolean>()
        }
      })

      expect(result.methodName).toStrictEqual("swapExactETHForTokens");
      expect(result.args.slice(0, -1)).toStrictEqual([
        "0x51",
        '["' + [getWETH9(ChainId.MAINNET).address, token0.address, token1.address].join('","') + '"]',
        "0x0000000000000000000000000000000000000004"
      ]);
      expect(result.value).toStrictEqual("0x64");
      const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
      expect(deadlineDifference < 5).toBe(true);
    });

    test("deadline specified", () => {
      const exactIn = createTrade({
        route: createRoute({
          pairs: [pair_weth_0, pair_0_1],
          input: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET
          },
          output: token1,
        }),
        amount: {
          token: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET,
          },
          amount: BigInt.fromString("100")
        },
        tradeType: TradeType.EXACT_INPUT
      })
      const result = swapCallParameters({
        trade: exactIn,
        tradeOptions: {
          ttl: Nullable.fromNull<u32>(),
          recipient: "0x0000000000000000000000000000000000000004",
          unixTimestamp: <u32>Date.now() / 1000,
          allowedSlippage: "0.01",
          deadline: Nullable.fromValue<u32>(50),
          feeOnTransfer: Nullable.fromNull<boolean>()
        }
      })

      expect(result.methodName).toStrictEqual("swapExactETHForTokens");
      expect(result.args).toStrictEqual([
        "0x51",
        '["' + ([getWETH9(ChainId.MAINNET).address, token0.address, token1.address]).join('","') + '"]',
        "0x0000000000000000000000000000000000000004",
        "0x32"
      ]);
    });

    test("token1 to ether", () => {
      const exactIn = createTrade({
        route: createRoute({
          pairs: [pair_0_1, pair_weth_0],
          input: token1,
          output: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET
          },
        }),
        amount: {
          token: token1,
          amount: BigInt.fromString("100")
        },
        tradeType: TradeType.EXACT_INPUT
      });
      const result = swapCallParameters({
        trade: exactIn,
        tradeOptions: {
          ttl: Nullable.fromValue<u32>(50),
          recipient: "0x0000000000000000000000000000000000000004",
          unixTimestamp: <u32>Date.now() / 1000,
          allowedSlippage: "0.01",
          deadline: Nullable.fromNull<u32>(),
          feeOnTransfer: Nullable.fromNull<boolean>()
        }
      })

      expect(result.methodName).toStrictEqual("swapExactTokensForETH");
      expect(result.args.slice(0, -1)).toStrictEqual([
        "0x64",
        "0x51",
        '["' + [token1.address, token0.address, getWETH9(ChainId.MAINNET).address].join('","') + '"]',
        "0x0000000000000000000000000000000000000004"
      ]);
      expect(result.value).toStrictEqual("0x0");
      const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
      expect(deadlineDifference < 5).toBe(true);
    });

    test("token0 to token1", () => {
      const exactIn = createTrade({
        route: createRoute({
          pairs: [pair_0_1],
          input: token0,
          output: token1
        }),
        amount: {
          token: token0,
          amount: BigInt.fromString("100")
        },
        tradeType: TradeType.EXACT_INPUT
      });
      const result = swapCallParameters({
        trade: exactIn,
        tradeOptions: {
          ttl: Nullable.fromValue<u32>(50),
          recipient: "0x0000000000000000000000000000000000000004",
          unixTimestamp: <u32>Date.now() / 1000,
          allowedSlippage: "0.01",
          deadline: Nullable.fromNull<u32>(),
          feeOnTransfer: Nullable.fromNull<boolean>()
        }
      })

      expect(result.methodName).toStrictEqual("swapExactTokensForTokens");
      expect(result.args.slice(0, -1)).toStrictEqual([
        "0x64",
        "0x59",
        '["' + [token0.address, token1.address].join('","') + '"]',
        "0x0000000000000000000000000000000000000004"
      ]);
      expect(result.value).toStrictEqual("0x0");
      const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
      expect(deadlineDifference < 5).toBe(true);
    });
  });

  describe("exact out", () => {
    test("ether to token1", () => {
      const exactOut = createTrade({
        route: createRoute({
          pairs: [pair_weth_0, pair_0_1],
          input: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET
          },
          output: token1,
        }),
        amount: {
          token: token1,
          amount: BigInt.fromString("100")
        },
        tradeType: TradeType.EXACT_OUTPUT
      })
      const result = swapCallParameters({
        trade: exactOut,
        tradeOptions: {
          ttl: Nullable.fromValue<u32>(50),
          recipient: "0x0000000000000000000000000000000000000004",
          unixTimestamp: <u32>Date.now() / 1000,
          allowedSlippage: "0.01",
          deadline: Nullable.fromNull<u32>(),
          feeOnTransfer: Nullable.fromNull<boolean>()
        }
      })

      expect(result.methodName).toStrictEqual("swapETHForExactTokens");
      expect(result.args.slice(0, -1)).toStrictEqual([
        "0x64",
        '["' + [getWETH9(ChainId.MAINNET).address, token0.address, token1.address].join('","') + '"]',
        "0x0000000000000000000000000000000000000004"
      ]);
      expect(result.value).toStrictEqual("0x80");
      const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
      expect(deadlineDifference < 5).toBe(true);
    });

    test("token1 to ether", () => {
      const exactOut = createTrade({
        route: createRoute({
          pairs: [pair_0_1, pair_weth_0],
          input: token1,
          output: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET
          },
        }),
        amount: {
          token: {
            currency: ETHER,
            address: "",
            chainId: ChainId.MAINNET
          },
          amount: BigInt.fromString("100")
        },
        tradeType: TradeType.EXACT_OUTPUT
      });
      const result = swapCallParameters({
        trade: exactOut,
        tradeOptions: {
          ttl: Nullable.fromValue<u32>(50),
          recipient: "0x0000000000000000000000000000000000000004",
          unixTimestamp: <u32>Date.now() / 1000,
          allowedSlippage: "0.01",
          deadline: Nullable.fromNull<u32>(),
          feeOnTransfer: Nullable.fromNull<boolean>()
        }
      })

      expect(result.methodName).toStrictEqual("swapTokensForExactETH");
      expect(result.args.slice(0, -1)).toStrictEqual([
        "0x64",
        "0x80",
        '["' + [token1.address, token0.address, getWETH9(ChainId.MAINNET).address].join('","') + '"]',
        "0x0000000000000000000000000000000000000004"
      ]);
      expect(result.value).toStrictEqual("0x0");
      const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
      expect(deadlineDifference < 5).toBe(true);
    });

    test("token0 to token1", () => {
      const exactOut = createTrade({
        route: createRoute({
          pairs: [pair_0_1],
          input: token0,
          output: token1
        }),
        amount: {
          token: token1,
          amount: BigInt.fromString("100")
        },
        tradeType: TradeType.EXACT_OUTPUT
      });
      const result = swapCallParameters({
        trade: exactOut,
        tradeOptions: {
          ttl: Nullable.fromValue<u32>(50),
          recipient: "0x0000000000000000000000000000000000000004",
          unixTimestamp: <u32>Date.now() / 1000,
          allowedSlippage: "0.01",
          deadline: Nullable.fromNull<u32>(),
          feeOnTransfer: Nullable.fromNull<boolean>()
        }
      })

      expect(result.methodName).toStrictEqual("swapTokensForExactTokens");
      expect(result.args.slice(0, -1)).toStrictEqual([
        "0x64",
        "0x71",
        '["' + [token0.address, token1.address].join('","') + '"]',
        "0x0000000000000000000000000000000000000004"
      ]);
      expect(result.value).toStrictEqual("0x0");
      const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
      expect(deadlineDifference < 5).toBe(true);
    });
  });

  describe("supporting fee on transfer", () => {
    describe("exact in", () => {
      test("ether to token1", () => {
        const exactIn = createTrade({
          route: createRoute({
            pairs: [pair_weth_0, pair_0_1],
            input: {
              currency: ETHER,
              address: "",
              chainId: ChainId.MAINNET
            },
            output: token1,
          }),
          amount: {
            token: {
              currency: ETHER,
              address: "",
              chainId: ChainId.MAINNET,
            },
            amount: BigInt.fromString("100")
          },
          tradeType: TradeType.EXACT_INPUT
        })
        const result = swapCallParameters({
          trade: exactIn,
          tradeOptions: {
            ttl: Nullable.fromValue<u32>(50),
            recipient: "0x0000000000000000000000000000000000000004",
            unixTimestamp: <u32>Date.now() / 1000,
            allowedSlippage: "0.01",
            deadline: Nullable.fromNull<u32>(),
            feeOnTransfer: Nullable.fromValue<boolean>(true)
          }
        })

        expect(result.methodName).toStrictEqual("swapExactETHForTokensSupportingFeeOnTransferTokens");
        expect(result.args.slice(0, -1)).toStrictEqual([
          "0x51",
          '["' + [getWETH9(ChainId.MAINNET).address, token0.address, token1.address].join('","') + '"]',
          "0x0000000000000000000000000000000000000004"
        ]);
        expect(result.value).toStrictEqual("0x64");
        const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
        expect(deadlineDifference < 5).toBe(true);
      });

      test("token1 to ether", () => {
        const exactIn = createTrade({
          route: createRoute({
            pairs: [pair_0_1, pair_weth_0],
            input: token1,
            output: {
              currency: ETHER,
              address: "",
              chainId: ChainId.MAINNET
            },
          }),
          amount: {
            token: token1,
            amount: BigInt.fromString("100")
          },
          tradeType: TradeType.EXACT_INPUT
        });
        const result = swapCallParameters({
          trade: exactIn,
          tradeOptions: {
            ttl: Nullable.fromValue<u32>(50),
            recipient: "0x0000000000000000000000000000000000000004",
            unixTimestamp: <u32>Date.now() / 1000,
            allowedSlippage: "0.01",
            deadline: Nullable.fromNull<u32>(),
            feeOnTransfer: Nullable.fromValue<boolean>(true)
          }
        })

        expect(result.methodName).toStrictEqual("swapExactTokensForETHSupportingFeeOnTransferTokens");
        expect(result.args.slice(0, -1)).toStrictEqual([
          "0x64",
          "0x51",
          '["' + [token1.address, token0.address, getWETH9(ChainId.MAINNET).address].join('","') + '"]',
          "0x0000000000000000000000000000000000000004"
        ]);
        expect(result.value).toStrictEqual("0x0");
        const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
        expect(deadlineDifference < 5).toBe(true);
      });

      test("token0 to token1", () => {
        const exactIn = createTrade({
          route: createRoute({
            pairs: [pair_0_1],
            input: token0,
            output: token1
          }),
          amount: {
            token: token0,
            amount: BigInt.fromString("100")
          },
          tradeType: TradeType.EXACT_INPUT
        });
        const result = swapCallParameters({
          trade: exactIn,
          tradeOptions: {
            ttl: Nullable.fromValue<u32>(50),
            recipient: "0x0000000000000000000000000000000000000004",
            unixTimestamp: <u32>Date.now() / 1000,
            allowedSlippage: "0.01",
            deadline: Nullable.fromNull<u32>(),
            feeOnTransfer: Nullable.fromValue<boolean>(true)
          }
        })

        expect(result.methodName).toStrictEqual("swapExactTokensForTokensSupportingFeeOnTransferTokens");
        expect(result.args.slice(0, -1)).toStrictEqual([
          "0x64",
          "0x59",
          '["' + [token0.address, token1.address].join('","') + '"]',
          "0x0000000000000000000000000000000000000004"
        ]);
        expect(result.value).toStrictEqual("0x0");
        const deadlineDifference = (<u32>Date.now() / 1000) as number - parseInt(result.args[result.args.length - 1]) as number;
        expect(deadlineDifference < 5).toBe(true);
      });
    });

    describe("exact out", () => {
      test("ether to token1", () => {
        expect(() => {
          const exactOut = createTrade({
            route: createRoute({
              pairs: [pair_weth_0, pair_0_1],
              input: {
                currency: ETHER,
                address: "",
                chainId: ChainId.MAINNET
              },
              output: token1,
            }),
            amount: {
              token: token1,
              amount: BigInt.fromString("100")
            },
            tradeType: TradeType.EXACT_OUTPUT
          });
          swapCallParameters({
            trade: exactOut,
            tradeOptions: {
              ttl: Nullable.fromValue<u32>(50),
              recipient: "0x0000000000000000000000000000000000000004",
              unixTimestamp: <u32>Date.now() / 1000,
              allowedSlippage: "0.01",
              deadline: Nullable.fromNull<u32>(),
              feeOnTransfer: Nullable.fromValue<boolean>(true)
            }
          });
        });
      });

      test("token1 to ether", () => {
        expect(() => {
          const exactOut = createTrade({
            route: createRoute({
              pairs: [pair_0_1, pair_weth_0],
              input: token1,
              output: {
                currency: ETHER,
                address: "",
                chainId: ChainId.MAINNET
              },
            }),
            amount: {
              token: {
                currency: ETHER,
                address: "",
                chainId: ChainId.MAINNET
              },
              amount: BigInt.fromString("100")
            },
            tradeType: TradeType.EXACT_OUTPUT
          });
          swapCallParameters({
            trade: exactOut,
            tradeOptions: {
              ttl: Nullable.fromValue<u32>(50),
              recipient: "0x0000000000000000000000000000000000000004",
              unixTimestamp: <u32>Date.now() / 1000,
              allowedSlippage: "0.01",
              deadline: Nullable.fromNull<u32>(),
              feeOnTransfer: Nullable.fromValue<boolean>(true)
            }
          });
        }).toThrow();
      });

      test("token0 to token1", () => {
        expect(() => {
          const exactOut = createTrade({
            route: createRoute({
              pairs: [pair_0_1],
              input: token0,
              output: token1
            }),
            amount: {
              token: token1,
              amount: BigInt.fromString("100")
            },
            tradeType: TradeType.EXACT_OUTPUT
          });
          swapCallParameters({
            trade: exactOut,
            tradeOptions: {
              ttl: Nullable.fromValue<u32>(50),
              recipient: "0x0000000000000000000000000000000000000004",
              unixTimestamp: <u32>Date.now() / 1000,
              allowedSlippage: "0.01",
              deadline: Nullable.fromNull<u32>(),
              feeOnTransfer: Nullable.fromValue<boolean>(true)
            }
          });
        });
      });
    });
  });
});
