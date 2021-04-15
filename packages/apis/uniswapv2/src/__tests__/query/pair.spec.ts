import { Web3ApiClient } from "@web3api/client-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import * as path from "path";
import { expect } from "chai";
import * as uni from "@uniswap/sdk";
import { ChainId, Token, TokenAmount } from "./types";

describe('computePairAddress', () => {
  let client: Web3ApiClient;
  let ensUri: string;

  const USDC: Token = { chainId: ChainId.MAINNET, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 18, symbol: 'USDC', name: 'USD Coin' };
  const DAI: Token = { chainId: ChainId.MAINNET, address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, symbol: 'DAI', name: 'DAI Stablecoin' };

  const uniUSDC = new uni.Token(uni.ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin');
  const uniDAI = new uni.Token(uni.ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin');

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

  it('should correctly compute the pool address', async () => {
    const tokenA: Token = USDC;
    const tokenB: Token = DAI;
    const query = await client.query<{
      pairAddress: string;
    }>({
      uri: ensUri,
      query: `
        query {
          pairAddress(
            token0: $tokenA
            token1: $tokenB
          )
        }
      `,
      variables: {
        tokenA,
        tokenB
      }
    });
    const address: string = query.data?.pairAddress ?? "";
    expect(address).to.equal('0xb50b5182D6a47EC53a469395AF44e371d7C76ed4');
  })

  it('should give same result regardless of token order', async () => {
    let tokenA = USDC;
    let tokenB = DAI;
    const queryA = await client.query<{
      pairAddress: string;
    }>({
      uri: ensUri,
      query: `
        query {
          pairAddress(
            token0: $tokenA
            token1: $tokenB
          )
        }
      `,
      variables: {
        tokenA,
        tokenB
      }
    });
    const resultA: string = queryA.data?.pairAddress ?? "";

    tokenA = DAI;
    tokenB = USDC;
    const queryB = await client.query<{
      pairAddress: string;
    }>({
      uri: ensUri,
      query: `
        query {
          pairAddress(
            token0: $tokenA
            token1: $tokenB
          )
        }
      `,
      variables: {
        tokenA,
        tokenB
      }
    });
    const resultB: string = queryB.data?.pairAddress ?? "";

    expect(resultA).to.equal(resultB);
  })

  describe('Pair', async () => {

    describe('#reserve0', async () => {
      it('always comes from the token that sorts before', async () => {
        const pairA = { tokenAmount0: { token: USDC, amount: '100' }, tokenAmount1: { token: DAI, amount: '101' } };
        const pairB = { tokenAmount0: { token: DAI, amount: '101' }, tokenAmount1: { token: USDC, amount: '100' } };

        const query = await client.query<{
          prA: TokenAmount[];
          prB: TokenAmount[];
        }>({
          uri: ensUri,
          query: `
            query {
              prA: pairReserves(
                pair: $pairA
              )
              prB: pairReserves(
                pair: $pairB
              )
            }
          `,
          variables: {
            pairA,
            pairB
          }
        });
        const reservesA: TokenAmount[] = query.data?.prA ?? [];
        const reservesB: TokenAmount[] = query.data?.prB ?? [];
        expect(reservesA[0]).to.deep.equal({ token: DAI, amount: "101" });
        expect(reservesB[0]).to.deep.equal({ token: DAI, amount: "101" });
      })
    })
    describe('#reserve1', async () => {
      it('always comes from the token that sorts after', async () => {
        const pairA = { tokenAmount0: { token: USDC, amount: '100' }, tokenAmount1: { token: DAI, amount: '101' } };
        const pairB = { tokenAmount0: { token: DAI, amount: '101' }, tokenAmount1: { token: USDC, amount: '100' } };

        const query = await client.query<{
          prA: TokenAmount[];
          prB: TokenAmount[];
        }>({
          uri: ensUri,
          query: `
            query {
              prA: pairReserves(
                pair: $pairA
              )
              prB: pairReserves(
                pair: $pairB
              )
            }
          `,
          variables: {
            pairA,
            pairB
          }
        });
        const reservesA: TokenAmount[] = query.data?.prA ?? [];
        const reservesB: TokenAmount[] = query.data?.prB ?? [];
        expect(reservesA[1]).to.deep.equal({ token: USDC, amount: "100" });
        expect(reservesB[1]).to.deep.equal({ token: USDC, amount: "100" });
      })
    })

    describe('#token0Price', async () => {

      it('returns price of token0 in terms of token1', async () => {
        const pairA = { tokenAmount0: { token: USDC, amount: '101' }, tokenAmount1: { token: DAI, amount: '100' } };
        const pairB = { tokenAmount0: { token: DAI, amount: '100' }, tokenAmount1: { token: USDC, amount: '101' } };

        const query = await client.query<{
          priceA: string;
          priceB: string;
        }>({
          uri: ensUri,
          query: `
            query {
              priceA: pairToken0Price(
                pair: $pairA
              )
              priceB: pairToken1Price(
                pair: $pairB
              )
            }
          `,
          variables: {
            pairA,
            pairB
          }
        });
        expect(query.data?.priceA).to.equal(new uni.Price(uniDAI, uniUSDC, '100', '101').adjusted.quotient.toString());
        expect(query.data?.priceB).to.equal(new uni.Price(uniDAI, uniUSDC, '100', '101').adjusted.quotient.toString());
      })
    })

    describe('#token1Price', async () => {
      it('returns price of token1 in terms of token0', async () => {
        const pairA = { tokenAmount0: { token: USDC, amount: '101' }, tokenAmount1: { token: DAI, amount: '100' } };
        const pairB = { tokenAmount0: { token: DAI, amount: '100' }, tokenAmount1: { token: USDC, amount: '101' } };

        const query = await client.query<{
          priceA: string;
          priceB: string;
        }>({
          uri: ensUri,
          query: `
            query {
              priceA: pairToken1Price(
                pair: $pairA
              )
              priceB: pairToken0Price(
                pair: $pairB
              )
            }
          `,
          variables: {
            pairA,
            pairB
          }
        });
        expect(query.data?.priceA).to.equal(new uni.Price(uniUSDC, uniDAI, '101', '100').adjusted.quotient.toString());
        expect(query.data?.priceB).to.equal(new uni.Price(uniUSDC, uniDAI, '101', '100').adjusted.quotient.toString());
      })
    })

    describe('#reserveOf', async () => {
      it('returns reserves of the given token', async () => {
        const pairA = { tokenAmount0: { token: USDC, amount: '100' }, tokenAmount1: { token: DAI, amount: '101' } };
        const pairB = { tokenAmount0: { token: DAI, amount: '101' }, tokenAmount1: { token: USDC, amount: '100' } };

        const query = await client.query<{
          reservesA: TokenAmount[];
          reservesB: TokenAmount[];
        }>({
          uri: ensUri,
          query: `
            query {
              reservesA: pairReserves(
                pair: $pairA
              ),
              reservesB: pairReserves(
                pair: $pairB
              )
            }
          `,
          variables: {
            pairA,
            pairB
          }
        });
        expect(query.data?.reservesA[0]).to.deep.equal({ token: USDC, amount: '100' });
        expect(query.data?.reservesB[1]).to.deep.equal({ token: USDC, amount: '100' });
      })
    })

    describe('miscellaneous', () => {
      it('getLiquidityMinted:0', async () => {
        const tokenA = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000001', decimals: 18 };
        const tokenB = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000002', decimals: 18 };
        const pair = { tokenAmount0: { token: tokenA, amount: "0" }, tokenAmount1: { token: tokenB, amount: "0" } };
        const preQuery = await client.query<{
          pairAddress: string;
        }>({
          uri: ensUri,
          query: `
            query {
              pairAddress(
                token0: $tokenA
                token1: $tokenB
              )
            }
          `,
          variables: {
            tokenA,
            tokenB
          }
        });
        const totalSupply = { token: { chainId: ChainId.RINKEBY, address: preQuery.data?.pairAddress, decimals: 18, name: "", symbol: "" }, amount: "0" };
        const tokenAmount0 = { token: tokenA, amount: "1001" };
        const tokenAmount1 = { token: tokenB, amount: "1001" };

        const query = await client.query<{
          minted: TokenAmount;
        }>({
          uri: ensUri,
          query: `
            query {
              minted: pairLiquidityMinted(
                pair: $pair,
                totalSupply: $totalSupply,
                tokenAmount0: $tokenAmount0,
                tokenAmount1: $tokenAmount1
              ),
            }
          `,
          variables: {
            pair,
            totalSupply,
            tokenAmount0,
            tokenAmount1
          }
        });

        // TODO: throw these exceptions
        // expect(() => {
        //   pair.getLiquidityMinted(
        //     new TokenAmount(pair.liquidityToken, '0'),
        //     new TokenAmount(tokenA, '1000'),
        //     new TokenAmount(tokenB, '1000')
        //   )
        // }).toThrow(InsufficientInputAmountError)
        //
        // expect(() => {
        //   pair.getLiquidityMinted(
        //     new TokenAmount(pair.liquidityToken, '0'),
        //     new TokenAmount(tokenA, '1000000'),
        //     new TokenAmount(tokenB, '1')
        //   )
        // }).toThrow(InsufficientInputAmountError)

        expect(query.data?.minted.amount).to.equal('1');
      })

      it('getLiquidityMinted:!0', async () => {
        const tokenA = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000001', decimals: 18 };
        const tokenB = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000002', decimals: 18 };
        const pair = { tokenAmount0: { token: tokenA, amount: "10000" }, tokenAmount1: { token: tokenB, amount: "10000" } };
        const preQuery = await client.query<{
          pairAddress: string;
        }>({
          uri: ensUri,
          query: `
            query {
              pairAddress(
                token0: $tokenA
                token1: $tokenB
              )
            }
          `,
          variables: {
            tokenA,
            tokenB
          }
        });
        const totalSupply = { token: { chainId: ChainId.RINKEBY, address: preQuery.data?.pairAddress, decimals: 18, name: "", symbol: "" }, amount: "10000" };
        const tokenAmount0 = { token: tokenA, amount: "2000" };
        const tokenAmount1 = { token: tokenB, amount: "2000" };

        const query = await client.query<{
          minted: TokenAmount;
        }>({
          uri: ensUri,
          query: `
            query {
              minted: pairLiquidityMinted(
                pair: $pair,
                totalSupply: $totalSupply,
                tokenAmount0: $tokenAmount0,
                tokenAmount1: $tokenAmount1
              ),
            }
          `,
          variables: {
            pair,
            totalSupply,
            tokenAmount0,
            tokenAmount1
          }
        });
        expect(query.data?.minted.amount).to.equal('2000');
      })

      it('getLiquidityValue:!feeOn', async () => {
        const tokenA = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000001', decimals: 18 };
        const tokenB = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000002', decimals: 18 };
        const pair = { tokenAmount0: { token: tokenA, amount: "1000" }, tokenAmount1: { token: tokenB, amount: "1000" } };
        const preQuery = await client.query<{
          pairAddress: string;
        }>({
          uri: ensUri,
          query: `
            query {
              pairAddress(
                token0: $tokenA
                token1: $tokenB
              )
            }
          `,
          variables: {
            tokenA,
            tokenB
          }
        });
        const totalSupply = { token: { chainId: ChainId.RINKEBY, address: preQuery.data?.pairAddress, decimals: 18, name: "", symbol: "" }, amount: "1000" };
        const liquidity1000 = { token: { chainId: ChainId.RINKEBY, address: preQuery.data?.pairAddress, decimals: 18, name: "", symbol: "" }, amount: "1000" };
        const liquidity500 = { token: { chainId: ChainId.RINKEBY, address: preQuery.data?.pairAddress, decimals: 18, name: "", symbol: "" }, amount: "500" };

        const query = await client.query<{
          valueA: TokenAmount[];
          valueB: TokenAmount[];
        }>({
          uri: ensUri,
          query: `
            query {
              valueA: pairLiquidityValue(
                pair: $pair,
                totalSupply: $totalSupply,
                liquidity: $liquidity1000,
                feeOn: null,
                kLast: null
              ),
              valueB: pairLiquidityValue(
                pair: $pair,
                totalSupply: $totalSupply,
                liquidity: $liquidity500,
                feeOn: null,
                kLast: null
              ),
            }
          `,
          variables: {
            pair,
            totalSupply,
            liquidity1000,
            liquidity500
          }
        });
        const liquidityValueA = query.data?.valueA!;
        expect(liquidityValueA[0].token).to.deep.equal(tokenA);
        expect(liquidityValueA[1].token).to.deep.equal(tokenB);
        expect(liquidityValueA[0].amount).to.equal("1000");
        expect(liquidityValueA[1].amount).to.equal("1000");
        const liquidityValueB = query.data?.valueB!;
        expect(liquidityValueB[0].token).to.deep.equal(tokenA);
        expect(liquidityValueB[0].amount).to.equal("500");
      })

      it('getLiquidityValue:feeOn', async () => {
        const tokenA = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000001', decimals: 18 };
        const tokenB = { chanId: ChainId.RINKEBY, address: '0x0000000000000000000000000000000000000002', decimals: 18 };
        const pair = { tokenAmount0: { token: tokenA, amount: "1000" }, tokenAmount1: { token: tokenB, amount: "1000" } };
        const preQuery = await client.query<{
          pairAddress: string;
        }>({
          uri: ensUri,
          query: `
            query {
              pairAddress(
                token0: $tokenA
                token1: $tokenB
              )
            }
          `,
          variables: {
            tokenA,
            tokenB
          }
        });
        const totalSupply = { token: { chainId: ChainId.RINKEBY, address: preQuery.data?.pairAddress, decimals: 18, name: "", symbol: "" }, amount: "500" };
        const liquidity = { token: { chainId: ChainId.RINKEBY, address: preQuery.data?.pairAddress, decimals: 18, name: "", symbol: "" }, amount: "500" };
        const feeOn = true;
        const kLast = "250000";

        const query = await client.query<{
          value: TokenAmount[];
        }>({
          uri: ensUri,
          query: `
            query {
              value: pairLiquidityValue(
                pair: $pair,
                totalSupply: $totalSupply,
                liquidity: $liquidity,
                feeOn: $feeOn,
                kLast: $kLast
              )
            }
          `,
          variables: {
            pair,
            totalSupply,
            liquidity,
            feeOn,
            kLast,
          }
        });
        const liquidityValue = query.data?.value!;
        expect(liquidityValue[0].token).to.deep.equal(tokenA);
        expect(liquidityValue[0].amount).to.equal("917"); // ceiling(1000 - (500 * (1 / 6)))
      })
    })
  })
})