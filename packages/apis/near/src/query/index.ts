import {
  BlockResult,
  Input_getAccountState,
  Input_createTransaction,
  Input_requestSignIn,
  Input_findAccessKey,
  Input_signTransaction,
  Input_getPublicKey,
  Input_getBlock,
  Near_PublicKey,
  Near_Query,
  Near_Transaction,
  Near_SignTransactionResult,
  AccessKeyInfo,
  AccessKey, AccountView,
} from "./w3";
import JsonRpcProvider from "../utils/JsonRpcProvider";
import * as bs58 from "as-base58";
import { BigInt, JSON, JSONEncoder } from "@web3api/wasm-as";
import { publicKeyToStr } from "../utils/typeUtils";
import { toAccessKey } from "../utils/jsonMap";

export function requestSignIn(input: Input_requestSignIn): boolean {
  return Near_Query.requestSignIn({
    contractId: input.contractId,
    methodNames: input.methodNames,
    successUrl: input.successUrl,
    failureUrl: input.failureUrl,
  });
}

export function signOut(): boolean {
  return Near_Query.signOut({});
}

export function isSignedIn(): boolean {
  return Near_Query.isSignedIn({});
}

export function getAccountId(): string | null {
  return Near_Query.getAccountId({});
}

export function getBlock(input: Input_getBlock): BlockResult {
  const provider: JsonRpcProvider = new JsonRpcProvider(null);
  return provider.block(input.blockQuery);
}

export function getAccountState(input: Input_getAccountState): AccountView {
  // prepare params
  const encoder = new JSONEncoder();
  encoder.pushObject(null);
  encoder.setString("request_type", "view_account");
  encoder.setString("account_id", input.accountId);
  encoder.setString("finality", "optimistic");
  encoder.popObject();
  const params: JSON.Obj = <JSON.Obj>JSON.parse(encoder.serialize());
  // send rpc
  const provider: JsonRpcProvider = new JsonRpcProvider(null);
  const result: JSON.Obj = provider.sendJsonRpc("query", params);
  // parse and return result
  return {
    amount: result.getString("amount")!.valueOf(),
    locked: result.getString("locked")!.valueOf(),
    codeHash: result.getString("code_hash")!.valueOf(),
    storageUsage: BigInt.fromString(result.getValue("storage_usage")!.stringify()),
    storagePaidAt: BigInt.fromString(result.getValue("storage_paid_at")!.stringify()),
    blockHeight: BigInt.fromString(result.getValue("block_height")!.stringify()),
    blockHash: result.getString("block_hash")!.valueOf(),
  }
}

export function findAccessKey(input: Input_findAccessKey): AccessKeyInfo | null {
  // get public key
  const publicKey: Near_PublicKey | null  = getPublicKey({ accountId: input.accountId });
  if (publicKey == null) {
    return null;
  }
  // prepare params
  const encoder = new JSONEncoder();
  encoder.pushObject(null);
  encoder.setString("request_type", "view_access_key");
  encoder.setString("account_id", input.accountId);
  encoder.setString("public_key", publicKeyToStr(publicKey));
  encoder.setString("finality", "optimistic");
  encoder.popObject();
  const params: JSON.Obj = <JSON.Obj>JSON.parse(encoder.serialize());
  // send rpc
  const provider: JsonRpcProvider = new JsonRpcProvider(null);
  const result: JSON.Obj = provider.sendJsonRpc("query", params);
  return {
    accessKey: toAccessKey(result),
    publicKey: publicKey,
  };
}

export function getPublicKey(input: Input_getPublicKey): Near_PublicKey | null {
  return Near_Query.getPublicKey({ accountId: input.accountId });
}

export function createTransaction(input: Input_createTransaction): Near_Transaction {
  if (input.signerId == null) {
    return Near_Query.createTransactionWithWallet({
      receiverId: input.receiverId,
      actions: input.actions,
    });
  }
  const signerId: string = input.signerId!
  const accessKeyInfo: AccessKeyInfo | null  = findAccessKey({ accountId: signerId });
  if (accessKeyInfo == null) {
    throw new Error(
      `Can not sign transactions for account ${signerId} on requested network, no matching key pair found in signer.`
    );
  }
  const accessKey: AccessKey = accessKeyInfo.accessKey;
  const publicKey: Near_PublicKey = accessKeyInfo.publicKey;
  const block: BlockResult = getBlock({
    blockQuery: {
      finality: "final",
      blockId: null,
      syncCheckpoint: null,
    }
  });
  const blockHash: ArrayBuffer = <ArrayBuffer>bs58.decode(block.header.hash).buffer;
  const nonce = accessKey.nonce.addInt(1);
  return {
    signerId: signerId,
    publicKey: publicKey,
    nonce: nonce,
    receiverId: input.receiverId,
    blockHash: blockHash,
    actions: input.actions,
    hash: null,
  };
}

export function signTransaction(input: Input_signTransaction): Near_SignTransactionResult {
  return Near_Query.signTransaction({ transaction: input.transaction });
}