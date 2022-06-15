/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

export const schema = `### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Bytes
scalar BigInt
scalar BigNumber
scalar JSON
scalar Map

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT

directive @capability(
  type: String!
  uri: String!
  namespace: String!
) repeatable on OBJECT

directive @enabled_interface on OBJECT

directive @annotate(type: String!) on FIELD

### Web3API Header END ###

type Module @imports(
  types: [
    "HTTP_Module",
    "HTTP_Request",
    "HTTP_Header",
    "HTTP_UrlParam",
    "HTTP_ResponseType",
    "HTTP_Response"
  ]
) {
  querySubgraph(
    subgraphAuthor: String!
    subgraphName: String!
    query: String!
  ): String!
}

### Imported Modules START ###

type HTTP_Module @imported(
  uri: "ens/http.web3api.eth",
  namespace: "HTTP",
  nativeType: "Module"
) {
  get(
    url: String!
    request: HTTP_Request
  ): HTTP_Response

  post(
    url: String!
    request: HTTP_Request
  ): HTTP_Response
}

### Imported Modules END ###

### Imported Objects START ###

type HTTP_Request @imported(
  uri: "ens/http.web3api.eth",
  namespace: "HTTP",
  nativeType: "Request"
) {
  headers: [HTTP_Header!]
  urlParams: [HTTP_UrlParam!]
  responseType: HTTP_ResponseType!
  body: String
}

type HTTP_Header @imported(
  uri: "ens/http.web3api.eth",
  namespace: "HTTP",
  nativeType: "Header"
) {
  key: String!
  value: String!
}

type HTTP_UrlParam @imported(
  uri: "ens/http.web3api.eth",
  namespace: "HTTP",
  nativeType: "UrlParam"
) {
  key: String!
  value: String!
}

type HTTP_Response @imported(
  uri: "ens/http.web3api.eth",
  namespace: "HTTP",
  nativeType: "Response"
) {
  status: Int!
  statusText: String!
  headers: [HTTP_Header!]
  body: String
}

enum HTTP_ResponseType @imported(
  uri: "ens/http.web3api.eth",
  namespace: "HTTP",
  nativeType: "ResponseType"
) {
  TEXT
  BINARY
}

### Imported Objects END ###
`;
