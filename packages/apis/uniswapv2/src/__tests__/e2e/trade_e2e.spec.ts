import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import * as path from "path";
import { ChainId, Pair, Route, Token, TokenAmount, Trade } from "./types";
import { getPairData, getPlugins, getTokenList, getUniPairs } from "../testUtils";
import * as uni from "@uniswap/sdk";

jest.setTimeout(120000);

describe('trade e2e', () => {

  let client: Web3ApiClient;
  let ensUri: string;
  let tokens: Token[] = [];
  let pairs: Pair[] = [];
  let uniPairs: uni.Pair[];
  let ethToken: Token;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const config: ClientConfig = getPlugins(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient(config);
    // deploy api
    const apiPath: string = path.resolve(__dirname + "/../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    // pick some test case tokens
    const allTokens: Token[] = await getTokenList();
    const aave: Token = allTokens.filter(token => token.currency.symbol === "AAVE")[0];
    const dai: Token = allTokens.filter(token => token.currency.symbol === "DAI")[0];
    const usdc: Token = allTokens.filter(token => token.currency.symbol === "USDC")[0];
    const comp: Token = allTokens.filter(token => token.currency.symbol === "COMP")[0];
    const weth: Token = allTokens.filter(token => token.currency.symbol === "WETH")[0];
    const wbtc: Token = allTokens.filter(token => token.currency.symbol === "WBTC")[0];
    const uniswap: Token = allTokens.filter(token => token.currency.symbol === "UNI")[0];
    const link: Token = allTokens.filter(token => token.currency.symbol === "LINK")[0];
    ethToken = {
      chainId: ChainId.MAINNET,
      address: "",
      currency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
    }
    tokens = [aave, dai, usdc, comp, weth, wbtc, uniswap, link];
    // create test case pairs
    const aave_dai: Pair | undefined = await getPairData(aave, dai, client, ensUri);
    const usdc_dai: Pair | undefined = await getPairData(usdc, dai, client, ensUri);
    const link_usdc: Pair | undefined = await getPairData(link, usdc, client, ensUri);
    const comp_weth: Pair | undefined = await getPairData(comp, weth, client, ensUri);
    const uni_link: Pair | undefined = await getPairData(uniswap, link, client, ensUri);
    const uni_wbtc: Pair | undefined = await getPairData(uniswap, wbtc, client, ensUri);
    const wbtc_weth: Pair | undefined = await getPairData(wbtc, weth, client, ensUri);
    [aave_dai, usdc_dai, link_usdc, uni_link, uni_wbtc, wbtc_weth, comp_weth].forEach(pair => {
      if (pair) {
        pairs.push(pair)
      }
    });

    uniPairs = getUniPairs(pairs, 1);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  })

  it('creates a trade', async () => {
    const routePairs: Pair[] = [pairs[1], pairs[2], pairs[3]];
    const uniRoutePairs: uni.Pair[] = [uniPairs[1], uniPairs[2], uniPairs[3]];
    const tokenIn: Token = tokens[1];
    const tokenOut: Token = tokens[6];
    const amountIn: TokenAmount = { token: tokenIn, amount: "1000000000000000000" };
    const route = await client.query<{
      createRoute: Route;
    }>({
      uri: ensUri,
      query: `
        query {
          createRoute(
            pairs: $pairs
            input: $input
            output: $output
          )
        }
      `,
      variables: {
        pairs: routePairs,
        input: tokenIn,
        output: tokenOut,
      }
    });
    const actualTrade = await client.query<{
      createTrade: Trade;
    }>({
      uri: ensUri,
      query: `
        query {
          createTrade(
            route: $route
            amount: $inAmount
            tradeType: $tradeType
          )
        }
      `,
      variables: {
        route: route.data?.createRoute,
        inAmount: amountIn,
        tradeType: "EXACT_INPUT",
      }
    });
    // expected trade
    const uniAmountIn: uni.TokenAmount = new uni.TokenAmount(new uni.Token(
      1,
      amountIn.token.address,
      amountIn.token.currency.decimals,
      amountIn.token.currency.symbol || "",
      amountIn.token.currency.name || ""
    ), amountIn.amount);
    const uniTokenOut: uni.Token = new uni.Token(
      1,
      tokenOut.address,
      tokenOut.currency.decimals,
      tokenOut.currency.symbol || "",
      tokenOut.currency.name || ""
    );
    const expectedRoute: uni.Route = new uni.Route(uniRoutePairs, uniAmountIn.currency, uniTokenOut)
    const expectedTrade: uni.Trade = new uni.Trade(expectedRoute, uniAmountIn, 0);
    // compare paths
    const actualPath: string[] = actualTrade.data?.createTrade.route.path.map(token => token.currency.symbol || "")!;
    const expectedPath: string[] = expectedTrade.route.path.map(token => token.symbol ?? "");
    expect(actualPath).toStrictEqual(expectedPath);
    // compare output amounts
    expect(actualTrade.data?.createTrade.outputAmount.amount).toStrictEqual(expectedTrade.outputAmount.numerator.toString());
  });

  it('finds the best trade for exact input (default options)', async () => {
    for (let i = 0; i < tokens.length; i++) {
      for (let j = 0; j < tokens.length; j++) {
        if (tokens[i] === tokens[j]) {
          continue;
        }
        // get best trades
        const amountIn: TokenAmount = {
          token: tokens[i],
          amount: "1000000000000000000"
        }
        const tokenOut = tokens[j];
        const query = await client.query<{
          bestTradeExactIn: Trade[];
        }>({
          uri: ensUri,
          query: `
            query {
              bestTradeExactIn(
                pairs: $pairs
                amountIn: $input
                tokenOut: $output
                options: null
              )
            }
          `,
          variables: {
            pairs: pairs,
            input: amountIn,
            output: tokenOut,
          }
        });
        const actualTrades: Trade[] = query.data?.bestTradeExactIn ?? [];
        // expected best trades
        const uniAmountIn: uni.TokenAmount = new uni.TokenAmount(new uni.Token(
          1,
          amountIn.token.address,
          amountIn.token.currency.decimals,
          amountIn.token.currency.symbol || "",
          amountIn.token.currency.name || ""
        ), amountIn.amount);
        const uniTokenOut: uni.Token = new uni.Token(
          1,
          tokenOut.address,
          tokenOut.currency.decimals,
          tokenOut.currency.symbol || "",
          tokenOut.currency.name || ""
        );
        const expectedTrades = uni.Trade.bestTradeExactIn(uniPairs, uniAmountIn, uniTokenOut);
        // compare trade array lengths and trade type
        if (actualTrades.length !== expectedTrades.length) {
          console.log("actual path: " + actualTrades[0]?.route.path.map(token => token.currency.symbol).toString())
          console.log("expected path: " + expectedTrades[0]?.route.path.map(token => token.symbol).toString())
          query.errors?.forEach(e => console.log(e));
        }
        expect(actualTrades.length).toStrictEqual(expectedTrades.length);
        if (actualTrades.length === 0 && expectedTrades.length === 0) {
          continue;
        }
        expect(actualTrades[0].tradeType).toStrictEqual(expectedTrades[0].tradeType);
        // compare trade route paths
        for (let k = 0; k < actualTrades.length; k++) {
          const actualTrade = actualTrades[k];
          const expectedTrade = expectedTrades[k];
          const actualRoutePath: string[] = actualTrade.route.path.map(token => token.address) ?? [];
          const expectedRoutePath: string[] = expectedTrade.route.path.map(token => token.address);
          expect(actualRoutePath).toStrictEqual(expectedRoutePath);
        }
        // compare result amounts
        for (let k = 0; k < actualTrades.length; k++) {
          expect(actualTrades[k].outputAmount.amount).toStrictEqual(expectedTrades[k].outputAmount.numerator.toString());
        }
      }
    }
  });

  it('finds the best trade for exact output (default options)', async () => {
    for (let i = 0; i < tokens.length; i++) {
      for (let j = 0; j < tokens.length; j++) {
        if (tokens[i] === tokens[j]) {
          continue;
        }
        // get best trades
        const tokenIn = tokens[i];
        const amountOut: TokenAmount = {
          token: tokens[j],
          amount: "1000000000000000000"
        }
        const query = await client.query<{
          bestTradeExactOut: Trade[];
        }>({
          uri: ensUri,
          query: `
            query {
              bestTradeExactOut(
                pairs: $pairs
                tokenIn: $input
                amountOut: $output
                options: null
              )
            }
          `,
          variables: {
            pairs: pairs,
            input: tokenIn,
            output: amountOut,
          }
        });
        const actualTrades: Trade[] = query.data?.bestTradeExactOut ?? [];
        // expected best trades
        const uniTokenIn: uni.Token = new uni.Token(
          1,
          tokenIn.address,
          tokenIn.currency.decimals,
          tokenIn.currency.symbol || "",
          tokenIn.currency.name || ""
        );
        const uniAmountOut: uni.TokenAmount = new uni.TokenAmount(new uni.Token(
          1,
          amountOut.token.address,
          amountOut.token.currency.decimals,
          amountOut.token.currency.symbol || "",
          amountOut.token.currency.name || ""
        ), amountOut.amount);
        const expectedTrades = uni.Trade.bestTradeExactOut(uniPairs, uniTokenIn, uniAmountOut);
        // compare trade array lengths and trade type
        if (actualTrades.length !== expectedTrades.length) {
          console.log("actual path: " + actualTrades[0]?.route.path.map(token => token.currency.symbol).toString())
          console.log("expected path: " + expectedTrades[0]?.route.path.map(token => token.symbol).toString())
          query.errors?.forEach(e => console.log(e));
        }
        expect(actualTrades.length).toStrictEqual(expectedTrades.length);
        if (actualTrades.length === 0 && expectedTrades.length === 0) {
          continue;
        }
        expect(actualTrades[0].tradeType).toStrictEqual(expectedTrades[0].tradeType);
        // compare trade route paths
        for (let k = 0; k < actualTrades.length; k++) {
          const actualTrade = actualTrades[k];
          const expectedTrade = expectedTrades[k];
          const actualRoutePath: string[] = actualTrade.route.path.map(token => token.address) ?? [];
          const expectedRoutePath: string[] = expectedTrade.route.path.map(token => token.address);
          expect(actualRoutePath).toStrictEqual(expectedRoutePath);
        }
        // compare result amounts
        for (let k = 0; k < actualTrades.length; k++) {
          expect(actualTrades[k].inputAmount.amount).toStrictEqual(expectedTrades[k].inputAmount.numerator.toString());
        }
      }
    }
  });


  it('finds the best trade for exact input with Eth input', async () => {
    // get best trades
    const amountIn: TokenAmount = {
      token: ethToken,
      amount: "1000000000000000000"
    }
    const tokenOut: Token = tokens.filter(token => token.currency.symbol === "COMP")[0];
    const query = await client.query<{
      bestTradeExactIn: Trade[];
    }>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactIn(
            pairs: $pairs
            amountIn: $input
            tokenOut: $output
            options: null
          )
        }
      `,
      variables: {
        pairs: pairs,
        input: amountIn,
        output: tokenOut,
      }
    });
    const actualTrades: Trade[] = query.data?.bestTradeExactIn ?? [];
    // expected best trades
    const uniAmountIn: uni.CurrencyAmount = uni.CurrencyAmount.ether(amountIn.amount);
    const uniTokenOut: uni.Token = new uni.Token(
      1,
      tokenOut.address,
      tokenOut.currency.decimals,
      tokenOut.currency.symbol || "",
      tokenOut.currency.name || ""
    );
    const expectedTrades = uni.Trade.bestTradeExactIn(uniPairs, uniAmountIn, uniTokenOut);
    // compare trade array lengths and trade type
    if (actualTrades.length !== expectedTrades.length) {
      console.log("actual path: " + actualTrades[0]?.route.path.map(token => token.currency.symbol).toString())
      console.log("expected path: " + expectedTrades[0]?.route.path.map(token => token.symbol).toString())
      query.errors?.forEach(e => console.log(e));
    }
    expect(actualTrades.length).toStrictEqual(expectedTrades.length);
    expect(actualTrades[0].tradeType).toStrictEqual(expectedTrades[0].tradeType);
    // compare trade route paths
    for (let k = 0; k < actualTrades.length; k++) {
      const actualTrade = actualTrades[k];
      const expectedTrade = expectedTrades[k];
      const actualRoutePath: string[] = actualTrade.route.path.map(token => token.address) ?? [];
      const expectedRoutePath: string[] = expectedTrade.route.path.map(token => token.address);
      expect(actualRoutePath).toStrictEqual(expectedRoutePath);
    }
    // compare result amounts
    for (let k = 0; k < actualTrades.length; k++) {
      expect(actualTrades[k].outputAmount.amount).toStrictEqual(expectedTrades[k].outputAmount.numerator.toString());
    }
    // compare input and output tokens for best trade
    const actualInputToken = actualTrades[0].inputAmount.token.currency.symbol
    const expectedInputToken = expectedTrades[0].inputAmount.currency.symbol
    expect(actualInputToken).toStrictEqual(expectedInputToken);
    const actualOutputToken = actualTrades[0].outputAmount.token.currency.symbol
    const expectedOutputToken = expectedTrades[0].outputAmount.currency.symbol
    expect(actualOutputToken).toStrictEqual(expectedOutputToken);
  });

  it('finds the best trade for exact input with Eth output', async () => {
    // get best trades
    const amountIn: TokenAmount = {
      token: tokens.filter(token => token.currency.symbol === "COMP")[0],
      amount: "1000000000000000000"
    }
    const tokenOut: Token = ethToken
    const query = await client.query<{
      bestTradeExactIn: Trade[];
    }>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactIn(
            pairs: $pairs
            amountIn: $input
            tokenOut: $output
            options: null
          )
        }
      `,
      variables: {
        pairs: pairs,
        input: amountIn,
        output: tokenOut,
      }
    });
    const actualTrades: Trade[] = query.data?.bestTradeExactIn ?? [];
    // expected best trades
    const uniAmountIn: uni.TokenAmount = new uni.TokenAmount(new uni.Token(
      1,
      amountIn.token.address,
      amountIn.token.currency.decimals,
      amountIn.token.currency.symbol || "",
      amountIn.token.currency.name || ""
    ), amountIn.amount);
    const uniTokenOut: uni.Currency = uni.ETHER
    const expectedTrades = uni.Trade.bestTradeExactIn(uniPairs, uniAmountIn, uniTokenOut);
    // compare trade array lengths and trade type
    if (actualTrades.length !== expectedTrades.length) {
      console.log("actual path: " + actualTrades[0]?.route.path.map(token => token.currency.symbol).toString())
      console.log("expected path: " + expectedTrades[0]?.route.path.map(token => token.symbol).toString())
      query.errors?.forEach(e => console.log(e));
    }
    expect(actualTrades.length).toStrictEqual(expectedTrades.length);
    expect(actualTrades[0].tradeType).toStrictEqual(expectedTrades[0].tradeType);
    // compare trade route paths
    for (let k = 0; k < actualTrades.length; k++) {
      const actualTrade = actualTrades[k];
      const expectedTrade = expectedTrades[k];
      const actualRoutePath: string[] = actualTrade.route.path.map(token => token.address) ?? [];
      const expectedRoutePath: string[] = expectedTrade.route.path.map(token => token.address);
      expect(actualRoutePath).toStrictEqual(expectedRoutePath);
    }
    // compare result amounts
    for (let k = 0; k < actualTrades.length; k++) {
      expect(actualTrades[k].outputAmount.amount).toStrictEqual(expectedTrades[k].outputAmount.numerator.toString());
    }
    // compare input and output tokens for best trade
    const actualInputToken = actualTrades[0].inputAmount.token.currency.symbol
    const expectedInputToken = expectedTrades[0].inputAmount.currency.symbol
    expect(actualInputToken).toStrictEqual(expectedInputToken);
    const actualOutputToken = actualTrades[0].outputAmount.token.currency.symbol
    const expectedOutputToken = expectedTrades[0].outputAmount.currency.symbol
    expect(actualOutputToken).toStrictEqual(expectedOutputToken);
  });

  it('finds the best trade for exact output with Eth input', async () => {
    // get best trades
    const tokenIn: Token = ethToken;
    const amountOut: TokenAmount = {
      token: tokens.filter(token => token.currency.symbol === "COMP")[0],
      amount: "1000000000000000000"
    }
    const query = await client.query<{
      bestTradeExactOut: Trade[];
    }>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactOut(
            pairs: $pairs
            tokenIn: $input
            amountOut: $output
            options: null
          )
        }
      `,
      variables: {
        pairs: pairs,
        input: tokenIn,
        output: amountOut,
      }
    });
    const actualTrades: Trade[] = query.data?.bestTradeExactOut ?? [];
    // expected best trades
    const uniTokenIn: uni.Currency = uni.ETHER;
    const uniAmountOut: uni.TokenAmount = new uni.TokenAmount(new uni.Token(
      1,
      amountOut.token.address,
      amountOut.token.currency.decimals,
      amountOut.token.currency.symbol || "",
      amountOut.token.currency.name || ""
    ), amountOut.amount);
    const expectedTrades = uni.Trade.bestTradeExactOut(uniPairs, uniTokenIn, uniAmountOut);
    // compare trade array lengths and trade type
    if (actualTrades.length !== expectedTrades.length) {
      console.log("actual path: " + actualTrades[0]?.route.path.map(token => token.currency.symbol).toString())
      console.log("expected path: " + expectedTrades[0]?.route.path.map(token => token.symbol).toString())
      query.errors?.forEach(e => console.log(e));
    }
    expect(actualTrades.length).toStrictEqual(expectedTrades.length);
    expect(actualTrades[0].tradeType).toStrictEqual(expectedTrades[0].tradeType);
    // compare trade route paths
    for (let k = 0; k < actualTrades.length; k++) {
      const actualTrade = actualTrades[k];
      const expectedTrade = expectedTrades[k];
      const actualRoutePath: string[] = actualTrade.route.path.map(token => token.address) ?? [];
      const expectedRoutePath: string[] = expectedTrade.route.path.map(token => token.address);
      expect(actualRoutePath).toStrictEqual(expectedRoutePath);
    }
    // compare result amounts
    for (let k = 0; k < actualTrades.length; k++) {
      expect(actualTrades[k].outputAmount.amount).toStrictEqual(expectedTrades[k].outputAmount.numerator.toString());
    }
    // compare input and output tokens for best trade
    const actualInputToken = actualTrades[0].inputAmount.token.currency.symbol
    const expectedInputToken = expectedTrades[0].inputAmount.currency.symbol
    expect(actualInputToken).toStrictEqual(expectedInputToken);
    const actualOutputToken = actualTrades[0].outputAmount.token.currency.symbol
    const expectedOutputToken = expectedTrades[0].outputAmount.currency.symbol
    expect(actualOutputToken).toStrictEqual(expectedOutputToken);
  });

  it('finds the best trade for exact output with Eth output', async () => {
    // get best trades
    const tokenIn: Token = tokens.filter(token => token.currency.symbol === "COMP")[0];
    const amountOut: TokenAmount = {
      token: ethToken,
      amount: "1000000000000000000"
    }
    const query = await client.query<{
      bestTradeExactOut: Trade[];
    }>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactOut(
            pairs: $pairs
            tokenIn: $input
            amountOut: $output
            options: null
          )
        }
      `,
      variables: {
        pairs: pairs,
        input: tokenIn,
        output: amountOut,
      }
    });
    const actualTrades: Trade[] = query.data?.bestTradeExactOut ?? [];
    // expected best trades
    const uniTokenIn: uni.Currency = new uni.Token(
      1,
      tokenIn.address,
      tokenIn.currency.decimals,
      tokenIn.currency.symbol || "",
      tokenIn.currency.name || ""
    );
    const uniAmountOut: uni.CurrencyAmount = uni.CurrencyAmount.ether(amountOut.amount);
    const expectedTrades = uni.Trade.bestTradeExactOut(uniPairs, uniTokenIn, uniAmountOut);
    // compare trade array lengths and trade type
    if (actualTrades.length !== expectedTrades.length) {
      console.log("actual path: " + actualTrades[0]?.route.path.map(token => token.currency.symbol).toString())
      console.log("expected path: " + expectedTrades[0]?.route.path.map(token => token.symbol).toString())
      query.errors?.forEach(e => console.log(e));
    }
    expect(actualTrades.length).toStrictEqual(expectedTrades.length);
    expect(actualTrades[0].tradeType).toStrictEqual(expectedTrades[0].tradeType);
    // compare trade route paths
    for (let k = 0; k < actualTrades.length; k++) {
      const actualTrade = actualTrades[k];
      const expectedTrade = expectedTrades[k];
      const actualRoutePath: string[] = actualTrade.route.path.map(token => token.address) ?? [];
      const expectedRoutePath: string[] = expectedTrade.route.path.map(token => token.address);
      expect(actualRoutePath).toStrictEqual(expectedRoutePath);
    }
    // compare result amounts
    for (let k = 0; k < actualTrades.length; k++) {
      expect(actualTrades[k].outputAmount.amount).toStrictEqual(expectedTrades[k].outputAmount.numerator.toString());
    }
    // compare input and output tokens for best trade
    const actualInputToken = actualTrades[0].inputAmount.token.currency.symbol
    const expectedInputToken = expectedTrades[0].inputAmount.currency.symbol
    expect(actualInputToken).toStrictEqual(expectedInputToken);
    const actualOutputToken = actualTrades[0].outputAmount.token.currency.symbol
    const expectedOutputToken = expectedTrades[0].outputAmount.currency.symbol
    expect(actualOutputToken).toStrictEqual(expectedOutputToken);
  });
});