import { ChainId, Pair, Token, TokenAmount } from "../../query/w3";
import {
  pairLiquidityMinted,
  pairLiquidityValue,
  pairReserves,
  pairToken0Price,
  pairToken1Price,
  tokenSortsBefore
} from "../../query";
import { Nullable } from "@web3api/wasm-as";
import { BigFloat } from "as-bigfloat";

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
const token2: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000003",
  currency: {
    decimals: 18,
    symbol: "t2",
    name: null,
  }
}
const token3: Token = {
  chainId: ChainId.MAINNET,
  address: "0x0000000000000000000000000000000000000004",
  currency: {
    decimals: 18,
    symbol: "t3",
    name: null,
  }
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

const pairs = [pair_0_1, pair_0_2, pair_0_3, pair_1_2, pair_1_3];

describe('Pair core', () => {

  test("pairReserves", () => {
    for (let i = 0; i < pairs.length; i++) {
      const pair: Pair = pairs[i];
      const reserves: TokenAmount[] = pairReserves({ pair });
      let tokenAmount0: TokenAmount;
      let tokenAmount1: TokenAmount;
      if (tokenSortsBefore({ token: pair.tokenAmount0.token, other: pair.tokenAmount1.token })) {
        tokenAmount0 = reserves[0];
        tokenAmount1 = reserves[1];
      } else {
        tokenAmount0 = reserves[1];
        tokenAmount1 = reserves[0];
      }
      expect(reserves[0].token).toStrictEqual(tokenAmount0.token);
      expect(reserves[0].amount).toStrictEqual(tokenAmount0.amount);
      expect(reserves[1].token).toStrictEqual(tokenAmount1.token);
      expect(reserves[1].amount).toStrictEqual(tokenAmount1.amount);
    }
  });

  test("pairToken0Price",() => {
    for (let i = 0; i < pairs.length; i++) {
      const pair: Pair = pairs[i];
      const price: TokenAmount = pairToken0Price({ pair });
      expect(price.token).toStrictEqual(pair.tokenAmount1.token);
      const expectedPrice: f64 = F64.parseFloat(pair.tokenAmount1.amount) / F64.parseFloat(pair.tokenAmount0.amount);
      const amount: string = BigFloat.fromString(price.amount).toString();
      expect(amount.substr(0, 17)).toStrictEqual(expectedPrice.toString().substr(0, 17));
    }
  });

  test("pairToken1Price", () => {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const price: TokenAmount = pairToken1Price({ pair });
      expect(price.token).toStrictEqual(pair.tokenAmount0.token);
      const expectedPrice: f64 = F64.parseFloat(pair.tokenAmount0.amount) / F64.parseFloat(pair.tokenAmount1.amount);
      const amount: string = BigFloat.fromString(price.amount).toString();
      expect(amount.substr(0, 17)).toStrictEqual(expectedPrice.toString().substr(0, 17));
    }
  });

});

describe('Pair miscellaneous', () => {

  test("pairLiquidityMinted 0 reserves", () => {
    const pair: Pair = { tokenAmount0: { token: token0, amount: "0" }, tokenAmount1: { token: token1, amount: "0" } };
    const totalSupply: TokenAmount = {
      token:
        {
          chainId: ChainId.MAINNET,
          address: "",
          currency: {
            decimals: 18,
            name: "",
            symbol: "",
          },
        },
      amount: "0"
    };
    const tokenAmount0: TokenAmount = { token: token0, amount: "1001" };
    const tokenAmount1: TokenAmount = { token: token1, amount: "1001" };

    const minted: TokenAmount = pairLiquidityMinted({ pair, totalSupply, tokenAmount0, tokenAmount1 });
    expect(minted.amount).toStrictEqual('1');
  });

  test("pairLiquidityMinted !0 reserves", () => {
    const pair: Pair = { tokenAmount0: { token: token0, amount: "10000" }, tokenAmount1: { token: token1, amount: "10000" } };
    const totalSupply: TokenAmount = {
      token: {
        chainId: ChainId.MAINNET,
        address: "",
        currency: {
          decimals: 18,
          name: "",
          symbol: "",
        },
      },
      amount: "10000" };
    const tokenAmount0: TokenAmount = { token: token0, amount: "2000" };
    const tokenAmount1: TokenAmount = { token: token1, amount: "2000" };

    const minted: TokenAmount = pairLiquidityMinted({ pair, totalSupply, tokenAmount0, tokenAmount1 });
    expect(minted.amount).toStrictEqual('2000');

  });

  it('getLiquidityValue:!feeOn', () => {
    const pair: Pair = { tokenAmount0: { token: token0, amount: "1000" }, tokenAmount1: { token: token1, amount: "1000" } };
    const totalSupply: TokenAmount = {
      token: {
        chainId: ChainId.MAINNET,
        address: "",
        currency: {
          decimals: 18,
          name: "",
          symbol: "",
        },
      },  amount: "1000" };
    const liquidity1000: TokenAmount = {
      token: {
        chainId: ChainId.MAINNET,
        address: "",
        currency: {
          decimals: 18,
          name: "",
          symbol: "",
        },
      },
      amount: "1000" };
    const liquidity500: TokenAmount = {
      token: {
        chainId: ChainId.MAINNET,
        address: "",
        currency: {
          decimals: 18,
          name: "",
          symbol: "",
        },
      },
      amount: "500" };

    const liquidityValueA = pairLiquidityValue({ pair: pair, totalSupply: totalSupply, liquidity: liquidity1000, feeOn: Nullable.fromNull<boolean>(), kLast: null });
    expect(liquidityValueA[0].token).toStrictEqual(token0);
    expect(liquidityValueA[1].token).toStrictEqual(token1);
    expect(liquidityValueA[0].amount).toStrictEqual("1000");
    expect(liquidityValueA[1].amount).toStrictEqual("1000");
    const liquidityValueB = pairLiquidityValue({ pair: pair, totalSupply: totalSupply, liquidity: liquidity500, feeOn: Nullable.fromValue(false), kLast: null });
    expect(liquidityValueB[0].token).toStrictEqual(token0);
    expect(liquidityValueB[0].amount).toStrictEqual("500");
  })

  it('getLiquidityValue:feeOn', () => {
    const pair: Pair = { tokenAmount0: { token: token0, amount: "1000" }, tokenAmount1: { token: token1, amount: "1000" } };
    const totalSupply: TokenAmount = {
      token: {
        chainId: ChainId.MAINNET,
        address: "",
        currency: {
          decimals: 18,
          name: "",
          symbol: "",
        },
      },
      amount: "500" };
    const liquidity: TokenAmount = {
      token: {
        chainId: ChainId.MAINNET,
        address: "",
        currency: {
          decimals: 18,
          name: "",
          symbol: "",
        },
      },
      amount: "500" };
    const kLast: string = "250000";

    const liquidityValue = pairLiquidityValue({ pair: pair, totalSupply: totalSupply, liquidity: liquidity, feeOn: Nullable.fromValue(true), kLast: kLast });
    expect(liquidityValue[0].token).toStrictEqual(token0);
    expect(liquidityValue[0].amount).toStrictEqual("917"); // ceiling(1000 - (500 * (1 / 6)))
  })

});