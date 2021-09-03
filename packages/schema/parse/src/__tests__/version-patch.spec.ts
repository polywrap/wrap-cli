import { compare } from "../version_compare";
import { parseSchema, TypeInfo } from "..";
import { VersionRelease } from "../version_compare/comparators";

const schemas_1: string[] = [
  `
  type Vehicle {
    price: Int
    model: String!
    brand: String
    }
  `,
  `
  type Vehicle {
    price: Int
    model: String!
    brand: String
  }
  `,
];

const schemas_2: string[] = [
  `
  type Vehicle {
    price: Int  # price of the vehicle
    model: String!
    brand: String
  }
  `,
  `
  type Vehicle {
    """ 
    Vehicle type
    """
    price: Int  # price of the vehicle in ETH
    model: String!  # model of the vehicle
    brand: String
  }
  `,
];

const schemas_3: string[] = [
  `
  type Vehicle {
    price: Int  # price of the vehicle
    model: String!
    brand: String
  }

  enum VehicleType {
    CAR,
    TRUCK,
    BUS
  }
  `,
  `
  type Vehicle {
    """ 
    Vehicle type reordered
    """
    brand: String
    price: Int  # price of the vehicle in ETH
    model: String!  # model of the vehicle
  }

  enum VehicleType {
    """
    reordered
    """
    BUS,
    CAR,
    TRUCK
  }
  `,
];

const schemas_4: string[] = [
  `
  scalar Int
  scalar Int8
  scalar Int16
  scalar Int32
  scalar Bytes
  scalar BigInt
  
  directive @imported(
    namespace: String!
    nativeType: String!
    uri: String!
  ) on OBJECT | ENUM
  
  directive @imports(
      types: [String!]!
  ) on OBJECT
  
  type Interface_Query @imported(
    uri: "interface.uri.eth",
    namespace: "Interface",
    nativeType: "Query"
  ) {
    abstractMethod(
      arg: UInt8!
    ): String!
  }
  
  type TestImport_Query @imported(
    uri: "testimport.uri.eth",
    namespace: "TestImport",
    nativeType: "Query"
  ) {
    importedMethod(
      u: UInt!
      optU: UInt
      str: String!
      optStr: String
      uArrayArray: [[UInt]]!
    ): String!
  }
  
  type Query implements Interface_Query @imports(
    types: [ "TestImport_Query", "Interface_Query" ]
  ) {
    queryMethod(
      arg: String!
    ): [Int]!
  }
  `,
  `
  scalar Int
  scalar Int8
  scalar Int16
  scalar Int32
  scalar Bytes
  scalar BigInt
  
  directive @imported(
    uri: String!
    namespace: String!
    nativeType: String!
  ) on OBJECT | ENUM
  
  directive @imports(
      types: [String!]!
  ) on OBJECT
  
  type Interface_Query @imported(
    uri: "interface.uri.eth",
    namespace: "Interface",
    nativeType: "Query"
  ) {
    abstractMethod(
      arg: UInt8!
    ): String!
  }
  
  type TestImport_Query @imported(
    uri: "testimport.uri.eth",
    namespace: "TestImport",
    nativeType: "Query"
  ) {
    importedMethod(
      u: UInt!
      optU: UInt
      str: String!
      optStr: String
      uArrayArray: [[UInt]]!
    ): String!
  }
  
  type Query implements Interface_Query @imports(
    types: [ "TestImport_Query", "Interface_Query" ]
  ) {
    queryMethod(
      arg: String!
    ): [Int]!
  }
  `,
];

const schemas_5: string[] = [
  `
  type Vehicle {
    price: Int
    model: String!
    brand: String
    }
  `,
  `
  type Vehicle {
    price: Int
    model: String  # required to optional
    brand: String
  }
  `,
];

describe("PATCH version release comparision", () => {
  it("sanity check", () => {
    // Exactly equal schemas
    const t1: TypeInfo = parseSchema(schemas_1[0]);
    const t2: TypeInfo = parseSchema(schemas_1[1]);

    expect(compare(t1, t2)).toBe(VersionRelease.PATCH);
  });

  it("different comments", () => {
    const t1: TypeInfo = parseSchema(schemas_2[0]);
    const t2: TypeInfo = parseSchema(schemas_2[1]);

    expect(compare(t1, t2)).toBe(VersionRelease.PATCH);
  });

  it("re-ordering shouldn't change Version type", () => {
    const t1: TypeInfo = parseSchema(schemas_3[0]);
    const t2: TypeInfo = parseSchema(schemas_3[1]);

    expect(compare(t1, t2)).toBe(VersionRelease.PATCH);
  });

  it("schema with imports and queries", () => {
    const t1: TypeInfo = parseSchema(schemas_4[0]);
    const t2: TypeInfo = parseSchema(schemas_4[1]);

    expect(compare(t1, t2)).toBe(VersionRelease.PATCH);
  });

  it("change required field to optional", () => {
    const t1: TypeInfo = parseSchema(schemas_5[0]);
    const t2: TypeInfo = parseSchema(schemas_5[1]);

    expect(compare(t1, t2)).toBe(VersionRelease.PATCH);
  });
});
