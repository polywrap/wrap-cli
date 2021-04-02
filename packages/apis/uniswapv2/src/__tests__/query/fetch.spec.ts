// import { createWeb3ApiClient } from "../";
// import {
//   buildAndDeployApi,
//   initTestEnvironment,
//   stopTestEnvironment
// } from "@web3api/test-env-js";
// import { GetPathToTestApis } from "@web3api/test-cases";
//
// jest.setTimeout(50000);
//
// describe("Web3ApiClient", () => {
//   let ipfsProvider: string;
//   let ethProvider: string;
//   let ensAddress: string;
//
//   beforeAll(async () => {
//     const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
//     ipfsProvider = ipfs;
//     ethProvider = ethereum;
//     ensAddress = ens;
//   });
//
//   afterAll(async () => {
//     await stopTestEnvironment();
//   });
//
//   it("simple-storage", async () => {
//     const api = await buildAndDeployApi(
//       `${GetPathToTestApis()}/simple-storage`,
//       ipfsProvider,
//       ensAddress
//     );
//
//     const client = await createWeb3ApiClient({
//       ethereum: { provider: ethProvider },
//       ipfs: { provider: ipfsProvider },
//       ens: { address: ensAddress }
//     });
//
//     const ensUri = `ens/${api.ensDomain}`;
//     const ipfsUri = `ipfs/${api.ipfsCid}`;
//
//     const deploy = await client.query<{
//       deployContract: string;
//     }>({
//       uri: ensUri,
//       query: `
//         mutation {
//           deployContract
//         }
//       `,
//     });
//
//     expect(deploy.errors).toBeFalsy();
//     expect(deploy.data).toBeTruthy();
//     expect(deploy.data?.deployContract.indexOf("0x")).toBeGreaterThan(-1);
//
//     if (!deploy.data) {
//       return;
//     }
//
//     const address = deploy.data.deployContract;
//     const set = await client.query<{
//       setData: string;
//     }>({
//       uri: ipfsUri,
//       query: `
//         mutation {
//           setData(
//             address: "${address}"
//             value: $value
//           )
//         }
//       `,
//       variables: {
//         value: 55,
//       },
//     });
//
//     expect(set.errors).toBeFalsy();
//     expect(set.data).toBeTruthy();
//     expect(set.data?.setData.indexOf("0x")).toBeGreaterThan(-1);
//
//     const get = await client.query<{
//       getData: number;
//       secondGetData: number;
//       thirdGetData: number;
//     }>({
//       uri: ensUri,
//       query: `
//         query {
//           getData(
//             address: "${address}"
//           )
//           secondGetData: getData(
//             address: "${address}"
//           )
//           thirdGetData: getData(
//             address: "${address}"
//           )
//         }
//       `,
//     });
//
//     expect(get.errors).toBeFalsy();
//     expect(get.data).toBeTruthy();
//     expect(get.data?.getData).toBe(55);
//     expect(get.data?.secondGetData).toBe(55);
//     expect(get.data?.thirdGetData).toBe(55);
//   });