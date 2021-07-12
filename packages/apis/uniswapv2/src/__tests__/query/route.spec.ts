import { ChainId, Pair, Route, Token } from "../../query/w3";
import { createRoute, routeMidPrice } from "../../query";
import { BigFloat } from "as-bigfloat";
import { BigInt } from "as-bigint";

const token0: Token = {
  chainId: ChainId.MAINNET,
  address: '0x0000000000000000000000000000000000000001',
  currency: {
    decimals: 18,
    symbol: "t0",
    name: null,
  } };
const token1: Token = {
  chainId: ChainId.MAINNET,
  address: '0x0000000000000000000000000000000000000002',
  currency: {
    decimals: 18,
    symbol: "t1",
    name: null,
  } };
const weth:Token = {
  chainId: ChainId.MAINNET,
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  currency: {
    decimals: 18,
    symbol: "WETH9",
    name: "Wrapped Ether"
  }
};
const pair_0_1: Pair = { tokenAmount0: {token: token0, amount: BigInt.fromString("100")}, tokenAmount1: { token: token1, amount: BigInt.fromString("200") } };
const pair_0_weth: Pair = { tokenAmount0: {token: token0, amount: BigInt.fromString("100")}, tokenAmount1: { token: weth, amount: BigInt.fromString("100") } };
const pair_1_weth: Pair = { tokenAmount0: {token: token1, amount: BigInt.fromString("175")}, tokenAmount1: { token: weth, amount: BigInt.fromString("100") } };

describe('Route', () => {

  it('constructs a path from the tokens', () => {
    const route: Route = createRoute({
      pairs: [pair_0_1],
      input: token0,
      output: token1,
    });
    expect(route.pairs).toStrictEqual([pair_0_1]);
    expect(route.path).toStrictEqual([token0, token1]);
    expect(route.input).toStrictEqual(token0);
    expect(route.output).toStrictEqual(token1);
  });

  it('can have a token as both input and output', () => {
    const route: Route = createRoute({
      pairs: [pair_0_weth, pair_0_1, pair_1_weth],
      input: weth,
      output: weth,
    });
    expect(route.pairs).toStrictEqual([pair_0_weth, pair_0_1, pair_1_weth]);
    expect(route.path).toStrictEqual([weth, token0, token1, weth]);
    expect(route.input).toStrictEqual(weth);
    expect(route.output).toStrictEqual(weth);
  });

  it('returns route midPrice:0', () => {
    const route: Route = createRoute({
      pairs: [pair_0_weth, pair_0_1, pair_1_weth],
      input: weth,
      output: weth,
    });
    const midPrice: string = routeMidPrice({ route });
    expect(midPrice).toStrictEqual("1.142857142857142857");
  });

  it('returns route midPrice:1', () => {
    const route: Route = createRoute({
      pairs: [pair_1_weth, pair_0_1],
      input: weth,
      output: token0,
    });
    const midPrice: string = routeMidPrice({ route });
    const amount: string = BigFloat.fromString(midPrice).toString();
    expect(amount).toStrictEqual("0.875");
  });

  it('returns route midPrice:2', () => {
    const route: Route = createRoute({
      pairs: [pair_0_weth, pair_1_weth],
      input: token0,
      output: token1,
    });
    const midPrice: string = routeMidPrice({ route });
    const amount: string = BigFloat.fromString(midPrice).toString();
    expect(amount).toStrictEqual("1.75");
  });

});