// import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
// import { createWeb3ApiClient, Web3ApiClient } from "@web3api/client-js";
// import { Token } from "../../query/w3";
//
// jest.setTimeout(50000);
//
// // https://tokenlists.org/token-list?url=testnet.tokenlist.eth
// const testTokensList = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://testnet.tokenlist.eth.link";
//
// // https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
// const defaultUniswapTokenList = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";
//
// describe("Fetch", () => {
//   let client: Web3ApiClient;
//   let ensUri: string;
//   let ipfsUri: string;
//   let tokens: Token[] = [];
//
//   // set up test environment and client; build and deploy api
//   beforeAll(async () => {
//     const { ipfs: ipfsProvider, ethereum: ethProvider, ensAddress } = await initTestEnvironment();
//
//     client = await createWeb3ApiClient({
//       ethereum: { provider: ethProvider },
//       ipfs: { provider: ipfsProvider },
//       ens: { address: ensAddress }
//     });
//
//     const api = await buildAndDeployApi(
//       __dirname + "/../../../../uniswapv2",
//       ipfsProvider,
//       ensAddress
//     );
//
//     ensUri = `ens/${api.ensDomain}`;
//     ipfsUri = `ipfs/${api.ipfsCid}`;
//   });
//
//   // set up test case data
//   beforeAll(async () => {
//     await fetch(testTokensList)
//       .then(response => response.json() as Record<string, any>)
//       .then(json => json.tokens as Record<string, any>[])
//       .then(list => list.forEach(token => tokens.push({
//           chainId: token.chainId,
//           address: token.address,
//           decimals: null,
//           symbol: null,
//           name: null,
//         })));
//   });
//
//   afterAll(async () => {
//     await stopTestEnvironment();
//   });
//
//   it("Fetch token data", async () => {
//
//     const tokenData = await client.query<{
//       fetchTokenData: Token;
//     }>({
//       uri: ensUri,
//       query: `
//         query {
//           fetchTokenData(
//             chainId: $chainId
//             address: $address
//           )
//         }
//       `,
//       variables: {
//         chainId: tokens[10].chainId,
//         address: tokens[10].address,
//       },
//     });
//
//     expect(tokenData.errors).toBeFalsy();
//     expect(tokenData.data).toBeTruthy();
//     console.log(tokenData.data);
//   });
// });
