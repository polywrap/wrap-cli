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
### Web3API Header END ###

type Query @imports(
  types: [
    "TestImport_Query",
    "TestImport_Object",
    "TestImport_AnotherObject",
    "TestImport_Enum",
    "TestImport_YetAnotherObject",
    "TestImport_Union"
  ]
) {
  queryMethod(
    str: String!
    optStr: String
    en: CustomEnum!
    optEnum: CustomEnum
    enumArray: [CustomEnum!]!
    optEnumArray: [CustomEnum]
    union: CustomUnion!
    optUnion: CustomUnion
    unionArray: [CustomUnion!]!
    optUnionArray: [CustomUnion]
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
    "TestImport_YetAnotherObject",
    "TestImport_Union",
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
    union: CustomUnion!
    optUnion: CustomUnion
    unionArray: [CustomUnion!]!
    optUnionArray: [CustomUnion]
  ): Int!

  objectMethod(
    object: AnotherType!
    optObject: AnotherType
    objectArray: [AnotherType!]!
    optObjectArray: [AnotherType]
  ): AnotherType
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
  union: CustomUnion!
  optUnion: CustomUnion
  unionArray: [CustomUnion!]!
  optUnionArray: [CustomUnion]
}

type AnotherType {
  prop: String
  circular: CustomType
}

type AnotherObject {
  prop: String!
}

type YetAnotherObject {
  prop: Boolean!
}

enum CustomEnum {
  STRING
  BYTES
}

union CustomUnion =
| AnotherObject
| YetAnotherObject

### Imported Queries START ###

type TestImport_Query @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Query"
) {
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
    union: TestImport_Union!
    optUnion: TestImport_Union
    unionArray: [TestImport_Union!]!
    optUnionArray: [TestImport_Union]
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
  union: TestImport_Union!
  optUnion: TestImport_Union
  unionArray: [TestImport_Union!]!
  optUnionArray: [TestImport_Union]
}

type TestImport_AnotherObject @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "AnotherObject"
) {
  prop: String!
}

type TestImport_YetAnotherObject @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "YetAnotherObject"
) {
  prop: Boolean!
}

enum TestImport_Enum @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Enum"
) {
  STRING
  BYTES
}

union TestImport_Union @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Union"
) =
| TestImport_AnotherObject
| TestImport_YetAnotherObject

### Imported Objects END ###
`;
