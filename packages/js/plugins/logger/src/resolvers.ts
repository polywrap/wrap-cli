import { LoggerPlugin } from ".";
import { Query } from "./w3-temp";

export const query = (plugin: LoggerPlugin): Query.Module => ({
  log: (input: Query.Input_log) => {
    return plugin.log(input.level, input.message);
  },
});
