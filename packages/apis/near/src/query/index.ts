import {
  Input_createTransaction,
  Input_requestSignIn,
  Near_AccountView,
  Near_Query, Near_Transaction,
} from "./w3";

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
  return Near_Query.createTransaction({
    receiverId: input.receiverId,
    actions: input.actions,
  });
}
