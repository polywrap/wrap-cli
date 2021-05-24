import { ChainId, Pair, Token } from "./e2e/types";
import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import axios from "axios";
import path from "path";
import { buildAndDeployApi } from "@web3api/test-env-js";
import * as uni from "@uniswap/sdk";
import tokenList from "./e2e/testData/tokenList.json";

interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  redirects: UriRedirect[];
}

export async function getEnsUri(): Promise<string> {
  const { ensAddress, ipfs } = await getProviders();
  const apiPath: string = path.resolve(__dirname + "/../../");
  const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
  return `ens/testnet/${api.ensDomain}`;
}

export async function getProviders(): Promise<TestEnvironment> {
  const { data: { ipfs, ethereum }, } = await axios.get("http://localhost:4040/providers");
  const { data } = await axios.get("http://localhost:4040/deploy-ens");
  const redirects: UriRedirect[] = getRedirects(ethereum, ipfs, data.ensAddress);
  return { ipfs, ethereum, ensAddress: data.ensAddress, redirects };
}

export function getRedirects(ethereum: string, ipfs: string, ensAddress: string): UriRedirect[] {
  return [
    {
      from: "ens/ethereum.web3api.eth",
      to: ethereumPlugin({
        networks: {
          testnet: {
            provider: ethereum
          },
          MAINNET: {
            provider: "http://localhost:8546"
          },
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
        to: ensPlugin({ addresses: { testnet: ensAddress } }),
    },
  ];
}

export async function getTokenList(): Promise<Token[]> {
  let tokens: Token[] = [];
  tokenList.forEach((token: {
    address: string;
    decimals: number;
    symbol: string;
    name: string;
  }) => tokens.push({
    chainId: ChainId.MAINNET,
    address: token.address,
    currency: {
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    },
  }));
  return tokens;
}

export async function getPairData(token0: Token, token1: Token, client: Web3ApiClient, ensUri: string): Promise<Pair | undefined> {
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
      token0: token0,
      token1: token1
    },
  });

  if (pairData.errors) {
    throw pairData.errors;
  }

  return pairData.data?.fetchPairData;
}

export function getUniPairs(pairs: Pair[], chainId: number): uni.Pair[] {
  return pairs.map(pair => {
    return new uni.Pair(
      new uni.TokenAmount(
        new uni.Token(
          chainId,
          pair.tokenAmount0.token.address,
          pair.tokenAmount0.token.currency.decimals,
          pair.tokenAmount0.token.currency.symbol || "",
          pair.tokenAmount0.token.currency.name || ""
        ),
        pair.tokenAmount0.amount
      ),
      new uni.TokenAmount(
        new uni.Token(
          chainId,
          pair.tokenAmount1.token.address,
          pair.tokenAmount1.token.currency.decimals,
          pair.tokenAmount1.token.currency.symbol || "",
          pair.tokenAmount1.token.currency.name || ""
        ),
        pair.tokenAmount1.amount
      ),
    );
  });
}
