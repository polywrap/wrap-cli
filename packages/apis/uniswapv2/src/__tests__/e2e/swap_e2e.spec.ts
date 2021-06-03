import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { Currency, Pair, Token, Trade, TxResponse } from "./types";
import path from "path";
import { getRedirects, getTokenList } from "../testUtils";
import { Contract, ethers, providers } from "ethers";
import erc20ABI from "./testData/erc20ABI.json";

jest.setTimeout(120000);

describe("Swap", () => {

  let client: Web3ApiClient;
  let recipient: string;
  let ensUri: string;
  let tokens: Token[];
  let ethersProvider: providers.JsonRpcProvider;
  let ethCurrency: Currency;
  let dai: Token;
  let eth: Token;
  let link: Token;

  beforeAll(async () => {
    const { ethereum: testEnvEtherem, ensAddress, ipfs } = await initTestEnvironment();
    // get client
    const redirects: UriRedirect[] = getRedirects(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient({ redirects: redirects, tracingEnabled: true });

    // deploy api
    const apiPath: string = path.resolve(__dirname + "../../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    ethersProvider = ethers.providers.getDefaultProvider("http://localhost:8546") as providers.JsonRpcProvider;
    recipient = await ethersProvider.getSigner().getAddress();

    // set up test case data -> pairs
    tokens = await getTokenList();
    dai = tokens.filter(token => token.currency.symbol === "DAI")[0];
    const daiTxResponse = await client.query<{approve: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          approve(
            token: $token
          )
        }
      `,
      variables: {
        token: dai,
      },
    });
    if (daiTxResponse.errors) {
      daiTxResponse.errors.forEach(console.log)
    }
    const daiApprove: string = daiTxResponse.data?.approve?.hash ?? "";
    const daiApproveTx = await ethersProvider.getTransaction(daiApprove);
    await daiApproveTx.wait();

    link = tokens.filter(token => token.currency.symbol === "LINK")[0];
    const linkTxResponse = await client.query<{approve: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          approve(
            token: $token
          )
        }
      `,
      variables: {
        token: link,
      },
    });
    const linkApprove: string = linkTxResponse.data?.approve.hash ?? "";
    const linkApproveTx = await ethersProvider.getTransaction(linkApprove);
    await linkApproveTx.wait();

    eth = tokens.filter(token => token.currency.symbol === "WETH")[0];
    ethCurrency = {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    };
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should successfully exec ether -> dai -> link -> ether trades", async () => {
    const etherDaiData = await client.query<{
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
        token0: eth,
        token1: dai,
      },
    });
    const daiLinkData = await client.query<{
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
        token0: dai,
        token1: link,
      },
    });
    const linkEtherData = await client.query<{
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
        token0: link,
        token1: eth,
      },
    });

    // EXEC: ETH -> dai
    const etherDaiTradeResult = await client.query<{bestTradeExactOut: Trade[]}>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactOut (
            pairs: $pairs
            amountOut: $amountOut
            tokenIn: $tokenIn
          )
        }
      `,
      variables: {
        pairs: [etherDaiData.data!.fetchPairData],
        amountOut: {
          token: dai,
          amount: "100000000"
        },
        tokenIn: eth,
      },
    });
    const etherDaiTrade = etherDaiTradeResult.data!.bestTradeExactOut[0];
    etherDaiTrade.route.path[0].currency = ethCurrency;
    etherDaiTrade.route.pairs[0].tokenAmount1.token.currency = ethCurrency;
    etherDaiTrade.route.input.currency = ethCurrency;
    etherDaiTrade.inputAmount.token.currency = ethCurrency;
    const etherDaiTxResponse = await client.query<{ exec: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          exec (
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        trade: etherDaiTrade,
        tradeOptions: {
          allowedSlippage: "0.1",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    if (etherDaiTxResponse.errors) {
      etherDaiTxResponse.errors.forEach(console.log)
    }

    expect(etherDaiTxResponse.errors).toBeFalsy
    const etherDaiTxHash: string = etherDaiTxResponse.data?.exec.hash ?? "";
    const etherDaiTx = await ethersProvider.getTransaction(etherDaiTxHash);
    await etherDaiTx.wait();

    const daiContract = new Contract(dai.address, erc20ABI, ethersProvider);
    const daiBalance = await daiContract.balanceOf(recipient);
    expect(daiBalance.gte("100000000")).toBeTruthy();

    // EXEC dai -> link
    const daiLinkTradeData = await client.query<{bestTradeExactIn: Trade[]}>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactIn (
            pairs: $pairs
            amountIn: $amountIn
            tokenOut: $tokenOut
          )
        }
      `,
      variables: {
        pairs: [daiLinkData.data!.fetchPairData],
        amountIn: {
          token: dai,
          amount: "100000"
        },
        tokenOut: link,
      },
    });
    const daiLinkTrade = daiLinkTradeData.data!.bestTradeExactIn[0];
    const daiLinkTxResponse = await client.query<{ exec: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          exec (
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        trade: daiLinkTrade,
        tradeOptions: {
          allowedSlippage: "0.1",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    const linkContract = new Contract(link.address, erc20ABI, ethersProvider);
    const linkBalance = await linkContract.balanceOf(recipient);

    expect(daiLinkTxResponse.errors).toBeFalsy();
    const daiLinkTxHash: string = daiLinkTxResponse.data?.exec.hash ?? "";
    const daiLinkTx = await ethersProvider.getTransaction(daiLinkTxHash);
    await daiLinkTx.wait();
    expect((await daiContract.balanceOf(recipient)).toString()).toBe("99900000");
    expect(linkBalance.gt("0")).toBeTruthy();

    // EXEC link -> eth exec
    const linkEthTradeResult = await client.query<{bestTradeExactIn: Trade[]}>({
      uri: ensUri,
      query: `
        query {
          bestTradeExactIn (
            pairs: $pairs
            amountIn: $amountIn
            tokenOut: $tokenOut
          )
        }
      `,
      variables: {
        pairs: [linkEtherData.data!.fetchPairData],
        amountIn: {
          token: link,
          amount: "100"
        },
        tokenOut: eth,
      },
    });
    const linkEthTrade = linkEthTradeResult.data!.bestTradeExactIn[0];
    linkEthTrade.route.path[1].currency = ethCurrency;
    linkEthTrade.route.pairs[0].tokenAmount1.token.currency = ethCurrency;
    linkEthTrade.route.output.currency = ethCurrency;
    linkEthTrade.outputAmount.token.currency = ethCurrency;
    const linkEthTxResponse = await client.query<{ exec: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          exec (
            trade: $trade
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        trade: linkEthTrade,
        tradeOptions: {
          allowedSlippage: "0.1",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    expect(linkEthTxResponse.errors).toBeFalsy();
    const linkEthTxHash: string = linkEthTxResponse.data?.exec.hash ?? "";
    const linkEthTx = await ethersProvider.getTransaction(linkEthTxHash);
    await linkEthTx.wait();

    expect((await linkContract.balanceOf(recipient)).lt(linkBalance)).toBeTruthy();

    // SWAP dai -> link
    const daiLinkSwap = await client.query<{ swap: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          swap (
            tokenIn: $token0
            tokenOut: $token1
            amount: $amount
            tradeType: $tradeType
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        token0: dai,
        token1: link,
        amount: "100",
        tradeType: "EXACT_INPUT",
        tradeOptions: {
          allowedSlippage: "0.1",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });


    expect(daiLinkSwap.errors).toBeFalsy();
    const daiLinkSwapHash: string = daiLinkSwap.data?.swap.hash ?? "";
    const daiLinkSwapTx = await ethersProvider.getTransaction(daiLinkSwapHash);
    await daiLinkSwapTx.wait();
    expect((await daiContract.balanceOf(recipient)).toString()).toBe("99899900");

    // SWAP link -> dai
    const linkDaiSwap = await client.query<{ swap: TxResponse}>({
      uri: ensUri,
      query: `
        mutation {
          swap (
            tokenIn: $token0
            tokenOut: $token1
            amount: $amount
            tradeType: $tradeType
            tradeOptions: $tradeOptions
          )
        }
      `,
      variables: {
        token0: link,
        token1: dai,
        amount: "100",
        tradeType: "EXACT_OUTPUT",
        tradeOptions: {
          allowedSlippage: "0.1",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    expect(linkDaiSwap.errors).toBeFalsy();
    const linkDaiSwapHash: string = linkDaiSwap.data?.swap.hash ?? "";
    const linkDaiSwapTx = await ethersProvider.getTransaction(linkDaiSwapHash);
    await linkDaiSwapTx.wait();
    expect((await daiContract.balanceOf(recipient)).toString()).toEqual("99900000");
  });
});