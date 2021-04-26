import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import fetch, { Response } from "node-fetch";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";
import { ChainId, Pair, Token, TokenAmount } from "./types";
import path from "path";
import * as fs from "fs";

jest.setTimeout(600000);

// -l 8000000 --deterministic --hostname=0.0.0.0 --chainId 0 --fork https://mainnet.infura.io/v3/d119148113c047ca90f0311ed729c466@12292343

// TODO: do fetches for a specific block number and compare to actual result for that block number
describe("Fetch", () => {
  const infuraProjectId = fs.readFileSync(__dirname + "/../../../infuraProjectId.txt", 'utf-8');
  const alchemyApiKey = fs.readFileSync(__dirname + "/../../../alchemyApiKey.txt", 'utf-8');
  const infuraProvider = `https://ropsten.infura.io/v3/${infuraProjectId}`;
  const alchemyProvider = `https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`;

  // https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
  // const defaultUniswapTokenList = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";
  // https://tokenlists.org/token-list?url=testnet.tokenlist.eth
  const tokenListUrl = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://testnet.tokenlist.eth.link"

  let client: Web3ApiClient;
  let ensUri: string;
  let ipfsUri: string;
  let tokens: Token[] = [];

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const redirects: UriRedirect[] = [
      {
        from: "ens/ethereum.web3api.eth",
        to: ethereumPlugin({
          networks: {
            testnet: {
              provider: testEnvEtherem
            },
            ropsten: {
              provider: infuraProvider
            },
            rinkeby: {
              provider: alchemyProvider
            }
          },
          defaultNetwork: "testnet"
        })
      },
      {
        from: "w3://ens/ipfs.web3api.eth",
        to: ipfsPlugin({ provider: ipfs }),
      },
      {
        from: "w3://ens/ens.web3api.eth",
        // @ts-ignore
        to: ensPlugin({ address: ensAddress }),
      },
      {
        from: "w3://w3/logger",
        to: loggerPlugin(),
      },
    ];
    client = new Web3ApiClient({ redirects });

    // deploy api
    const apiPath: string = path.resolve(__dirname + "/../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/${api.ensDomain}`;
    ipfsUri = `ipfs/${api.ipfsCid}`;
    console.log(ipfsUri);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  // set up test case data
  beforeAll(async () => {
    await fetch(tokenListUrl)
      .then((response: Response) => response.text())
      .then((text: string) => {
        const tokensObj = JSON.parse(text) as Record<string, any>;
        let list: Record<string, any>[] = tokensObj.tokens;
        list.forEach(token => tokens.push({
          chainId: ChainId.ROPSTEN,
          address: token.address,
          decimals: token.decimals,
          symbol: token.symbol,
          name: token.name,
        }));
      })
      .catch(e => console.log(e));
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
    console.log(tokenData.data);
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
        token0: tokens[0],
        token1: tokens[1]
      },
    });
    expect(pairData.errors).toBeFalsy();
    expect(pairData.data).toBeTruthy();
    console.log(pairData.data);
  });

  it("Fetches total supply", async () => {
    const totalSupply = await client.query<{
      fetchTotalSupply: TokenAmount;
    }>({
      uri: ipfsUri,
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
    console.log(totalSupply.data);
  });

  it("Fetches kLast", async () => {
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
        token: tokens[0],
      },
    });
    expect(kLast.errors).toBeFalsy();
    expect(kLast.data).toBeTruthy();
    console.log(kLast.data);
  });

});
