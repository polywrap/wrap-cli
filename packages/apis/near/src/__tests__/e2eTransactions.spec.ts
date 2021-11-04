import { Web3ApiClient } from "@web3api/client-js";
import { nearPlugin, KeyPair, NearPluginConfig, } from "@web3api/near-plugin-js";
import {
  ExecutionOutcomeWithId,
  FinalExecutionOutcome,
  ExecutionStatus,
  SignTransactionResult,
  Transaction,
  Action,
} from "./tsTypes";
import * as testUtils from "./testUtils";
import * as nearApi from "near-api-js";
import BN from "bn.js";
import { HELLO_WASM_METHODS } from "./testUtils";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import path from "path";

jest.setTimeout(360000);

describe("e2e", () => {

  let client: Web3ApiClient;
  let apiUri: string;

  let nearConfig: NearPluginConfig;
  let near: nearApi.Near;
  let workingAccount: nearApi.Account;
  let contractId: string;

  const prepActions = (): Action[] => {
    const setCallValue = testUtils.generateUniqueString('setCallPrefix');
    const args = { value: setCallValue };
    const stringify = (obj: unknown): Buffer => Buffer.from(JSON.stringify(obj));
    const value: Buffer = stringify(args);
    return [{ methodName: "setValue", args: value, gas: "3000000000000", deposit: "0" }];
  }

  beforeAll(async () => {
    // set up test env and deploy api
    const { ethereum, ensAddress, ipfs } = await initTestEnvironment();
    const apiPath: string = path.resolve(__dirname + "/../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    apiUri = `ens/testnet/${api.ensDomain}`;
    // set up client
    nearConfig = await testUtils.setUpTestConfig();
    near = await nearApi.connect(nearConfig);
    client = new Web3ApiClient({
      plugins: [
        {
          uri: "w3://ens/nearPlugin.web3api.eth",
          plugin: nearPlugin(nearConfig)
        },
        {
          uri: "w3://ens/ipfs.web3api.eth",
          plugin: ipfsPlugin({ provider: ipfs }),
        },
        {
          uri: "w3://ens/ens.web3api.eth",
          plugin: ensPlugin({ addresses: { testnet: ensAddress } }),
        },
        {
          uri: "w3://ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: {
              testnet: {
                provider: ethereum
              },
            },
            defaultNetwork: "testnet"
          }),
        },
      ]
    });
    // set up contract account
    contractId = testUtils.generateUniqueString('test');
    workingAccount = await testUtils.createAccount(near);
    await testUtils.deployContract(workingAccount, contractId);
    // set up access key
    const keyPair = KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, HELLO_WASM_METHODS.allMethods, new BN(  "2000000000000000000000000"));
    await nearConfig.keyStore.setKey(testUtils.networkId, workingAccount.accountId, keyPair);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Creates a transaction without wallet", async () => {
    const actions: Action[] = prepActions();
    const result = await client.query<{ createTransaction: Transaction }>({
      uri: apiUri,
      query: `query {
        createTransaction(
          receiverId: $receiverId
          actions: $actions
          signerId: $signerId
        )
      }`,
      variables: {
        receiverId: contractId,
        actions: actions,
        signerId: workingAccount.accountId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const transaction: Transaction = result.data!.createTransaction;

    expect(transaction.signerId).toEqual(workingAccount.accountId);
    expect(transaction.publicKey).toBeTruthy();
    expect(transaction.nonce).toBeTruthy();
    expect(transaction.receiverId).toBeTruthy();
    expect(transaction.blockHash).toBeTruthy();
    expect(transaction.actions.length).toEqual(1);
    expect(transaction.actions[0].methodName).toEqual(actions[0].methodName);
    expect(transaction.actions[0].args).toEqual(Uint8Array.from(actions[0].args!));
    expect(transaction.actions[0].gas).toEqual(actions[0].gas);
    expect(transaction.actions[0].deposit).toEqual(actions[0].deposit);
    expect(transaction.actions[0].publicKey).toBeFalsy();
    expect(transaction.actions[0].beneficiaryId).toBeFalsy();
    expect(transaction.actions[0].accessKey).toBeFalsy();
    expect(transaction.actions[0].stake).toBeFalsy();
    expect(transaction.actions[0].code).toBeFalsy();
  });

  it("Signs a transaction without wallet", async () => {
    // create transaction
    const actions: Action[] = prepActions();
    const txQuery = await client.query<{ createTransaction: Transaction }>({
      uri: apiUri,
      query: `query {
        createTransaction(
          receiverId: $receiverId
          actions: $actions
          signerId: $signerId
        )
      }`,
      variables: {
        receiverId: contractId,
        actions: actions,
        signerId: workingAccount.accountId,
      }
    });
    expect(txQuery.errors).toBeFalsy();
    expect(txQuery.data).toBeTruthy();
    const transaction: Transaction = txQuery.data!.createTransaction;

    const result = await client.query<{
      signTransaction: SignTransactionResult
    }>({
      uri: apiUri,
      query: `query {
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
    expect(signedTx.transaction).toStrictEqual(transaction);
    expect(txHash).toBeTruthy();
    expect(signedTx.signature.data).toBeTruthy();
  });

  it("creates, signs, sends, and awaits mining of a transaction without wallet", async () => {
    const actions: Action[] = prepActions();
    const result = await client.query<{ signAndSendTransaction: FinalExecutionOutcome }>({
      uri: apiUri,
      query: `mutation {
        signAndSendTransaction(
          receiverId: $receiverId
          actions: $actions
          signerId: $signerId
        )
      }`,
      variables: {
        receiverId: contractId,
        actions: actions,
        signerId: workingAccount.accountId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const status: ExecutionStatus = result.data!.signAndSendTransaction.status;
    expect(status.successValue).toBeTruthy();
    expect(status.failure).toBeFalsy();
    const txOutcome: ExecutionOutcomeWithId = result.data!.signAndSendTransaction.transaction_outcome;
    expect(txOutcome.id).toBeTruthy();
    expect(txOutcome.outcome.status.successReceiptId).toBeTruthy();
    expect(txOutcome.outcome.status.failure).toBeFalsy();
    const receiptsOutcome: ExecutionOutcomeWithId[] = result.data!.signAndSendTransaction.receipts_outcome;
    expect(receiptsOutcome.length).toBeGreaterThan(0);
  });

  it("creates, signs, and sends a transaction asynchronously without wallet", async () => {
    const actions: Action[] = prepActions();
    const result = await client.query<{ signAndSendTransactionAsync: string }>({
      uri: apiUri,
      query: `mutation {
        signAndSendTransactionAsync(
          receiverId: $receiverId
          actions: $actions
          signerId: $signerId
        )
      }`,
      variables: {
        receiverId: contractId,
        actions: actions,
        signerId: workingAccount.accountId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const txHash: string = result.data!.signAndSendTransactionAsync;
    expect(txHash).toBeTruthy();

    const txStatus = await near.connection.provider.txStatus(txHash, workingAccount.accountId);
    console.log(JSON.stringify(txStatus, null, 2));

    const txStatus2 = await near.connection.provider.txStatus(txHash, contractId);
    console.log(JSON.stringify(txStatus2, null, 2));
  });
});
