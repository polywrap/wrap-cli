export const schema: string = `### Web3API Header START ###
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
scalar JSON

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
### Web3API Header END ###

type Query @imports(
  types: [
    "TestImport_Query",
    "TestImport_Object",
    "TestImport_AnotherObject",
    "TestImport_Enum"
  ]
) @capability(
  type: "getImplementations",
  uri: "testimport.uri.eth",
  namespace: "TestImport"
) {
  queryMethod(
    str: String!
    optStr: String
    en: CustomEnum!
    optEnum: CustomEnum
    enumArray: [CustomEnum!]!
    optEnumArray: [CustomEnum]
  ): Int!

  objectMethod(
    object: AnotherType!
    optObject: AnotherType
    objectArray: [AnotherType!]!
    optObjectArray: [AnotherType]
  ): AnotherType
}

type Mutation @imports(
  types: [
    "TestImport_Query",
    "TestImport_Object",
    "TestImport_AnotherObject",
    "TestImport_Enum",
    "TestImport_Mutation"
  ]
) {
  mutationMethod(
    str: String!
    optStr: String
    en: CustomEnum!
    optEnum: CustomEnum
    enumArray: [CustomEnum!]!
    optEnumArray: [CustomEnum]
  ): Int!

  objectMethod(
    object: AnotherType!
    optObject: AnotherType
    objectArray: [AnotherType!]!
    optObjectArray: [AnotherType]
  ): AnotherType
}

type QueryEnv {
  queryProp: String!
  prop: String!
  optProp: String
}

type MutationEnv {
  mutProp: String!
  prop: String!
  optProp: String
}

type CustomType {
  str: String!
  optStr: String
  u: UInt!
  optU: UInt
  u8: UInt8!
  u16: UInt16!
  u32: UInt32!
  i: Int!
  i8: Int8!
  i16: Int16!
  i32: Int32!
  bigint: BigInt!
  optBigint: BigInt
  json: JSON!
  optJson: JSON
  bytes: Bytes!
  optBytes: Bytes
  boolean: Boolean!
  optBoolean: Boolean
  uArray: [UInt!]!
  uOptArray: [UInt!]
  optUOptArray: [UInt]
  optStrOptArray: [String]
  uArrayArray: [[UInt!]!]!
  uOptArrayOptArray: [[UInt32]]!
  uArrayOptArrayArray: [[[UInt32!]!]]!
  crazyArray: [[[[UInt32!]]!]]
  object: AnotherType!
  optObject: AnotherType
  objectArray: [AnotherType!]!
  optObjectArray: [AnotherType]
  en: CustomEnum!
  optEnum: CustomEnum
  enumArray: [CustomEnum!]!
  optEnumArray: [CustomEnum]
}

type AnotherType {
  prop: String
  circular: CustomType
  const: String
}

enum CustomEnum {
  STRING
  BYTES
}

### Imported Queries START ###

type TestImport_Query @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Query"
) @enabled_interface {
  importedMethod(
    str: String!
    optStr: String
    u: UInt!
    optU: UInt
    uArrayArray: [[UInt]]!
    object: TestImport_Object!
    optObject: TestImport_Object
    objectArray: [TestImport_Object!]!
    optObjectArray: [TestImport_Object]
    en: TestImport_Enum!
    optEnum: TestImport_Enum
    enumArray: [TestImport_Enum!]!
    optEnumArray: [TestImport_Enum]
  ): TestImport_Object

  anotherMethod(
    arg: [String!]!
  ): Int32!
}

type TestImport_Mutation @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Mutation"
) {
  importedMethod(
    str: String!
    object: TestImport_Object!
    objectArray: [TestImport_Object!]!
  ): TestImport_Object

  anotherMethod(
    arg: [String!]!
  ): Int32!
}

### Imported Queries END ###

### Imported Objects START ###

type TestImport_Object @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Object"
) {
  object: TestImport_AnotherObject!
  optObject: TestImport_AnotherObject
  objectArray: [TestImport_AnotherObject!]!
  optObjectArray: [TestImport_AnotherObject]
  en: TestImport_Enum!
  optEnum: TestImport_Enum
  enumArray: [TestImport_Enum!]!
  optEnumArray: [TestImport_Enum]
}

type TestImport_AnotherObject @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "AnotherObject"
) {
  prop: String!
}

enum TestImport_Enum @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Enum"
) {
  STRING
  BYTES
}

### Imported Objects END ###
`;
