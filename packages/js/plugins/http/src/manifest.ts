import { PluginManifest } from "@web3api/core-js";

export const manifest: PluginManifest = {
  // TODO: use the schema.graphql
  // https://github.com/web3-api/monorepo/issues/101
  schema: `
type Header {
  key: String!
  value: String!
}

type UrlParam {
  key: String!
  value: String!
}

type Response {
  status: Int!
  statusText: String!
  headers: [Header!]
  body: String
}

type Request {
  headers: [Header!]
  urlParams: [UrlParam!]
  responseType: String! # "TEXT" || "BINARY"
  body: String
}

# Enum types curently not supported 
#
# enum ResponseType {
#   TEXT
#   BINARY
# }

type Query {
  get(url: String!, request: Request): Response
}

type Mutation {
  post(url: String!, request: Request): Response
}
`,
  implements: [],
};
