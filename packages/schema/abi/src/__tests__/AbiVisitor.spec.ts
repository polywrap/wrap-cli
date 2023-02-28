import { Abi } from "@polywrap/abi-types"
import { AbiVisitor } from ".."

describe("AbiVisitor", () => {
  it("Visits all definitions and types", () => {
    const visits = {
      Abi: 0,
      Import: 0,
      FunctionDef: 0,
      ArgumentDef: 0,
      ResultDef: 0,
      ObjectDef: 0,
      PropertyDef: 0,
      EnumDef: 0,
      ScalarType: 0,
      RefType: 0,
      ImportRefType: 0,
      ArrayType: 0,
      MapType: 0,
      AnyType: 0,
    }

    const expectedvisits = {
      Abi: 2,
      Import: 2,
      FunctionDef: 2,
      ArgumentDef: 2,
      ResultDef: 2,
      ObjectDef: 4,
      PropertyDef: 6,
      EnumDef: 2,
      ScalarType: 6,
      RefType: 2,
      ImportRefType: 2,
      ArrayType: 2,
      MapType: 2,
      AnyType: 14,
    }

    const visitor = new AbiVisitor({
      enter: {
        Abi: () => {
          visits.Abi++
        },
        Import: () => {
          visits.Import++
        },
        FunctionDef: () => {
          visits.FunctionDef++
        },
        ArgumentDef: () => {
          visits.ArgumentDef++
        },
        ResultDef: () => {
          visits.ResultDef++
        },
        ObjectDef: () => {
          visits.ObjectDef++
        },
        PropertyDef: () => {
          visits.PropertyDef++
        },
        EnumDef: () => {
          visits.EnumDef++
        },
        ScalarType: () => {
          visits.ScalarType++
        },
        RefType: () => {
          visits.RefType++
        },
        ImportRefType: () => {
          visits.ImportRefType++
        },
        ArrayType: () => {
          visits.ArrayType++
        },
        MapType: () => {
          visits.MapType++
        },
        AnyType: () => {
          visits.AnyType++
        },
      },
      leave: {
        Abi: () => {
          visits.Abi++
        },
        Import: () => {
          visits.Import++
        },
        FunctionDef: () => {
          visits.FunctionDef++
        },
        ArgumentDef: () => {
          visits.ArgumentDef++
        },
        ResultDef: () => {
          visits.ResultDef++
        },
        ObjectDef: () => {
          visits.ObjectDef++
        },
        PropertyDef: () => {
          visits.PropertyDef++
        },
        EnumDef: () => {
          visits.EnumDef++
        },
        ScalarType: () => {
          visits.ScalarType++
        },
        RefType: () => {
          visits.RefType++
        },
        ImportRefType: () => {
          visits.ImportRefType++
        },
        ArrayType: () => {
          visits.ArrayType++
        },
        MapType: () => {
          visits.MapType++
        },
        AnyType: () => {
          visits.AnyType++
        },
      }
    })
   
    const abi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          uri: "https://example.com/abi.json",
          namespace: "Example",
          type: "wasm",
          objects: [
            {
              kind: "Object",
              name: "ExampleObject",
              props: [
                {
                  kind: "Property",
                  name: "exampleProperty",
                  required: true,
                  type: {
                    kind: "Scalar",
                    scalar: "String",
                  },
                }
              ]
            }
          ]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "ExampleObject2",
          props: [
            {
              kind: "Property",
              name: "exampleProperty",
              required: true,
              type: {
                kind: "Ref",
                ref_name: "RefName",
                ref_kind: "Object",
              },
            },
            {
              kind: "Property",
              name: "exampleProperty",
              required: true,
              type: {
                import_id: "0",
                kind: "ImportRef",
                ref_name: "RefName2",
                ref_kind: "Object",
              },
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "ExampleEnum",
          constants: ["CONSTANT1", "CONSTANT2"],
        }
      ],
      functions: [
        {
          kind: "Function",
          name: "ExampleFunction",
          args: [
            {
              kind: "Argument",
              name: "exampleArgument",
              required: true,
              type: {
                kind: "Array",
                item: {
                  required: true,
                  type: {
                    kind: "Scalar",
                    scalar: "String",
                  }
                }
              }
            }
          ],
          result: {
            kind: "Result",
            required: true,
            type: {
              kind: "Map",
              key: {
                kind: "Scalar",
                scalar: "String",
              },
              value: {
                required: true,
                type: {
                  kind: "Scalar",
                  scalar: "String",
                }
              }
            }
          }
        }
      ]
    }

    visitor.visit(abi)

    expect(visits).toEqual(expectedvisits)
  })
})