import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import * as path from "path";
import { expect } from "chai";
import { ChainId, Pair, Route, Token } from "./types";

describe('Route', () => {
  let client: Web3ApiClient;
  let ensUri: string;

  const token0: Token = { chainId: ChainId.MAINNET, address: '0x0000000000000000000000000000000000000001', decimals: 18, symbol: 't0', name: null };
  const token1: Token = { chainId: ChainId.MAINNET, address: '0x0000000000000000000000000000000000000002', decimals: 18, symbol: 't1', name: null };
  const weth:Token = {
    chainId: ChainId.MAINNET,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    symbol: "WETH9",
    name: "Wrapped Ether",
  };
  const pair_0_1: Pair = { tokenAmount0: {token: token0, amount: '100'}, tokenAmount1: { token: token1, amount: '200' } };
  const pair_0_weth: Pair = { tokenAmount0: {token: token0, amount: '100'}, tokenAmount1: { token: weth, amount: '100' } };
  const pair_1_weth: Pair = { tokenAmount0: {token: token1, amount: '175'}, tokenAmount1: { token: weth, amount: '100' } };

  before(async () => {
    const { ipfs, ensAddress, redirects } = await initTestEnvironment();
    client = new Web3ApiClient({ redirects });
    // deploy api
    const apiPath: string = path.resolve(__dirname + '/../../../');
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/${api.ensDomain}`;
  });

  after(async () => {
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

  it('can have a token as both input and output', async () => {
    const route: Route = { pairs: [pair_0_weth, pair_0_1, pair_1_weth], input: weth };
    expect(route.pairs).to.deep.equal([pair_0_weth, pair_0_1, pair_1_weth]);
    expect(route.input).to.deep.equal(weth);

    const outputQuery = await client.query<{
      routeOutput: Token;
    }>({
      uri: ensUri,
      query: `
        query {
          routeOutput(
            route: $route
          )
        }
      `,
      variables: {
        route: route
      }
    });
    const output: Token | undefined = outputQuery.data?.routeOutput
    expect(output).to.deep.equal(weth);

    const equalsQuery = await client.query<{
      tokenEquals: boolean
    }>({
      uri: ensUri,
      query: `
        query {
          tokenEquals(
            token: $output
            other: $weth
          )
        }
      `,
      variables: {
        output: route,
        weth: weth
      }
    });
    expect(equalsQuery.data?.tokenEquals).to.be.true;
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