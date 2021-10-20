import {
  Input_requestSignIn,
  AccountView,
} from "./w3";

export function requestSignIn(input: Input_requestSignIn): boolean {
  return false;
}

export function signOut(): boolean {
  return false;
}

export function isSignedIn(): boolean {
  return false;
}

export function getAccountId(): string | null {
  return null;
}

export function accountState(): AccountView | null {
  return null;
}
