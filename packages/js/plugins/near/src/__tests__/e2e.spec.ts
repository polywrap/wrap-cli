import { Web3ApiClient } from "@web3api/client-js";
import { nearPlugin, KeyStores, KeyPair } from "../";
import { SignTransactionResult, Transaction } from "../w3";

describe("e2e", () => {

  let client: Web3ApiClient;
  const uri = "ens/nearPlugin.web3api.eth";
  const senderId = "polywraptest.testnet";
  const receiverId = "polywraptest.testnet";
  const PRIVATE_KEY = "3ZASru2hHvoDpT4jut4b8LqRBnz4GqMhtp24AzkLwdhuLDm6xgptkNmXVGWwfdyFHnnnG512Xb5RJcA7Cup3yjcG";

  beforeAll(async () => {
    // create test private and public keys
    const keyStore = new KeyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey("testnet", keyPair.getPublicKey().toString(), keyPair);

    client = new Web3ApiClient({
      plugins: [
        {
          uri: uri,
          plugin: nearPlugin({
            networkId: "testnet",
            keyStore: keyStore,
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
          })
        }
      ]
    });
  });

  it("Creates a transaction", async () => {
    const result = await client.query<{ createTransaction: Transaction }>({
      uri,
      query: `query {
        createTransaction(
          senderId: $senderId
          receiverId: $receiverId
          actions: $actions
        )
      }`,
      variables: {
        senderId: senderId,
        receiverId: receiverId,
        actions: [{ deposit: "1" }],
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const transaction: Transaction = result.data!.createTransaction;
    expect(transaction.signerId).toEqual(senderId);
  });

  it("Signs a transaction", async () => {
    const txQuery = await client.query<{ createTransaction: Transaction }>({
      uri,
      query: `query {
        createTransaction(
          senderId: $senderId
          receiverId: $receiverId
          actions: $actions
        )
      }`,
      variables: {
        senderId: senderId,
        receiverId: receiverId,
        actions: [{ deposit: "1" }],
      }
    });
    expect(txQuery.errors).toBeFalsy();
    expect(txQuery.data).toBeTruthy();

    const transaction: Transaction = txQuery.data!.createTransaction;

    const result = await client.query<{
      signTransaction: SignTransactionResult
    }>({
      uri,
      query: `mutation {
        signTransaction(
          transaction: $transaction
        )
      }`,
      variables: {
        transaction: transaction,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const signedTx = result.data!.signTransaction;
    expect(signedTx.signedTx.transaction.signerId).toEqual(senderId);
  });
});
