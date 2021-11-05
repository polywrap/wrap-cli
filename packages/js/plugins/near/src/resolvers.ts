import { NearPlugin } from ".";
import { Query, Mutation } from "./w3";

export const query = (plugin: NearPlugin): Query.Module => ({
  requestSignIn: async (input: Query.Input_requestSignIn) => {
    return await plugin.requestSignIn(input);
  },
  signOut: async (input: Query.Input_signOut) => {
    return await plugin.signOut(input);
  },
  isSignedIn: async (input: Query.Input_isSignedIn) => {
    return await plugin.isSignedIn(input);
  },
  getAccountId: async (input: Query.Input_getAccountId) => {
    return await plugin.getAccountId(input);
  },
  getPublicKey: async (input: Query.Input_getPublicKey) => {
    return await plugin.getPublicKey(input);
  },
  createTransactionWithWallet: async (
    input: Query.Input_createTransactionWithWallet
  ) => {
    return await plugin.createTransactionWithWallet(input);
  },
  signTransaction: async (input: Query.Input_signTransaction) => {
    return await plugin.signTransaction(input);
  },
});

export const mutation = (plugin: NearPlugin): Mutation.Module => ({
  sendJsonRpc: (input: Mutation.Input_sendJsonRpc) => {
    return plugin.sendJsonRpc(input);
  },
  requestSignTransactions: (input: Mutation.Input_requestSignTransactions) => {
    return plugin.requestSignTransactions(input);
  },
  sendTransaction: (input: Mutation.Input_sendTransaction) => {
    return plugin.sendTransaction(input);
  },
  sendTransactionAsync: (input: Mutation.Input_sendTransactionAsync) => {
    return plugin.sendTransactionAsync(input);
  },
});
