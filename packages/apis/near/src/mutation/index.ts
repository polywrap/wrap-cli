import {
  Input_requestSignTransactions,
  Near_Mutation,
} from "./w3";

export function requestSignTransactions(input: Input_requestSignTransactions): boolean {
  return Near_Mutation.requestSignTransactions({
    transactions: input.transactions,
    callbackUrl: input.callbackUrl,
    meta: input.meta,
  });
}

