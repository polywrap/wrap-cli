import { LoggerPlugin, LogLevel } from ".";

import { PluginModule } from "@web3api/core-js";

export const query = (plugin: LoggerPlugin): PluginModule => ({
  log: (input: { level: LogLevel; message: string }) => {
    return plugin.log(input.level, input.message);
  },
});
