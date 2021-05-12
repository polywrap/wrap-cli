import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import { Currency, Pair, Token, Trade } from "./types";
import path from "path";
import { getRedirects, getTokenList } from "../testUtils";
import { Contract, ethers, providers } from "ethers";
import erc20ABI from "./testData/erc20ABI.json";
import { BigNumber } from "@ethersproject/bignumber";

jest.setTimeout(90000);

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
    client = new Web3ApiClient({ redirects: redirects });

    // deploy api
    const apiPath: string = path.resolve(__dirname + "../../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;

    // set up test case data -> pairs
    tokens = await getTokenList();
    dai = tokens.filter(token => token.currency.symbol === "DAI")[0];
    const approveHash = await client.query<{approve: string}>({
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
    const daiApproveTx = await ethersProvider.getTransaction(approveHash.data!.approve);
    await daiApproveTx.wait();

    link = tokens.filter(token => token.currency.symbol === "LINK")[0];
    const linkApprove = await client.query<{approve: string}>({
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
    const linkApproveTx = await ethersProvider.getTransaction(linkApprove.data!.approve);
    await linkApproveTx.wait();

    eth = tokens.filter(token => token.currency.symbol === "WETH")[0];
    ethCurrency = {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    };

    ethersProvider = ethers.providers.getDefaultProvider("http://localhost:8546") as providers.JsonRpcProvider;
    recipient = await ethersProvider.getSigner().getAddress();
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
    JSON.stringify(etherDaiData)
    JSON.stringify(daiLinkData);
    JSON.stringify(linkEtherData);

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
          amount: "100000"
        },
        tokenIn: eth,
      },
    });
    const etherDaiTrade = etherDaiTradeResult.data!.bestTradeExactOut[0];
    etherDaiTrade.route.path[0].currency = ethCurrency;
    etherDaiTrade.route.pairs[0].tokenAmount1.token.currency = ethCurrency;
    etherDaiTrade.route.input.currency = ethCurrency;
    etherDaiTrade.inputAmount.token.currency = ethCurrency;
    const etherDaiTxHash = await client.query<{ exec: string}>({
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

    expect(etherDaiTxHash.errors).toBeFalsy
    const etherDaiTx = await ethersProvider.getTransaction(etherDaiTxHash.data!.exec);
    await etherDaiTx.wait();

    const daiContract = new Contract(dai.address, erc20ABI, ethersProvider);
    const daiBalance = await daiContract.balanceOf(recipient);
    expect(daiBalance.gte("1000")).toBeTruthy();

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
    const daiLinkTxHash = await client.query<{ exec: string}>({
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

    expect(daiLinkTxHash.errors).toBeFalsy();
    const daiLinkTx = await ethersProvider.getTransaction(daiLinkTxHash.data!.exec);
    await daiLinkTx.wait();
    expect((await daiContract.balanceOf(recipient)).toString()).toBe("0");
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
    const linkEthTxHash = await client.query<{ exec: string}>({
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

    expect(linkEthTxHash.errors).toBeFalsy();
    const linkEthTx = await ethersProvider.getTransaction(linkEthTxHash.data!.exec);
    await linkEthTx.wait();

    expect((await linkContract.balanceOf(recipient)).lt(linkBalance)).toBeTruthy();

    // SWAP dai -> link
    const daiLinkSwap = await client.query<{ swap: string}>({
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
        tradeType: 0,
        tradeOptions: {
          allowedSlippage: "0.1",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    const swapExactInDaiBalance = await daiContract.balanceOf(recipient);
    expect(swapExactInDaiBalance.sub(daiBalance)).toEqual(BigNumber.from("100"));

    // SWAP link -> dai
    const linkDaiSwap = await client.query<{ swap: string}>({
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
        tradeType: 1,
        tradeOptions: {
          allowedSlippage: "0.1",
          recipient: recipient,
          unixTimestamp: parseInt((new Date().getTime() / 1000).toFixed(0)),
          ttl: 1800
        }
      },
    });

    const swapExactOutDaiBalance = await daiContract.balanceOf(recipient);
    expect(swapExactOutDaiBalance.sub(swapExactInDaiBalance)).toEqual(BigNumber.from("100"));
  });
});
