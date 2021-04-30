import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import * as path from "path";
import { ChainId, Pair, Route, Token } from "./types";
import { defaultUniswapTokenList, getPairData, getRedirects, getTokenList } from "../testUtils";

describe('Route', () => {

  let client: Web3ApiClient;
  let ensUri: string;
  let pairs: Pair[] = [];

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
    // create and push test case pairs
    const aave_dai: Pair | undefined = await getPairData(aave, dai, client, ensUri);
    const usdc_dai: Pair | undefined = await getPairData(usdc, dai, client, ensUri);
    const aave_usdc: Pair | undefined = await getPairData(aave, usdc, client, ensUri);
    const comp_weth: Pair | undefined = await getPairData(comp, weth, client, ensUri);
    const uni_link: Pair | undefined = await getPairData(uniswap, link, client, ensUri);
    const uni_wbtc: Pair | undefined = await getPairData(uniswap, wbtc, client, ensUri);
    const wbtc_weth: Pair | undefined = await getPairData(wbtc, weth, client, ensUri);
    [aave_dai, usdc_dai, aave_usdc, comp_weth, uni_link, uni_wbtc, wbtc_weth].forEach(pair => pairs.push(pair!));
  });

  afterAll(async () => {
    await stopTestEnvironment();
  })

  it('constructs a path from the tokens', async () => {
    const route: Route = { pairs: [pair_0_1], input: token0 };
    expect(route.pairs).to.deep.equal([pair_0_1]);

    const query = await client.query<{
      routePath: Token[];
      routeOutput: Token;
    }>({
      uri: ensUri,
      query: `
        query {
          routePath(
            route: $route
          )
          routeOutput(
            route: $route
          )
        }
      `,
      variables: {
        route: route
      }
    });
    const path: Token[] = query.data?.routePath ?? [];
    expect(path).to.deep.equal([token0, token1]);
    expect(route.input).to.deep.equal(token0);

    const output: Token | undefined = query.data?.routeOutput
    expect(output).to.deep.equal(token1);
    expect(output?.chainId).to.equal(ChainId.MAINNET);
  })

  // it('supports ether input', () => {
  //   const route = new Route([pair_0_weth], ETHER)
  //   expect(route.pairs).toEqual([pair_0_weth])
  //   expect(route.input).toEqual(ETHER)
  //   expect(route.output).toEqual(token0)
  // })
  //
  // it('supports ether output', () => {
  //   const route = new Route([pair_0_weth], token0, ETHER)
  //   expect(route.pairs).toEqual([pair_0_weth])
  //   expect(route.input).toEqual(token0)
  //   expect(route.output).toEqual(ETHER)
  // })
})