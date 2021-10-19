import {
  Input_requestSignIn,
  Input_signOut,
  Input_isSignedIn,
  Input_getAccountId,
  Input_accountState,
  AccountView
} from "./w3";

export function requestSignIn(input: Input_requestSignIn): boolean {
  return false;
}

export function signOut(input: Input_signOut): boolean {
  return false;
}

export function isSignedIn(input: Input_isSignedIn): boolean {
  return false;
}

export function getAccountId(input: Input_getAccountId): string | null {
  return null;
}

export function accountState(input: Input_accountState): AccountView | null {
  return null;
}
