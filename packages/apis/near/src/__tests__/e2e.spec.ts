import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { ClientConfig, Web3ApiClient } from "@web3api/client-js";
import { KeyPair, KeyStores, nearPlugin } from "@web3api/near-plugin-js";
import { getPlugins } from "./utils";
import path from "path";

jest.setTimeout(300000);

describe("NEAR Polywrapper", () => {

  let client: Web3ApiClient;
  let ensUri: string;
  const signerId = "polywraptest.testnet";
  const receiverId = "polywraptest.testnet";
  const PRIVATE_KEY = "3ZASru2hHvoDpT4jut4b8LqRBnz4GqMhtp24AzkLwdhuLDm6xgptkNmXVGWwfdyFHnnnG512Xb5RJcA7Cup3yjcG";

  // TODO: generate types and set up tests
  beforeAll(async () => {
    // create test private and public keys
    const keyStore = new KeyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey("testnet", keyPair.getPublicKey().toString(), keyPair);
    // get client
    const { ethereum, ipfs, ensAddress } = await initTestEnvironment();
    const config: ClientConfig = getPlugins(ethereum, ipfs, ensAddress, keyStore);
    client = new Web3ApiClient(config);
    // deploy api
    const apiPath: string = path.resolve(__dirname + "/../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  // it("Creates a transaction without wallet", async () => {
  //   const actions: Action[] = [{ deposit: "1" }];
  //   const result = await client.query<{ createTransaction: Transaction }>({
  //     uri,
  //     query: `query {
  //       createTransaction(
  //         receiverId: $receiverId
  //         actions: $actions
  //         signerId: $signerId
  //       )
  //     }`,
  //     variables: {
  //       receiverId: receiverId,
  //       actions: actions,
  //       signerId: signerId,
  //     }
  //   });
  //   expect(result.errors).toBeFalsy();
  //   expect(result.data).toBeTruthy();
  //
  //   const transaction: Transaction = result.data!.createTransaction;
  //   expect(transaction.signerId).toEqual(signerId);
  //   expect(transaction.publicKey).toBeTruthy();
  //   expect(transaction.nonce).toBeTruthy();
  //   expect(transaction.receiverId).toBeTruthy();
  //   expect(transaction.blockHash).toBeTruthy();
  //   expect(transaction.actions).toEqual(actions);
  // });
});
