import {
  w3_invoke_args,
  w3_invoke,
  w3_abort,
  InvokeArgs
} from "@web3api/wasm-as";
import {
  requestSignInWrapped,
  signOutWrapped,
  isSignedInWrapped,
  getAccountIdWrapped,
  accountStateWrapped
} from "./Query/wrapped";

export function _w3_invoke(method_size: u32, args_size: u32): bool {
  const args: InvokeArgs = w3_invoke_args(
    method_size,
    args_size
  );

  if (args.method == "requestSignIn") {
    return w3_invoke(args, requestSignInWrapped);
  }
  else if (args.method == "signOut") {
    return w3_invoke(args, signOutWrapped);
  }
  else if (args.method == "isSignedIn") {
    return w3_invoke(args, isSignedInWrapped);
  }
  else if (args.method == "getAccountId") {
    return w3_invoke(args, getAccountIdWrapped);
  }
  else if (args.method == "accountState") {
    return w3_invoke(args, accountStateWrapped);
  }
  else {
    return w3_invoke(args, null);
  }
}

export function w3Abort(
  msg: string | null,
  file: string | null,
  line: u32,
  column: u32
): void {
  w3_abort(
    msg ? msg : "",
    file ? file : "",
    line,
    column
  );
}
