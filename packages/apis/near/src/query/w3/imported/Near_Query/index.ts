import {
  w3_subinvoke,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializerequestSignInArgs,
  deserializerequestSignInResult,
  Input_requestSignIn,
  serializesignOutArgs,
  deserializesignOutResult,
  Input_signOut,
  serializeisSignedInArgs,
  deserializeisSignedInResult,
  Input_isSignedIn,
  serializegetAccountIdArgs,
  deserializegetAccountIdResult,
  Input_getAccountId,
  serializeaccountStateArgs,
  deserializeaccountStateResult,
  Input_accountState,
  serializecreateTransactionArgs,
  deserializecreateTransactionResult,
  Input_createTransaction,
  serializesignTransactionArgs,
  deserializesignTransactionResult,
  Input_signTransaction
} from "./serialization";
import * as Types from "../..";

export class Near_Query {

  public static uri: string = "w3://ens/nearPlugin.web3api.eth";

  public static requestSignIn(input: Input_requestSignIn): bool {
    const args = serializerequestSignInArgs(input);
    const result = w3_subinvoke(
      "w3://ens/nearPlugin.web3api.eth",
      "query",
      "requestSignIn",
      args
    );
    return deserializerequestSignInResult(result);
  }

  public static signOut(input: Input_signOut): bool {
    const args = serializesignOutArgs(input);
    const result = w3_subinvoke(
      "w3://ens/nearPlugin.web3api.eth",
      "query",
      "signOut",
      args
    );
    return deserializesignOutResult(result);
  }

  public static isSignedIn(input: Input_isSignedIn): bool {
    const args = serializeisSignedInArgs(input);
    const result = w3_subinvoke(
      "w3://ens/nearPlugin.web3api.eth",
      "query",
      "isSignedIn",
      args
    );
    return deserializeisSignedInResult(result);
  }

  public static getAccountId(input: Input_getAccountId): string | null {
    const args = serializegetAccountIdArgs(input);
    const result = w3_subinvoke(
      "w3://ens/nearPlugin.web3api.eth",
      "query",
      "getAccountId",
      args
    );
    return deserializegetAccountIdResult(result);
  }

  public static accountState(input: Input_accountState): Types.Near_AccountView | null {
    const args = serializeaccountStateArgs(input);
    const result = w3_subinvoke(
      "w3://ens/nearPlugin.web3api.eth",
      "query",
      "accountState",
      args
    );
    return deserializeaccountStateResult(result);
  }

  public static createTransaction(input: Input_createTransaction): Types.Near_Transaction {
    const args = serializecreateTransactionArgs(input);
    const result = w3_subinvoke(
      "w3://ens/nearPlugin.web3api.eth",
      "query",
      "createTransaction",
      args
    );
    return deserializecreateTransactionResult(result);
  }

  public static signTransaction(input: Input_signTransaction): Types.Near_SignTransactionResult {
    const args = serializesignTransactionArgs(input);
    const result = w3_subinvoke(
      "w3://ens/nearPlugin.web3api.eth",
      "query",
      "signTransaction",
      args
    );
    return deserializesignTransactionResult(result);
  }
}
