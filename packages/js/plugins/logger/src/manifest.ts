import { PluginManifest, Uri } from "@web3api/core-js";

export const manifest: PluginManifest = {
  schema: `
  enum LogLevel {
    ALL,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
  }

  type Query {
    log(
      level: LogLevel!
      message: String!
    ): Boolean!
  }
`,
  implemented: [new Uri("w3/logger")],
  imported: [],
};
