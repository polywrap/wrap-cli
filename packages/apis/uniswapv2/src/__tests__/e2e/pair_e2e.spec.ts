import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import * as path from "path";
import { Pair, Token, TokenAmount } from "./types";
import { getPairData, getPlugins, getTokenList, getUniPairs } from "../testUtils";
import * as uni from "@uniswap/sdk";

jest.setTimeout(150000);

describe('Pair', () => {

  let client: Web3ApiClient;
  let ensUri: string;
  let pairs: Pair[] = [];
  let uniPairs: uni.Pair[];

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
    const tokens: Token[] = await getTokenList();
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
    [aave_dai, usdc_dai, aave_usdc, comp_weth, uni_link, uni_wbtc, wbtc_weth].forEach(pair => {
      if (pair) {
        pairs.push(pair)
      }
    });

    // create uniswap sdk pairs to compare results
    uniPairs = getUniPairs(pairs, 1);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  })

  it("off-chain pairAddress", async () => {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const actualOutput = await client.query<{
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
          token0: pair.tokenAmount0.token,
          token1: pair.tokenAmount1.token
        },
      });
      if (actualOutput.errors) {
        actualOutput.errors.forEach(e => console.log(e.message));
      }

      const expectedOutput: string = uni.Pair.getAddress(uniPairs[i].token0, uniPairs[i].token1);
      expect(actualOutput.data?.pairAddress).toStrictEqual(expectedOutput);
    }
  });

  it("pairOutputAmount", async () => {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const inputAmount: TokenAmount = {
        token: pair.tokenAmount0.token,
        amount: "1000000000000000000"
      }
      const actualOutput = await client.query<{
        pairOutputAmount: TokenAmount;
      }>({
        uri: ensUri,
        query: `
          query {
            pairOutputAmount(
              pair: $pair
              inputAmount: $input
            )
          }
        `,
        variables: {
          pair: pair,
          input: inputAmount
        },
      });
      if (actualOutput.errors) {
        actualOutput.errors.forEach(e => console.log(e.message));
      }
      const expectedOutput = uniPairs[i].getOutputAmount(new uni.TokenAmount(uniPairs[i].token0, inputAmount.amount));
      const expectedAmount = expectedOutput[0].numerator.toString();
      expect(actualOutput.data?.pairOutputAmount?.token).toStrictEqual(pair.tokenAmount1.token);
      expect(actualOutput.data?.pairOutputAmount?.amount).toStrictEqual(expectedAmount);
    }
  });

  it("pairOutputNextPair", async () => {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const inputAmount: TokenAmount = {
        token: pair.tokenAmount0.token,
        amount: "1000000000000000000"
      }
      const actualNextPair = await client.query<{
        pairOutputNextPair: Pair;
      }>({
        uri: ensUri,
        query: `
          query {
            pairOutputNextPair(
              pair: $pair
              inputAmount: $input
            )
          }
        `,
        variables: {
          pair: pair,
          input: inputAmount
        },
      });
      if (actualNextPair.errors) {
        actualNextPair.errors.forEach(e => console.log(e.message));
      }
      const expectedOutput = uniPairs[i].getOutputAmount(new uni.TokenAmount(uniPairs[i].token0, inputAmount.amount));
      const expectedNextReserve0 = expectedOutput[1].reserve0.numerator.toString();
      const expectedNextReserve1 = expectedOutput[1].reserve1.numerator.toString();
      expect(actualNextPair.data?.pairOutputNextPair.tokenAmount0.amount).toStrictEqual(expectedNextReserve0);
      expect(actualNextPair.data?.pairOutputNextPair.tokenAmount1.amount).toStrictEqual(expectedNextReserve1);
    }
  });

  it("pairInputAmount", async () => {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const outputAmount: TokenAmount = {
        token: pair.tokenAmount0.token,
        amount: "100"
      }
      const actualInput = await client.query<{
        pairInputAmount: TokenAmount;
      }>({
        uri: ensUri,
        query: `
          query {
            pairInputAmount(
              pair: $pair
              outputAmount: $output
            )
          }
        `,
        variables: {
          pair: pair,
          output: outputAmount
        },
      });
      if (actualInput.errors) {
        actualInput.errors.forEach(e => console.log(e.message));
      }
      const expectedInput = uniPairs[i].getInputAmount(new uni.TokenAmount(uniPairs[i].token0, outputAmount.amount));
      const expectedAmount = expectedInput[0].numerator.toString();
      expect(actualInput.data?.pairInputAmount?.token).toStrictEqual(pair.tokenAmount1.token);
      expect(actualInput.data?.pairInputAmount?.amount).toStrictEqual(expectedAmount);
    }
  });

  it("pairInputNextPair", async () => {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const outputAmount: TokenAmount = {
        token: pair.tokenAmount0.token,
        amount: "100"
      }
      const actualNextPair = await client.query<{
        pairInputNextPair: Pair;
      }>({
        uri: ensUri,
        query: `
          query {
            pairInputNextPair(
              pair: $pair
              outputAmount: $output
            )
          }
        `,
        variables: {
          pair: pair,
          output: outputAmount
        },
      });
      if (actualNextPair.errors) {
        actualNextPair.errors.forEach(e => console.log(e.message));
      }
      const expectedInput = uniPairs[i].getInputAmount(new uni.TokenAmount(uniPairs[i].token0, outputAmount.amount));
      const expectedNextReserve0 = expectedInput[1].reserve0.numerator.toString();
      const expectedNextReserve1 = expectedInput[1].reserve1.numerator.toString();
      expect(actualNextPair.data?.pairInputNextPair.tokenAmount0.amount).toStrictEqual(expectedNextReserve0);
      expect(actualNextPair.data?.pairInputNextPair.tokenAmount1.amount).toStrictEqual(expectedNextReserve1);
    }
  });

});