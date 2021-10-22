import { Web3ApiClient } from "@web3api/client-js";
import { nearPlugin, KeyStores, KeyPair } from "../";
import {
  ExecutionOutcomeWithId,
  FinalExecutionOutcome,
  FinalExecutionStatus,
  SignTransactionResult,
  Transaction,
} from "../w3";
import { Action } from "../typeUtils";

describe("e2e", () => {

  // TODO: need to set up keystore correctly so this will work
  let client: Web3ApiClient;
  const uri = "ens/nearPlugin.web3api.eth";
  const signerId = "polywraptest.testnet";
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

  it("Creates a transaction without wallet", async () => {
    const actions: Action[] = [{ deposit: "1" }];
    const result = await client.query<{ createTransaction: Transaction }>({
      uri,
      query: `query {
        createTransaction(
          receiverId: $receiverId
          actions: $actions
          signerId: $signerId
        )
      }`,
      variables: {
        receiverId: receiverId,
        actions: actions,
        signerId: signerId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const transaction: Transaction = result.data!.createTransaction;
    expect(transaction.signerId).toEqual(signerId);
    expect(transaction.publicKey).toBeTruthy();
    expect(transaction.nonce).toBeTruthy();
    expect(transaction.receiverId).toBeTruthy();
    expect(transaction.blockHash).toBeTruthy();
    expect(transaction.actions).toEqual(actions);
  });

  it("Signs a transaction without wallet", async () => {
    const actions: Action[] = [{ deposit: "1" }];
    const txQuery = await client.query<{ createTransaction: Transaction }>({
      uri,
      query: `query {
        createTransaction(
          receiverId: $receiverId
          actions: $actions
          signerId: $signerId
        )
      }`,
      variables: {
        receiverId: receiverId,
        actions: actions,
        signerId: signerId,
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

    const signedTx = result.data!.signTransaction.signedTx;
    const txHash = result.data!.signTransaction.hash;
    expect(signedTx.transaction.signerId).toEqual(signerId);
    expect(signedTx.transaction.publicKey).toBeTruthy();
    expect(signedTx.transaction.nonce).toBeTruthy();
    expect(signedTx.transaction.receiverId).toBeTruthy();
    expect(signedTx.transaction.blockHash).toBeTruthy();
    expect(signedTx.transaction.actions).toEqual(actions);
    expect(txHash).toBeTruthy();
  });

  it("creates, signs, sends, and awaits mining of a transaction without wallet", async () => {
    const actions: Action[] = [{ deposit: "1" }];
    const result = await client.query<{ signAndSendTransaction: FinalExecutionOutcome }>({
      uri,
      query: `query {
        signAndSendTransaction(
          receiverId: String!
          actions: [Action!]!
          signerId: String!
      }`,
      variables: {
        receiverId: receiverId,
        actions: actions,
        signerId: signerId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const status: FinalExecutionStatus = result.data!.signAndSendTransaction.status;
    expect(status.successValue).toBeTruthy();
    expect(status.failure).toBeFalsy();
    const transaction: Transaction = result.data!.signAndSendTransaction.transaction;
    expect(transaction.signerId).toEqual(signerId);
    expect(transaction.publicKey).toBeTruthy();
    expect(transaction.nonce).toBeTruthy();
    expect(transaction.receiverId).toBeTruthy();
    expect(transaction.blockHash).toBeTruthy();
    expect(transaction.actions).toEqual(actions);
    const txOutcome: ExecutionOutcomeWithId = result.data!.signAndSendTransaction.transaction_outcome;
    expect(txOutcome.outcome.status.successValue).toBeTruthy();
    expect(txOutcome.outcome.status.failure).toBeFalsy();
    const receiptsOutcome: ExecutionOutcomeWithId[] = result.data!.signAndSendTransaction.receipts_outcome;
    expect(receiptsOutcome.length).toBeGreaterThan(0);
  });

  it("creates, signs, and sends a transaction asynchronously without wallet", async () => {
    const actions: Action[] = [{ deposit: "1" }];
    const result = await client.query<{ signAndSendTransactionAsync: FinalExecutionOutcome }>({
      uri,
      query: `query {
        signAndSendTransactionAsync(
          receiverId: String!
          actions: [Action!]!
          signerId: String!
      }`,
      variables: {
        receiverId: receiverId,
        actions: actions,
        signerId: signerId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();
  });
});
