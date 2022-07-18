/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

export const schema: string = `### Polywrap Header START ###
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

directive @env(required: Boolean!) on FIELD_DEFINITION

### Polywrap Header END ###

type Module implements FileSystem_Module @imports(
  types: [
    "FileSystem_Module",
    "FileSystem_Encoding"
  ]
) {
  readFile(
    path: String!
  ): Bytes!

  readFileAsString(
    path: String!
    encoding: FileSystem_Encoding
  ): String!

  exists(
    path: String!
  ): Boolean!

  writeFile(
    path: String!
    data: Bytes!
  ): Boolean

  mkdir(
    path: String!
    recursive: Boolean
  ): Boolean

  rm(
    path: String!
    recursive: Boolean
    force: Boolean
  ): Boolean

  rmdir(
    path: String!
  ): Boolean
}

### Imported Modules START ###

type FileSystem_Module @imported(
  uri: "ens/fs.polywrap.eth",
  namespace: "FileSystem",
  nativeType: "Module"
) {
  readFile(
    path: String!
  ): Bytes!

  readFileAsString(
    path: String!
    encoding: FileSystem_Encoding
  ): String!

  exists(
    path: String!
  ): Boolean!

  writeFile(
    path: String!
    data: Bytes!
  ): Boolean

  mkdir(
    path: String!
    recursive: Boolean
  ): Boolean

  rm(
    path: String!
    recursive: Boolean
    force: Boolean
  ): Boolean

  rmdir(
    path: String!
  ): Boolean
}

### Imported Modules END ###

### Imported Objects START ###

enum FileSystem_Encoding @imported(
  uri: "ens/fs.polywrap.eth",
  namespace: "FileSystem",
  nativeType: "Encoding"
) {
  ASCII
  UTF8
  UTF16LE
  UCS2
  BASE64
  BASE64URL
  LATIN1
  BINARY
  HEX
}

### Imported Objects END ###

### Imported Envs START ###

### Imported Envs END ###
`;
