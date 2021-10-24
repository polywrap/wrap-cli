import {
  BlockResult,
  Input_createTransaction,
  Input_requestSignIn,
  Near_AccessKey,
  Near_AccessKeyInfo,
  Near_AccountView,
  Near_PublicKey,
  Near_Query,
  Near_Transaction,
} from "./w3";
import JsonRpcProvider from "../utils/JsonRpcProvider";
import * as bs58 from "as-base58";

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

export function accountState(): Near_AccountView | null {
  return Near_Query.accountState({});
}

export function createTransaction(input: Input_createTransaction): Near_Transaction {
  if (input.signerId == null) {
    return Near_Query.createTransaction({
      receiverId: input.receiverId,
      actions: input.actions,
      signerId: input.signerId,
    });
  }
  const signerId: string = input.signerId!
  const accessKeyInfo: Near_AccessKeyInfo | null  = Near_Query.findAccessKey({ accountId: signerId });
  if (accessKeyInfo == null) {
    throw new Error(
      `Can not sign transactions for account ${signerId} on requested network, no matching key pair found in signer.`
    );
  }
  const accessKey: Near_AccessKey = accessKeyInfo.accessKey;
  const publicKey: Near_PublicKey = accessKeyInfo.publicKey;
  const provider: JsonRpcProvider = new JsonRpcProvider(null);
  const block: BlockResult = provider.block({
    finality: "final",
    blockId: null,
    syncCheckpoint: null,
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
  };
}
