import { SamplePlugin } from ".";

import { PluginModule } from "@web3api/core-js";

export const query = (plugin: SamplePlugin): PluginModule => ({
  sampleQuery: async (input: { data: string }) => {
    return await plugin.sampleQuery(input.data);
  },
});

export const mutation = (plugin: SamplePlugin): PluginModule => ({
  sampleMutation: (input: { data: Uint8Array }) => {
    return plugin.sampleMutation(input.data);
  },
});
