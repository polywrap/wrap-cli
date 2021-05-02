import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { ChainId, Pair, Token, TokenAmount } from "./types";
import path from "path";
import { defaultUniswapTokenList, getRedirects, getTokenList } from "../testUtils";

jest.setTimeout(60000);

// mainnet-fork:
// image: 'trufflesuite/ganache-cli'
// ports:
//   - '8546:8545'
// command: -l 8000000 --deterministic --hostname=0.0.0.0 --chainId 1 --fork https://mainnet.infura.io/v3/d119148113c047ca90f0311ed729c466

describe("Fetch", () => {

  let client: Web3ApiClient;
  let ensUri: string;
  let tokens: Token[] = [];

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const redirects: UriRedirect[] = getRedirects(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient({ redirects });
    // deploy api
    const apiPath: string = path.resolve(__dirname + "/../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    // ipfsUri = `ipfs/${api.ipfsCid}`;
    // set up test case data
    tokens = await getTokenList(defaultUniswapTokenList);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Fetches token data", async () => {
    const tokenData = await client.query<{
      fetchTokenData: Token;
    }>({
      uri: ensUri,
      query: `
        query {
          fetchTokenData(
            chainId: $chainId
            address: $address
          )
        }
      `,
      variables: {
        chainId: tokens[0].chainId,
        address: tokens[0].address,
      },
    });

    expect(tokenData.errors).toBeFalsy();
    expect(tokenData.data).toBeTruthy();
  });

  it("Fetches pair data", async () => {
    const pairData = await client.query<{
      fetchPairData: Pair;
    }>({
      uri: ensUri,
      query: `
        query {
          fetchPairData(
            token0: $token0
            token1: $token1
          )
        }
      `,
      variables: {
        token0: tokens[9],
        token1: tokens[31]
      },
    });
    expect(pairData.errors).toBeFalsy();
    expect(pairData.data).toBeTruthy();
  });

  it("Fetches total supply", async () => {
    const totalSupply = await client.query<{
      fetchTotalSupply: TokenAmount;
    }>({
      uri: ensUri,
      query: `
        query {
          fetchTotalSupply(
            token: $token
          )
        }
      `,
      variables: {
        token: tokens[0],
      },
    });
    expect(totalSupply.errors).toBeFalsy();
    expect(totalSupply.data).toBeTruthy();
  });

  it("Fetches kLast", async () => {
    const pairAddress = await client.query<{
      pairAddress: string;
    }>({
      uri: ensUri,
      query: `
        query {
          pairAddress(
            token0: $token0
            token1: $token1
          )
        }
      `,
      variables: {
        token0: tokens[9],
        token1: tokens[31]
      },
    });

    const pairToken: Token = {
      chainId: ChainId.MAINNET,
      address: pairAddress.data?.pairAddress ?? "",
      currency: {
        decimals: 18,
        symbol: null,
        name: null,
      },
    };

    const kLast = await client.query<{
      fetchKLast: string;
    }>({
      uri: ensUri,
      query: `
        query {
          fetchKLast(
            token: $token
          )
        }
      `,
      variables: {
        token: pairToken,
      },
    });
    expect(kLast.errors).toBeFalsy();
    expect(kLast.data).toBeTruthy();
  });

});
