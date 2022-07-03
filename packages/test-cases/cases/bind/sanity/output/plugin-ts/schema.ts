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
scalar BigFraction
scalar Fraction
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

type Module @imports(
  types: [
    "TestImport_Module",
    "TestImport_Object",
    "TestImport_AnotherObject",
    "TestImport_Enum"
  ]
) @capability(
  type: "getImplementations",
  uri: "testimport.uri.eth",
  namespace: "TestImport"
) {
  moduleMethod(
    str: String!
    optStr: String
    en: CustomEnum!
    optEnum: CustomEnum
    enumArray: [CustomEnum!]!
    optEnumArray: [CustomEnum]
    map: Map! @annotate(type: "Map<String!, Int!>!")
  ): Int!

  objectMethod(
    object: AnotherType!
    optObject: AnotherType
    objectArray: [AnotherType!]!
    optObjectArray: [AnotherType]
  ): AnotherType
}

type Env {
  prop: String!
  optProp: String
  optMap: Map @annotate(type: "Map<String!, Int>")
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
  bignumber: BigNumber!
  optBignumber: BigNumber
  bigfraction: BigFraction!
  optBigfraction: BigFraction
  fraction: Fraction! @annotate(type: "Fraction<Int32!>!")
  optFraction: Fraction @annotate(type: "Fraction<Int32!>")
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

### Imported Modules START ###

type TestImport_Module @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Module"
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

### Imported Modules END ###

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
