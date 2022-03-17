import { EthereumSignerPlugin as Plugin } from ".";
import { Query, Mutation } from "./w3";
import * as Types from "./w3";

export const mutation = (plugin: Plugin): Mutation.Module => ({
  sendTransaction: async (
    input: Mutation.Input_sendTransaction
  ): Promise<Types.TxResponse> => {
    return plugin.sendTransaction(input);
  },

  sendTransactionAndWait: (
    input: Mutation.Input_sendTransactionAndWait
  ): Promise<Types.TxReceipt> => {
    return plugin.sendTransactionAndWait(input);
  },

  signMessage: (input: Mutation.Input_signMessage): Promise<string> => {
    return plugin.signMessage(input);
  },

  sendRPC: (input: Mutation.Input_sendRPC): Promise<string> => {
    return plugin.sendRPC(input);
  },
});

export const query = (plugin: Plugin): Query.Module => ({
  callView: (input: Query.Input_callView): Promise<string> => {
    return plugin.callView(input);
  },

  getNetwork: (input: Query.Input_getNetwork): Promise<Types.Network> => {
    return plugin.getNetwork(input);
  },
});
