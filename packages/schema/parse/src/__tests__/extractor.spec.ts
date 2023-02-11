import { parse, visit, visitInParallel } from "graphql"
import { Abi, EnumDef, FunctionDef, ObjectDef } from "../definitions"
import { EnumVisitorBuilder, FunctionsVisitorBuilder, ObjectVisitorBuilder } from "../extract"

describe("Extractors", () => {
  describe("Enums", () => {
    it("Extracts simple enum defs", () => {
      const schema = `
        enum Color {
          RED
          GREEN
          BLUE
        }

        enum Size {
          SMALL
          MEDIUM
        }
      `

      const astNode = parse(schema);
      const abi: Abi = {
        version: "0.2"
      }
      const enumExtractor = new EnumVisitorBuilder().build(abi);

      const expected: EnumDef[] = [
        {
          name: "Color",
          kind: "Enum",
          constants: ["RED", "GREEN", "BLUE"]
        },
        {
          name: "Size",
          kind: "Enum",
          constants: ["SMALL", "MEDIUM"]
        }
      ]

      visit(astNode, visitInParallel([enumExtractor]))

      expect(abi.enums).toMatchObject(expected)
    })
  })
  describe("Objects", () => {
    it("Extracts simple object defs", () => {
      const schema = `
        type Nested {
          prop: UInt8
        }
      `

      const astNode = parse(schema);
      const abi: Abi = {
        version: "0.2"
      }

      const objectExtractor = new ObjectVisitorBuilder(new Map()).build(abi);

      const expected: ObjectDef[] = [
        {
          kind: "Object",
          name: "Nested",
          props: [
            {
              kind: "Property",
              name: "prop",
              type: {
                kind: "Scalar",
                scalar: "UInt8"
              },
              required: false
            },
          ]
        }
      ]

      visit(astNode, visitInParallel([objectExtractor]))

      expect(abi.objects).toMatchObject(expected)
    })

    it("Extracts objects with ref types", () => {
      const schema = `
        type Custom {
          prop1: String!
          nested: Nested
          bar: Bar
        }
        
        type Nested {
          prop: UInt8
        }
      `

      const astNode = parse(schema);
      const abi: Abi = {
        version: "0.2"
      }
      const uniqueDefs = new Map([
        ["Custom", "Object" as const],
        ["Nested", "Object" as const],
        ["Bar", "Enum" as const]
      ])
      const objectExtractor = new ObjectVisitorBuilder(uniqueDefs).build(abi);

      const expected: ObjectDef[] = [
        {
          kind: "Object",
          name: "Custom",
          props: [
            {
              kind: "Property",
              name: "prop1",
              type: {
                kind: "Scalar",
                scalar: "String"
              },
              required: true
            },
            {
              kind: "Property",
              name: "nested",
              type: {
                kind: "Ref",
                ref_name: "Nested",
                ref_kind: "Object"
              },
              required: false
            },
            {
              kind: "Property",
              name: "bar",
              type: {
                kind: "Ref",
                ref_name: "Bar",
                ref_kind: "Enum"
              },
              required: false
            }
          ]
        },
        {
          kind: "Object",
          name: "Nested",
          props: [
            {
              kind: "Property",
              name: "prop",
              type: {
                kind: "Scalar",
                scalar: "UInt8"
              },
              required: false
            },
          ]
        }
      ]

      visit(astNode, visitInParallel([objectExtractor]))

      expect(abi.objects).toMatchObject(expected)
    })

    it("Extracts objects with array types", () => {
      const schema = `
        type Custom {
          prop1: String!
          nested: [Nested!]!
        }
        
        type Nested {
          prop: [UInt8]
        }
      `

      const astNode = parse(schema);
      const abi: Abi = {
        version: "0.2"
      }
      const uniqueDefs = new Map([
        ["Custom", "Object" as const],
        ["Nested", "Object" as const]
      ])
      const objectExtractor = new ObjectVisitorBuilder(uniqueDefs).build(abi);

      const expected: ObjectDef[] = [
        {
          kind: "Object",
          name: "Custom",
          props: [
            {
              kind: "Property",
              name: "prop1",
              type: {
                kind: "Scalar",
                scalar: "String"
              },
              required: true
            },
            {
              kind: "Property",
              name: "nested",
              type: {
                kind: "Array",
                item: {
                  required: true,
                  type: {
                    kind: "Ref",
                    ref_name: "Nested",
                    ref_kind: "Object"
                  }
                }
              },
              required: true
            }
          ]
        },
        {
          kind: "Object",
          name: "Nested",
          props: [
            {
              kind: "Property",
              name: "prop",
              type: {
                kind: "Array",
                item: {
                  required: false,
                  type: {
                    kind: "Scalar",
                    scalar: "UInt8"
                  }

                }
              },
              required: false
            }
          ]
        }
      ]

      visit(astNode, visitInParallel([objectExtractor]))

      expect(abi.objects).toMatchObject(expected)
    })
    
    it("Extracts objects with map types", () => {
      const schema = `
        type Custom {
          nested: Map! @annotate(type: "Map<String, [Nested!]!>")
        }
        
        type Nested {
          prop: Map @annotate(type: "Map<UInt8, UInt8>")
        }
      `

      const astNode = parse(schema);
      const abi: Abi = {
        version: "0.2"
      }
      const uniqueDefs = new Map([
        ["Custom", "Object" as const],
        ["Nested", "Object" as const]
      ])
      const objectExtractor = new ObjectVisitorBuilder(uniqueDefs).build(abi);

      const expected: ObjectDef[] = [
        {
          kind: "Object",
          name: "Custom",
          props: [
            {
              kind: "Property",
              name: "nested",
              type: {
                kind: "Map",
                key: {
                  kind: "Scalar",
                  scalar: "String"
                },
                value: {
                  required: true,
                  type: {
                    kind: "Array",
                    item: {
                      required: true,
                      type: {
                        kind: "Ref",
                        ref_name: "Nested",
                        ref_kind: "Object"
                      }
                    }
                  }
                }
              },
              required: true
            }
          ]
        },
        {
          kind: "Object",
          name: "Nested",
          props: [
            {
              kind: "Property",
              name: "prop",
              type: {
                kind: "Map",
                key: {
                  kind: "Scalar",
                  scalar: "UInt8"
                },
                value: {
                  required: false,
                  type: {
                    kind: "Scalar",
                    scalar: "UInt8"
                  }
                }
              },
              required: false
            }
          ]
        }
      ]

      visit(astNode, visitInParallel([objectExtractor]))

      expect(abi.objects).toMatchObject(expected)
    })
  })
  describe("Functions", () => {
    it("Extract simple functions defs", () => {
      const schema = `
        type Module {
          fooFunc(
            arg: String!
          ): String!
        }
      `

      const astNode = parse(schema);
      const abi: Abi = {
        version: "0.2"
      }
      const functionsExtractor = new FunctionsVisitorBuilder(new Map()).build(abi);

      const expected: FunctionDef[] = [
        {
          kind: "Function",
          name: "fooFunc",
          args: [
            {
              kind: "Argument",
              name: "arg",
              type: {
                kind: "Scalar",
                scalar: "String"
              },
              required: true,
            }
          ],
          result: {
            kind: "Result",
            type: {
              kind: "Scalar",
              scalar: "String"
            },
            required: true
          }
        }
      ]

      visit(astNode, visitInParallel([functionsExtractor]))

      expect(abi.functions).toMatchObject(expected)
    })
  })
})