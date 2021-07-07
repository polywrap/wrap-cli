import { PluginManifest, coreInterfaceUris } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
# TODO: should import and "implements" the logger core-api schema
# https://github.com/Web3-API/monorepo/issues/75

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

type Query {
  log(
    level: LogLevel!
    message: String!
  ): Boolean!
}
`,
  implements: [coreInterfaceUris.logger],
};
