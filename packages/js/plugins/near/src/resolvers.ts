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
  accountState: async (input: Query.Input_accountState) => {
    return await plugin.accountState(input);
  },
  createTransaction: async (input: Query.Input_createTransaction) => {
    return await plugin.createTransaction(input);
  },
  signTransaction: async (input: Query.Input_signTransaction) => {
    return await plugin.signTransaction(input);
  },
});

export const mutation = (plugin: NearPlugin): Mutation.Module => ({
  requestSignTransactions: (input: Mutation.Input_requestSignTransactions) => {
    return plugin.requestSignTransactions(input);
  },
  sendTransaction: (input: Mutation.Input_sendTransaction) => {
    return plugin.sendTransaction(input);
  },
  sendTransactionAsync: (input: Mutation.Input_sendTransactionAsync) => {
    return plugin.sendTransactionAsync(input);
  },
  signAndSendTransaction: (input: Mutation.Input_signAndSendTransaction) => {
    return plugin.signAndSendTransaction(input);
  },
  signAndSendTransactionAsync: (
    input: Mutation.Input_signAndSendTransactionAsync
  ) => {
    return plugin.signAndSendTransactionAsync(input);
  },
});
