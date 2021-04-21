import { buildAndDeployApi,  } from "@web3api/test-env-js";
import { Web3ApiClient, UriRedirect } from "@web3api/client-js";
import { Token } from "../../query/w3";
import * as hre from "hardhat";
import { expect } from "chai";
import fetch, { Response } from "node-fetch";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";
import { Pair, TokenAmount } from "./types";
const path = require('path');

describe("Fetch", () => {
  const ethProvider = hre.ethers.provider
  const ipfsProvider = "https://ipfs.io";
  const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  // https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
  const defaultUniswapTokenList = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";

  let client: Web3ApiClient;
  let ensUri: string;
  let ipfsUri: string;
  let tokens: Token[] = [];

  before(async () => {
    // get client
    const redirects: UriRedirect[] = [
      {
        from: "w3://ens/ethereum.web3api.eth",
        to: ethereumPlugin({
          networks: {
            mainnet: {
              provider: ethProvider
            },
          },
          defaultNetwork: "mainnet"
        }),
      },
      {
        from: "w3://ens/ipfs.web3api.eth",
        to: ipfsPlugin({ provider: ipfsProvider }),
      },
      {
        from: "w3://ens/ens.web3api.eth",
        to: ensPlugin({address: ensAddress}),
      },
      {
        from: "w3://w3/logger",
        to: loggerPlugin(),
      },
    ];
    client = new Web3ApiClient({ redirects });

    // deploy api
    const apiPath: string = path.resolve(__dirname + '/../../../');
    const api = await buildAndDeployApi(apiPath, ipfsProvider, ensAddress);
    ensUri = `ens/${api.ensDomain}`;
    ipfsUri = `ipfs/${api.ipfsCid}`;
    console.log(ipfsUri);
  });

  // set up test case data
  before(async () => {
    await fetch(defaultUniswapTokenList)
      .then((response: Response) => response.json() as Record<string, any>)
      .then((json: Record<string, any>) => json.tokens as Record<string, any>[])
      .then((list: Record<string, any>[]) => list.forEach(token => tokens.push({
          chainId: token.chainId,
          address: token.address,
          decimals: null,
          symbol: null,
          name: null,
        })))
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
    expect(tokenData.errors).to.be.false;
    expect(tokenData.data).to.be.true;
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
    expect(pairData.errors).to.be.false;
    expect(pairData.data).to.be.true;
    console.log(pairData.data);
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
    expect(totalSupply.errors).to.be.false;
    expect(totalSupply.data).to.be.true;
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
    expect(kLast.errors).to.be.false;
    expect(kLast.data).to.be.true;
    console.log(kLast.data);
  });

});
