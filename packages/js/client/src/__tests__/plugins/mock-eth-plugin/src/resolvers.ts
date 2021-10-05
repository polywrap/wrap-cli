import { MockPlugin as Plugin } from ".";
import { Query, Mutation } from "./w3";

export const query = (plugin: Plugin): Query.Module => ({
  callContractView: async (
    input: Query.Input_callContractView
  ): Promise<string> => plugin.callContractView(input),
});

export const mutation = (plugin: Plugin): Mutation.Module => ({
  deployContract: async (
    input: Mutation.Input_deployContract
  ): Promise<string> => plugin.deployContract(input),
});
