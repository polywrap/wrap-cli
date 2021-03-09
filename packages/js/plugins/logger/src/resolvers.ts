import { LoggerPlugin } from ".";

import { PluginModule } from "@web3api/core-js";

export const query = (plugin: LoggerPlugin): PluginModule => ({
  log: async (input: { level: string; message: string }) => {
    return await plugin.log(input.level, input.message);
  },
});
