import {
  requestSignIn,
  signOut,
  isSignedIn,
  getAccountId,
  accountState
} from "../../index";
import {
  deserializerequestSignInArgs,
  serializerequestSignInResult,
  deserializesignOutArgs,
  serializesignOutResult,
  deserializeisSignedInArgs,
  serializeisSignedInResult,
  deserializegetAccountIdArgs,
  serializegetAccountIdResult,
  deserializeaccountStateArgs,
  serializeaccountStateResult
} from "./serialization";

export function requestSignInWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializerequestSignInArgs(argsBuf);
  const result = requestSignIn({
    contractId: args.contractId,
    methodNames: args.methodNames,
    successUrl: args.successUrl,
    failureUrl: args.failureUrl
  });
  return serializerequestSignInResult(result);
}

export function signOutWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const result = signOut();
  return serializesignOutResult(result);
}

export function isSignedInWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const result = isSignedIn();
  return serializeisSignedInResult(result);
}

export function getAccountIdWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const result = getAccountId();
  return serializegetAccountIdResult(result);
}

export function accountStateWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const result = accountState();
  return serializeaccountStateResult(result);
}
