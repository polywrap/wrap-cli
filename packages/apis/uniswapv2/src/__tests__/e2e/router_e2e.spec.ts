import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import {
  ChainId,
  Pair,
  Token,
  TokenAmount,
  Trade,
  TradeOptions,
  SwapParameters,
  TradeType,
  TxResponse, StaticTxResult
} from "./types";
import path from "path";
import {
  getBestTradeExactIn,
  getBestTradeExactOut,
  getPairData,
  getPlugins,
  getTokenList,
  getUniPairs
} from "../testUtils";
import { ethers } from "ethers";
import * as uni from "@uniswap/sdk";
import { getSwapMethodAbi } from "../../mutation/abi";

jest.setTimeout(120000);

describe("Router", () => {

  let client: Web3ApiClient;
  let recipient: string;
  let ensUri: string;
  let ethersProvider: ethers.providers.JsonRpcProvider;
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
    const apiPath: string = path.resolve(__dirname + "../../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    ethersProvider = new ethers.providers.JsonRpcProvider("http://localhost:8546");
    recipient = await ethersProvider.getSigner().getAddress();

    // set up test case data -> pairs
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

    // get uni pairs
    uniPairs = getUniPairs(pairs, 1);

    // approve token transfers
    for (let token of tokens) {
      const txResponse = await client.query<{approve: TxResponse}>({
        uri: ensUri,
        query: `
        mutation {
          approve(
            token: $token
          )
        }
      `,
        variables: {
          token: token,
        },
      });
      if (txResponse.errors) {
        console.log("approval error(s) for " + token.currency.symbol)
        txResponse.errors.forEach(console.log)
      }
      const approvedHash: string = txResponse.data?.approve.hash ?? "";
      if (!approvedHash) {
        throw new Error("Failed to approve token: " + token.currency.symbol);
      }
    }
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("successfully constructs swap call parameters with tokens in and out", async () => {
    // we3api tokens and trades
    const token0 = tokens[0];
    const token1 = tokens[1];
    const tokenAmount: TokenAmount = {
        token: token0,
        amount: "100000000"
      };
    const bestTradeInArray: Trade[] = await getBestTradeExactIn(pairs, tokenAmount, token1, null, client, ensUri);
    const bestTradeIn: Trade = bestTradeInArray[0];
    const bestTradeOutArray: Trade[] = await getBestTradeExactOut(pairs, token1, tokenAmount, null, client, ensUri);
    const bestTradeOut: Trade = bestTradeOutArray[0];

    // uni tokens and trades
    const uniAmount: uni.TokenAmount = new uni.TokenAmount(new uni.Token(
      1,
      tokenAmount.token.address,
      tokenAmount.token.currency.decimals,
      tokenAmount.token.currency.symbol || "",
      tokenAmount.token.currency.name || ""
    ), tokenAmount.amount);
    const uniToken: uni.Token = new uni.Token(
      1,
      token1.address,
      token1.currency.decimals,
      token1.currency.symbol || "",
      token1.currency.name || ""
    );
    const uniBestTradeIn: uni.Trade = uni.Trade.bestTradeExactIn(uniPairs, uniAmount, uniToken)[0];
    const uniBestTradeOut: uni.Trade = uni.Trade.bestTradeExactOut(uniPairs, uniToken, uniAmount)[0];

    const testCases = [
      {bestTrade: bestTradeIn, feeRule: true},
      {bestTrade: bestTradeIn, feeRule: false},
      {bestTrade: bestTradeOut, feeRule: false}
    ];
    for (const {bestTrade, feeRule} of testCases) {
      const tradeOptions: TradeOptions = {
        feeOnTransfer: feeRule,
        recipient,
        allowedSlippage: "0.1",
        unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
        ttl: 1800
      }
      const uniTradeOptions: uni.TradeOptionsDeadline = {
        feeOnTransfer: feeRule,
        recipient,
        allowedSlippage: new uni.Percent(uni.JSBI.BigInt(1000), uni.JSBI.BigInt(10000)),
        deadline: parseInt((new Date().getTime() / 1000).toFixed(0)) + 1800
      }

      const swapParametersQuery = await client.query<{ swapCallParameters: SwapParameters }>({
        uri: ensUri,
        query: `
          query {
            swapCallParameters(
              trade: $trade
              tradeOptions: $tradeOptions
            )
          }
        `,
        variables: {
          trade: bestTrade,
          tradeOptions: tradeOptions
        },
      });
      if (swapParametersQuery.errors) {
        swapParametersQuery.errors.forEach(console.log)
      }
      const swapParameters: SwapParameters = swapParametersQuery.data?.swapCallParameters!;
      const parsedArgs: (string | string[])[] = swapParameters.args.map((arg: string) =>
        arg.startsWith("[") && arg.endsWith("]") ? JSON.parse(arg) : arg
      );

      let expectedSwapParameters: uni.SwapParameters;
      if (bestTrade.tradeType === TradeType.EXACT_INPUT) {
        expectedSwapParameters = uni.Router.swapCallParameters(uniBestTradeIn, uniTradeOptions);
      } else {
        expectedSwapParameters = uni.Router.swapCallParameters(uniBestTradeOut, uniTradeOptions);
      }

      expect(parsedArgs).toStrictEqual(expectedSwapParameters.args);
      expect(swapParameters.methodName).toStrictEqual(expectedSwapParameters.methodName);
      expect(swapParameters.value).toStrictEqual(expectedSwapParameters.value);
    }
  });

  it("successfully constructs swap call parameters with exact eth in/out", async () => {
    // we3api tokens and trades
    const token0 = ethToken;
    const token1 = tokens.filter(token => token.currency.symbol === "WBTC")[0];
    const tokenAmount: TokenAmount = {
      token: token0,
      amount: "1000000000000000000"
    };
    const bestTradeInArray: Trade[] = await getBestTradeExactIn(pairs, tokenAmount, token1, null, client, ensUri);
    const bestTradeIn: Trade = bestTradeInArray[0];
    const bestTradeOutArray: Trade[] = await getBestTradeExactOut(pairs, token1, tokenAmount, null, client, ensUri);
    const bestTradeOut: Trade = bestTradeOutArray[0];

    // uni tokens and trades
    const uniAmount: uni.CurrencyAmount = uni.CurrencyAmount.ether(tokenAmount.amount)
    const uniToken: uni.Token = new uni.Token(
      1,
      token1.address,
      token1.currency.decimals,
      token1.currency.symbol || "",
      token1.currency.name || ""
    );

    const uniBestTradeIn: uni.Trade = uni.Trade.bestTradeExactIn(uniPairs, uniAmount, uniToken)[0];
    const uniBestTradeOut: uni.Trade = uni.Trade.bestTradeExactOut(uniPairs, uniToken, uniAmount)[0];

    const testCases = [
      {bestTrade: bestTradeIn, feeRule: true},
      {bestTrade: bestTradeIn, feeRule: false},
      {bestTrade: bestTradeOut, feeRule: false}
    ];
    for (const {bestTrade, feeRule} of testCases) {

      const tradeOptions: TradeOptions = {
        feeOnTransfer: feeRule,
        recipient,
        allowedSlippage: "0.1",
        unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
        ttl: 1800
      }
      const uniTradeOptions: uni.TradeOptionsDeadline = {
        feeOnTransfer: feeRule,
        recipient,
        allowedSlippage: new uni.Percent(uni.JSBI.BigInt(1000), uni.JSBI.BigInt(10000)),
        deadline: parseInt((new Date().getTime() / 1000).toFixed(0)) + 1800
      }

      const swapParametersQuery = await client.query<{ swapCallParameters: SwapParameters }>({
        uri: ensUri,
        query: `
          query {
            swapCallParameters(
              trade: $trade
              tradeOptions: $tradeOptions
            )
          }
        `,
        variables: {
          trade: bestTrade,
          tradeOptions: tradeOptions
        },
      });
      if (swapParametersQuery.errors) {
        swapParametersQuery.errors.forEach(console.log)
      }
      const swapParameters: SwapParameters = swapParametersQuery.data?.swapCallParameters!;
      const parsedArgs: (string | string[])[] = swapParameters.args.map((arg: string) =>
        arg.startsWith("[") && arg.endsWith("]") ? JSON.parse(arg) : arg
      );

      let expectedSwapParameters: uni.SwapParameters;
      if (bestTrade.tradeType === TradeType.EXACT_INPUT) {
        expectedSwapParameters = uni.Router.swapCallParameters(uniBestTradeIn, uniTradeOptions);
      } else {
        expectedSwapParameters = uni.Router.swapCallParameters(uniBestTradeOut, uniTradeOptions);
      }

      expect(parsedArgs).toStrictEqual(expectedSwapParameters.args);
      expect(swapParameters.methodName).toStrictEqual(expectedSwapParameters.methodName);
      expect(swapParameters.value).toStrictEqual(expectedSwapParameters.value);
    }
  });

  it("successfully constructs swap call parameters with inexact eth in/out", async () => {
    // we3api tokens and trades
    const token0 = tokens.filter(token => token.currency.symbol === "WBTC")[0];
    const token1 = ethToken;
    const tokenAmount: TokenAmount = {
      token: token0,
      amount: "100000000"
    };
    const bestTradeInArray: Trade[] = await getBestTradeExactIn(pairs, tokenAmount, token1, null, client, ensUri);
    const bestTradeIn: Trade = bestTradeInArray[0];
    const bestTradeOutArray: Trade[] = await getBestTradeExactOut(pairs, token1, tokenAmount, null, client, ensUri);
    const bestTradeOut: Trade = bestTradeOutArray[0];

    // uni tokens and trades
    const uniAmount: uni.TokenAmount = new uni.TokenAmount(new uni.Token(
      1,
      tokenAmount.token.address,
      tokenAmount.token.currency.decimals,
      tokenAmount.token.currency.symbol || "",
      tokenAmount.token.currency.name || ""
    ), tokenAmount.amount);
    const uniToken: uni.Currency = uni.ETHER;
    const uniBestTradeIn: uni.Trade = uni.Trade.bestTradeExactIn(uniPairs, uniAmount, uniToken)[0];
    const uniBestTradeOut: uni.Trade = uni.Trade.bestTradeExactOut(uniPairs, uniToken, uniAmount)[0];

    const testCases = [
      {bestTrade: bestTradeIn, feeRule: true},
      {bestTrade: bestTradeIn, feeRule: false},
      {bestTrade: bestTradeOut, feeRule: false}
    ];
    for (const {bestTrade, feeRule} of testCases) {

      const tradeOptions: TradeOptions = {
        feeOnTransfer: feeRule,
        recipient,
        allowedSlippage: "0.1",
        unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
        ttl: 1800
      }
      const uniTradeOptions: uni.TradeOptionsDeadline = {
        feeOnTransfer: feeRule,
        recipient,
        allowedSlippage: new uni.Percent(uni.JSBI.BigInt(1000), uni.JSBI.BigInt(10000)),
        deadline: parseInt((new Date().getTime() / 1000).toFixed(0)) + 1800
      }

      const swapParametersQuery = await client.query<{ swapCallParameters: SwapParameters }>({
        uri: ensUri,
        query: `
          query {
            swapCallParameters(
              trade: $trade
              tradeOptions: $tradeOptions
            )
          }
        `,
        variables: {
          trade: bestTrade,
          tradeOptions: tradeOptions
        },
      });
      if (swapParametersQuery.errors) {
        swapParametersQuery.errors.forEach(console.log)
      }
      const swapParameters: SwapParameters = swapParametersQuery.data?.swapCallParameters!;
      const parsedArgs: (string | string[])[] = swapParameters.args.map((arg: string) =>
        arg.startsWith("[") && arg.endsWith("]") ? JSON.parse(arg) : arg
      );

      let expectedSwapParameters: uni.SwapParameters;
      if (bestTrade.tradeType === TradeType.EXACT_INPUT) {
        expectedSwapParameters = uni.Router.swapCallParameters(uniBestTradeIn, uniTradeOptions);
      } else {
        expectedSwapParameters = uni.Router.swapCallParameters(uniBestTradeOut, uniTradeOptions);
      }

      expect(parsedArgs).toStrictEqual(expectedSwapParameters.args);
      expect(swapParameters.methodName).toStrictEqual(expectedSwapParameters.methodName);
      expect(swapParameters.value).toStrictEqual(expectedSwapParameters.value);
    }
  });

  it("Should successfully estimate swap call gas", async () => {
    const token0 = ethToken;
    const token1 = tokens.filter(token => token.currency.symbol === "WBTC")[0];
    const tokenAmount: TokenAmount = {
      token: token0,
      amount: "1000000000000000000"
    };
    const bestTradeInArray: Trade[] = await getBestTradeExactIn(pairs, tokenAmount, token1, null, client, ensUri);
    const bestTradeIn: Trade = bestTradeInArray[0];

    const tradeOptions: TradeOptions = {
      feeOnTransfer: false,
      recipient,
      allowedSlippage: "0.1",
      unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
      ttl: 1800
    }

    const swapParametersQuery = await client.query<{ swapCallParameters: SwapParameters}>({
      uri: ensUri,
      query: `
        query {
          swapCallParameters(
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        trade: bestTradeIn,
        tradeOptions: tradeOptions,
      },
    });
    if (swapParametersQuery.errors) {
      swapParametersQuery.errors.forEach(console.log)
    }
    const swapParameters: SwapParameters = swapParametersQuery.data?.swapCallParameters!;

    const gasEstimateQuery = await client.query<{ estimateGas: string}>({
      uri: ensUri,
      query: `
        query {
          estimateGas(
            parameters: $parameters
            chainId: $chainId
          )
        }
      `,
      variables: {
        parameters: swapParameters,
        chainId: token0.chainId
      },
    });
    const actualGasEstimate: string = gasEstimateQuery.data?.estimateGas ?? "";
    if (gasEstimateQuery.errors) {
      gasEstimateQuery.errors.forEach(console.log);
    }

    // parse swap parameters args
    const parsedArgs: (string | string[])[] = swapParameters.args.map((arg: string) =>
      arg.startsWith("[") && arg.endsWith("]") ? JSON.parse(arg) : arg
    );

    // get expected gas estimate
    const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const abi = [getSwapMethodAbi(swapParameters.methodName)];
    const contract = new ethers.Contract(uniswapRouterAddress, abi, ethersProvider.getSigner());
    const funcs = Object.keys(contract.interface.functions);
    const expectedGasEstimate = await contract.estimateGas[funcs[0]](...parsedArgs, {
      value: ethers.BigNumber.from(swapParameters.value),
    });

    expect(actualGasEstimate).toStrictEqual(expectedGasEstimate.toString());
  });

  it("Should call a swap statically (i.e. does not actually execute but \"pretends\" to execute) and return revert reason", async () => {
    const uniToken: Token = tokens.filter(token => token.currency.symbol === "UNI")[0];
    for (const tokenIn of [ethToken, uniToken]) {
      const tokenOut: Token = tokens.filter(token => token.currency.symbol === "WBTC")[0];
      const tokenAmount: TokenAmount = {
        token: tokenIn,
        amount: "10000000000000000000000000000000000000000000000"
      };

      const bestTradeInArray: Trade[] = await getBestTradeExactIn(pairs, tokenAmount, tokenOut, null, client, ensUri);
      const bestTrade: Trade = bestTradeInArray[0];

      const swapParametersQuery = await client.query<{ swapCallParameters: SwapParameters }>({
        uri: ensUri,
        query: `
        query {
          swapCallParameters(
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
        variables: {
          trade: bestTrade,
          tradeOptions: {
            allowedSlippage: "0.1",
            recipient: recipient,
            unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
            ttl: 1800
          }
        },
      });
      if (swapParametersQuery.errors) {
        console.log("swap parameter errors")
        swapParametersQuery.errors.forEach(console.log)
      }
      const swapParameters: SwapParameters = swapParametersQuery.data?.swapCallParameters!;

      const swapStatic = await client.query<{ execCallStatic: StaticTxResult }>({
        uri: ensUri,
        query: `
        query {
          execCallStatic(
            parameters: $parameters
            chainId: $chainId
          )
        }
    `,
        variables: {
          parameters: swapParameters,
          chainId: tokenIn.chainId,
        },
      });
      if (swapStatic.errors) {
        console.log("callStatic errors");
        swapStatic.errors.forEach(console.log)
      }
      const exception: StaticTxResult | undefined = swapStatic.data?.execCallStatic;
      expect(exception?.error).toStrictEqual(true)

      // parse swap parameters args
      const parsedArgs: (string | string[])[] = swapParameters.args.map((arg: string) =>
        arg.startsWith("[") && arg.endsWith("]") ? JSON.parse(arg) : arg
      );

      // get expected exception or lack thereof
      const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
      const abi = [getSwapMethodAbi(swapParameters.methodName)];
      const contract = new ethers.Contract(uniswapRouterAddress, abi, ethersProvider.getSigner(recipient));
      let ethersException = "";
      try {
        await contract.callStatic[swapParameters.methodName](...parsedArgs, {
          value: swapParameters.value,
        });
      } catch (e) {
        ethersException = e.reason;
      }

      expect(exception?.result).toStrictEqual(ethersException);
    }
  });
});
