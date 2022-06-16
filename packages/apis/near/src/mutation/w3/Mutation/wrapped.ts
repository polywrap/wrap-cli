import {
  requestSignTransactions
} from "../../index";
import {
  deserializerequestSignTransactionsArgs,
  serializerequestSignTransactionsResult
} from "./serialization";

export function requestSignTransactionsWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializerequestSignTransactionsArgs(argsBuf);
  const result = requestSignTransactions({
    transactions: args.transactions,
    callbackUrl: args.callbackUrl,
    meta: args.meta
  });
  return serializerequestSignTransactionsResult(result);
}
