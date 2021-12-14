import { SamplePlugin } from ".";
import { Query, Mutation } from "./w3";

export const query = (plugin: SamplePlugin): Query.Module => ({
  sampleQuery: async (input: Query.Input_sampleQuery) => {
    return await plugin.sampleQuery(input.data);
  },
});

export const mutation = (plugin: SamplePlugin): Mutation.Module => ({
  sampleMutation: (input: Mutation.Input_sampleMutation) => {
    return plugin.sampleMutation(input.data);
  },
});
