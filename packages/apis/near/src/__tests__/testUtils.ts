// copied and modified from https://github.com/near/near-api-js/blob/master/test/test-utils.js
import * as fs from "fs/promises";
import BN from "bn.js";
import * as nearApi from "near-api-js";
import { KeyPair, KeyStores, NearPluginConfig } from "@web3api/near-plugin-js";
import * as path from "path";
import { PublicKey } from "./tsTypes";

export const networkId = 'testnet';
export const testAccountId = "polywraptest.testnet";
const PRIVATE_KEY = "ed25519:3ZASru2hHvoDpT4jut4b8LqRBnz4GqMhtp24AzkLwdhuLDm6xgptkNmXVGWwfdyFHnnnG512Xb5RJcA7Cup3yjcG";

const HELLO_WASM_PATH = path.resolve(__dirname + '../../../../../../node_modules/near-hello/dist/main.wasm');
const HELLO_WASM_BALANCE = new BN("1000000000000000000000000");
export const HELLO_WASM_METHODS = {
  viewMethods: ['getValue', 'getLastResult'],
  changeMethods: ['setValue', 'callPromise']
};

// Length of a random account. Set to 40 because in the protocol minimal allowed top-level account length should be at least 32.
const RANDOM_ACCOUNT_LENGTH = 40;

export async function setUpTestConfig(): Promise<NearPluginConfig> {
  const keyStore = new KeyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(PRIVATE_KEY);
  let config: NearPluginConfig = {
    networkId: networkId,
    keyStore: keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    masterAccount: testAccountId,
    initialBalance: "2000000000000000000000000",
  };

  if (config.masterAccount) {
    await keyStore.setKey(networkId, config.masterAccount, keyPair);
  }

  return config;
}

// Generate some unique string of length at least RANDOM_ACCOUNT_LENGTH with a given prefix using the alice nonce.
export function generateUniqueString(prefix: string): string {
  let result = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
  let add_symbols = Math.max(RANDOM_ACCOUNT_LENGTH - result.length, 1);
  for (let i = add_symbols; i > 0; --i) result += '0';
  return result;
}

export async function createAccount(near: nearApi.Near): Promise<nearApi.Account> {
  const newAccountName = generateUniqueString('test');
  const newPublicKey = await near.connection.signer.createKey(newAccountName, networkId);
  await near.createAccount(newAccountName, newPublicKey);
  return new nearApi.Account(near.connection, newAccountName);
}

export async function deployContract(workingAccount: nearApi.Account, contractId: string) {
  const newPublicKey = await workingAccount.connection.signer.createKey(contractId, networkId);
  const data = (await fs.readFile(HELLO_WASM_PATH)).valueOf();
  await workingAccount.createAndDeployContract(contractId, newPublicKey, data, HELLO_WASM_BALANCE);
  return new nearApi.Contract(workingAccount, contractId, HELLO_WASM_METHODS);
}

export const publicKeyToStr = (key: PublicKey): string => {
  const encodedData = nearApi.utils.serialize.base_encode(Uint8Array.from(key.data));
  return `ed25519:${encodedData}`;
};