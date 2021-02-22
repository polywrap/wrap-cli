import { SamplePlugin } from ".";

import { PluginModule } from "@web3api/core-js";

export const query = (plugin: SamplePlugin): PluginModule => ({
  sampleQuery: async (input: { query: string }) => {
    return await plugin.sampleQuery(input.query);
  },
});

export const mutation = (plugin: SamplePlugin): PluginModule => ({
  sampleMutation: async (input: { data: Uint8Array }) => {
    return await plugin.sampleMutation(input.data);
  },
});
