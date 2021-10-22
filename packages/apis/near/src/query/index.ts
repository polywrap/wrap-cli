import {
  Input_requestSignIn,
  AccountView,
  Near_Query,
} from "./w3";

export function requestSignIn(input: Input_requestSignIn): boolean {
  return Near_Query.requestSignIn(input);
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

export function accountState(): AccountView | null {
  return Near_Query.accountState({});
}
