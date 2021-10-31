import { Web3ApiClient } from "@web3api/client-js";
import { nearPlugin, NearPluginConfig, } from "@web3api/near-plugin-js";
import {
  BlockReference,
  BlockResult,
  AccountView,
  PublicKey,
  AccessKeyInfo,
  AccessKey,
} from "./tsTypes";
import * as testUtils from "./testUtils";
import * as nearApi from "near-api-js";
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import path from "path";
import { KeyPair } from "@web3api/near-plugin-js/src";
import { HELLO_WASM_METHODS } from "@web3api/near-plugin-js/src/__tests__/testUtils";
import BN from "bn.js";
import { networkId, publicKeyToStr } from "./testUtils";

jest.setTimeout(360000);

describe("e2e", () => {

  let client: Web3ApiClient;
  let apiUri: string;

  let nearConfig: NearPluginConfig;
  let near: nearApi.Near;
  let workingAccount: nearApi.Account;
  let contractId: string;

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
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, HELLO_WASM_METHODS.changeMethods, new BN(  "2000000000000000000000000"));
    await nearConfig.keyStore.setKey(testUtils.networkId, workingAccount.accountId, keyPair);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Get block information", async () => {
    const blockQuery: BlockReference = { finality: "final" };
    const result = await client.query<{ getBlock: BlockResult }>({
      uri: apiUri,
      query: `query {
        getBlock(
          blockQuery: $blockQuery
        )
      }`,
      variables: {
        blockQuery: blockQuery,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const block: BlockResult = result.data!.getBlock;
    expect(block.author).toBeTruthy();
    expect(block.header).toBeTruthy();
    expect(block.chunks.length).toBeGreaterThan(0);
    expect(block.chunks[0]).toBeTruthy();

    const nearBlock = await (near.connection.provider as nearApi.providers.JsonRpcProvider).block({ blockId: Number.parseInt(block.header.height) });
    expect(block.author).toStrictEqual(nearBlock.author);
    expect(block.header.hash).toStrictEqual(nearBlock.header.hash);
    expect(block.header.signature).toStrictEqual(nearBlock.header.signature);
    expect(block.chunks[0].chunk_hash).toStrictEqual(nearBlock.chunks[0].chunk_hash);
  });

  it("Get account state", async () => {
    const result = await client.query<{ accountState: AccountView }>({
      uri: apiUri,
      query: `query {
        accountState(
          accountId: $accountId
        )
      }`,
      variables: {
        accountId: workingAccount.accountId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const state: AccountView = result.data!.accountState;
    expect(state).toBeTruthy();

    const nearState = await workingAccount.state();

    expect(state.amount).toStrictEqual(nearState.amount);
    expect(state.locked).toStrictEqual(nearState.locked);
    expect(state.codeHash).toStrictEqual(nearState.code_hash);
    expect(state.storagePaidAt).toStrictEqual(nearState.storage_paid_at.toString());
    expect(state.storageUsage).toStrictEqual(nearState.storage_usage.toString());
  });

  it("Find access key", async () => {
    const result = await client.query<{ findAccessKey: AccessKeyInfo }>({
      uri: apiUri,
      query: `query {
        findAccessKey(
          accountId: $accountId
        )
      }`,
      variables: {
        accountId: workingAccount.accountId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const accessKeyInfo: AccessKeyInfo = result.data!.findAccessKey;
    expect(accessKeyInfo.publicKey).toBeTruthy();
    expect(accessKeyInfo.accessKey).toBeTruthy();

    const apiKey: AccessKey = accessKeyInfo.accessKey;

    const nearKeys = (await workingAccount.getAccessKeys()).filter(k => k.access_key.permission !== "FullAccess");
    expect(nearKeys.length).toBeGreaterThan(0);
    const nearKey = nearKeys[0];
    const nearPermission = nearKey.access_key.permission;

    // access key
    if (nearPermission === "FullAccess") {
      // this should never happen
      throw Error("This should never happen");
    } else {
      expect(apiKey.permission.isFullAccess).toBeFalsy();
      expect(apiKey.permission.receiverId).toStrictEqual(nearPermission.FunctionCall.receiver_id);
      expect(apiKey.permission.methodNames).toStrictEqual(nearPermission.FunctionCall.method_names);
      expect(apiKey.permission.allowance).toStrictEqual(nearPermission.FunctionCall.allowance.toString());
    }

    // public key
    expect(publicKeyToStr(accessKeyInfo.publicKey)).toStrictEqual(nearKey.public_key);
    const nearPublicKey = nearApi.utils.PublicKey.fromString(nearKey.public_key);
    const nearPublicKeyData: Uint8Array = Uint8Array.from(nearPublicKey.data);
    expect(accessKeyInfo.publicKey.data).toStrictEqual(nearPublicKeyData);
  });

  it("Get public key", async () => {
    const result = await client.query<{ getPublicKey: PublicKey }>({
      uri: apiUri,
      query: `query {
        getPublicKey(
          accountId: $accountId
        )
      }`,
      variables: {
        accountId: workingAccount.accountId,
      }
    });
    expect(result.errors).toBeFalsy();
    expect(result.data).toBeTruthy();

    const publicKey: PublicKey = result.data!.getPublicKey;
    expect(publicKey).toBeTruthy();

    const nearKey = await near.connection.signer.getPublicKey(workingAccount.accountId, networkId);
    expect(publicKey.data).toStrictEqual(nearKey.data);

    const publicKeyStr: string = publicKeyToStr(publicKey);
    const nearKeyStr = nearApi.utils.PublicKey.from(nearKey).toString();
    expect(publicKeyStr).toStrictEqual(nearKeyStr);
  });
});
