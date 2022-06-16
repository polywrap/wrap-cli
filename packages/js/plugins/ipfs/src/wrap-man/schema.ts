/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

export const schema = `### Polywrap Header START ###
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

### Polywrap Header END ###

type Module implements UriResolver_Module @imports(
  types: [
    "UriResolver_Module",
    "UriResolver_MaybeUriOrManifest"
  ]
) {
  catFile(
    cid: String!
    options: Options
  ): Bytes!

  resolve(
    cid: String!
    options: Options
  ): ResolveResult

  tryResolveUri(
    authority: String!
    path: String!
  ): UriResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes

  addFile(
    data: Bytes!
  ): String!
}

type Env {
  """
  Disable querying providers in parallel when resolving URIs
  """
  disableParallelRequests: Boolean
}

type ResolveResult {
  cid: String!
  provider: String!
}

type Options {
  """
  Timeout (in ms) for the operation.
Fallback providers are used if timeout is reached.
  """
  timeout: UInt32
  """
  The IPFS provider to be used
  """
  provider: String
  """
  Disable querying providers in parallel when resolving URIs
  """
  disableParallelRequests: Boolean
}

### Imported Modules START ###

type UriResolver_Module @imported(
  uri: "ens/uri-resolver.core.polywrap.eth",
  namespace: "UriResolver",
  nativeType: "Module"
) {
  tryResolveUri(
    authority: String!
    path: String!
  ): UriResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes
}

### Imported Modules END ###

### Imported Objects START ###

type UriResolver_MaybeUriOrManifest @imported(
  uri: "ens/uri-resolver.core.polywrap.eth",
  namespace: "UriResolver",
  nativeType: "MaybeUriOrManifest"
) {
  uri: String
  manifest: String
}

### Imported Objects END ###
`;
