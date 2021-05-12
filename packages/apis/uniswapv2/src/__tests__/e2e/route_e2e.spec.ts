import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import * as path from "path";
import { Pair, Route, Token, TokenAmount } from "./types";
import { defaultUniswapTokenList, getPairData, getRedirects, getTokenList, getUniPairs } from "../testUtils";
import * as uni from "@uniswap/sdk";

jest.setTimeout(60000);

describe('Route', () => {

  let client: Web3ApiClient;
  let ensUri: string;
  let pairSets: Pair[][] = [];
  let uniPairSets: uni.Pair[][] = [];
  let inputTokens: Token[] = [];
  let outputTokens: Token[] = [];

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const redirects: UriRedirect[] = getRedirects(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient({ redirects });
    // deploy api
    const apiPath: string = path.resolve(__dirname + "/../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    // pick some test case tokens
    const tokens: Token[] = await getTokenList(defaultUniswapTokenList);
    const aave: Token = tokens.filter(token => token.currency.symbol === "AAVE")[0];
    const dai: Token = tokens.filter(token => token.currency.symbol === "DAI")[0];
    const usdc: Token = tokens.filter(token => token.currency.symbol === "USDC")[0];
    const comp: Token = tokens.filter(token => token.currency.symbol === "COMP")[0];
    const weth: Token = tokens.filter(token => token.currency.symbol === "WETH")[0];
    const wbtc: Token = tokens.filter(token => token.currency.symbol === "WBTC")[0];
    const uniswap: Token = tokens.filter(token => token.currency.symbol === "UNI")[0];
    const link: Token = tokens.filter(token => token.currency.symbol === "LINK")[0];
    // create test case pairs
    const aave_dai: Pair | undefined = await getPairData(aave, dai, client, ensUri);
    const usdc_dai: Pair | undefined = await getPairData(usdc, dai, client, ensUri);
    const link_usdc: Pair | undefined = await getPairData(link, usdc, client, ensUri);
    const comp_weth: Pair | undefined = await getPairData(comp, weth, client, ensUri);
    const uni_link: Pair | undefined = await getPairData(uniswap, link, client, ensUri);
    const uni_wbtc: Pair | undefined = await getPairData(uniswap, wbtc, client, ensUri);
    const wbtc_weth: Pair | undefined = await getPairData(wbtc, weth, client, ensUri);
    // create pair sets that can form routes
    let pairSet: Pair[];
    // usdc <--> uni
    pairSet = [link_usdc, uni_link].map(pair => pair!);
    pairSets.push(pairSet);
    uniPairSets.push(getUniPairs(pairSet, 1));
    inputTokens.push(usdc);
    outputTokens.push(uniswap);
    // aave <--> comp
    pairSet = [aave_dai, usdc_dai, link_usdc, uni_link, uni_wbtc, wbtc_weth, comp_weth].map(pair => pair!);
    pairSets.push(pairSet);
    uniPairSets.push(getUniPairs(pairSet, 1));
    inputTokens.push(aave);
    outputTokens.push(comp);
    // comp <--> link
    pairSet = [comp_weth, wbtc_weth, uni_wbtc, uni_link].map(pair => pair!);
    pairSets.push(pairSet);
    uniPairSets.push(getUniPairs(pairSet, 1));
    inputTokens.push(comp);
    outputTokens.push(link);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  })

  it('constructs a route from an array of pairs', async () => {
    for (let i = 0; i < pairSets.length; i++) {
      const pairs: Pair[] = pairSets[i];
      const uniPairs: uni.Pair[] = uniPairSets[i];
      const inputToken = inputTokens[i];
      const outputToken = outputTokens[i];
      // actual route
      const actualRoute = await client.query<{
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
          pairs: pairs,
          input: inputToken,
          output: outputToken,
        }
      });
      // expected route
      const uniInputToken: uni.Token = new uni.Token(
        1,
        inputToken.address,
        inputToken.currency.decimals,
        inputToken.currency.symbol || "",
        inputToken.currency.name || ""
      )
      const uniOutputToken: uni.Token = new uni.Token(
        1,
        outputToken.address,
        outputToken.currency.decimals,
        outputToken.currency.symbol || "",
        outputToken.currency.name || ""
      )
      const expectedRoute = new uni.Route(uniPairs, uniInputToken, uniOutputToken);
      // compare input
      const actualRouteInput: string = actualRoute.data?.createRoute?.input.address ?? "";
      const expectedRouteInput: string = (expectedRoute.input as uni.Token).address;
      expect(actualRouteInput).toStrictEqual(expectedRouteInput);
      // compare output
      const actualRouteOutput: string = actualRoute.data?.createRoute?.output.address ?? "";
      const expectedRouteOutput: string = (expectedRoute.output as uni.Token).address;
      expect(actualRouteOutput).toStrictEqual(expectedRouteOutput);
      // compare path
      const actualRoutePath: string[] = actualRoute.data?.createRoute?.path?.map(token => token.address) ?? [];
      const expectedRoutePath: string[] = expectedRoute.path.map(token => token.address);
      expect(actualRoutePath).toStrictEqual(expectedRoutePath);
    }
  });

  it('calculates route midPrice', async () => {
    for (let i = 0; i < pairSets.length; i++) {
      const pairs: Pair[] = pairSets[i];
      const uniPairs: uni.Pair[] = uniPairSets[i];
      const inputToken = inputTokens[i];
      const outputToken = outputTokens[i];
      // actual route
      const actualRoute = await client.query<{
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
          pairs: pairs,
          input: inputToken,
          output: outputToken,
        }
      });
      // expected route
      const uniInputToken: uni.Token = new uni.Token(
        1,
        inputToken.address,
        inputToken.currency.decimals,
        inputToken.currency.symbol || "",
        inputToken.currency.name || ""
      )
      const uniOutputToken: uni.Token = new uni.Token(
        1,
        outputToken.address,
        outputToken.currency.decimals,
        outputToken.currency.symbol || "",
        outputToken.currency.name || ""
      )
      const expectedRoute = new uni.Route(uniPairs, uniInputToken, uniOutputToken);
      // actual midPrice
      const actualMidPrice = await client.query<{
        routeMidPrice: string;
      }>({
        uri: ensUri,
        query: `
          query {
            routeMidPrice(
              route: $route
            )
          }
        `,
        variables: {
          route: actualRoute?.data?.createRoute,
        }
      });
      // make sure price is correct
      const actualRouteMidPrice: string = actualMidPrice.data?.routeMidPrice!
      const expectedRouteMidPrice: string = expectedRoute.midPrice.toFixed(18);
      expect(actualRouteMidPrice).toStrictEqual(expectedRouteMidPrice);
    }
  });

});