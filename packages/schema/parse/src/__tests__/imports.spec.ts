import { AbiMerger } from "../AbiMerger"
import { Abi } from "../definitions"
import { LocalImportsLinker } from "../imports"
import { ExternalImportStatement, LocalImportStatement, SchemaParser } from "../types"

describe("Imports parser", () => {
  it("Works", async () => {

    const rootSchema = `
      import { Foo } from "foo"
      import { ExtFoo } into Ext from "extfoo"

      type Baz {
        extfoo: Ext_ExtFoo!
        foo: Foo!
      }
    `

    const fooSchema = `
      import { Bar } from "bar"
      import { OutBar } into Out from "outbar"

      type Some {
        propSome: Out_OutBar!
      }

      type Additional {
        bar: NamespaceBar_Bar!
      }

      type Foo {
        propFoo: Additional!
        prop2: Some!
      }
    `

    const barSchema = `
      type Bar {
        propBar: Transitive!
      }

      type Transitive {
        propTransitive: String!
      }
    `

    const fetchers = {
      external: async (uri: string): Promise<Abi> => {
        switch (uri) {
          case "extfoo": return {
            version: "0.2",
            objects: [{
              kind: "Object",
              name: "ExtFoo",
              props: [{
                kind: "Property",
                name: "propExtFoo",
                required: true,
                type: {
                  kind: "Scalar",
                  scalar: "String"
                }
              }]
            }]
          }
          case "outbar": return {
            version: "0.2",
            objects: [{
              kind: "Object",
              name: "OutBar",
              props: [{
                kind: "Property",
                name: "propOutBar",
                required: true,
                type: {
                  kind: "Scalar",
                  scalar: "String"
                }
              }]
            }]
          }
          default: throw new Error(`Unknown URI: ${uri}`)
        }
      },
      local: async (path: string): Promise<string> => {
        switch (path) {
          case "foo": return fooSchema
          case "bar": return barSchema
          default: throw new Error(`Unknown path: ${path}`)
        }
      }
    }

    const mockSchemaParser: SchemaParser = {
      parse: async (schema: string): Promise<Abi> => {
        switch (schema) {
          case rootSchema: return {
            version: "0.2",
            functions: [],
            enums: [],
            objects: [{
              kind: "Object",
              props: [{
                kind: "Property",
                name: "extfoo",
                required: true,
                type: {
                  kind: "UnlinkedImportRef",
                  ref_name: "ExtFoo",
                }
              }, {
                kind: "Property",
                name: "foo",
                required: true,
                type: {
                  kind: "UnlinkedImportRef",
                  ref_name: "Foo",
                }
              }],
              name: "Baz",
            }]
          };
          case fooSchema: return {
            version: "0.2",
            functions: [],
            enums: [],
            objects: [{
              kind: "Object",
              name: "Some",
              props: [{
                kind: "Property",
                name: "propSome",
                required: true,
                type: {
                  kind: "UnlinkedImportRef",
                  ref_name: "OutBar",
                }
              }]
            }, {
              kind: "Object",
              name: "Additional",
              props: [{
                kind: "Property",
                name: "bar",
                required: true,
                type: {
                  kind: "UnlinkedImportRef",
                  ref_name: "Bar",
                }
              }]
            }, {
              kind: "Object",
              name: "Foo",
              props: [{
                kind: "Property",
                name: "propFoo",
                required: true,
                type: {
                  kind: "Ref",
                  ref_kind: "Object",
                  ref_name: "Additional",
                }
              }, {
                kind: "Property",
                name: "prop2",
                required: true,
                type: {
                  kind: "Ref",
                  ref_kind: "Object",
                  ref_name: "Some",
                }
              }]
            }]
          }
          case barSchema: return {
            version: "0.2",
            functions: [],
            enums: [],
            objects: [{
              kind: "Object",
              name: "Bar",
              props: [{
                kind: "Property",
                name: "propBar",
                required: true,
                type: {
                  kind: "Ref",
                  ref_kind: "Object",
                  ref_name: "Transitive"
                }
              }]
            }, {
              kind: "Object",
              name: "Transitive",
              props: [{
                kind: "Property",
                name: "propTransitive",
                required: true,
                type: {
                  kind: "Scalar",
                  scalar: "String"
                }
              }]
            }]
          }
          default: throw new Error(`Unknown schema: ${schema}`)
        }
      },
      parseExternalImportStatements: async (schema: string): Promise<ExternalImportStatement[]> => {
        switch (schema) {
          case rootSchema: return [{
            kind: "external",
            uriOrPath: "extfoo",
            importedTypes: ["ExtFoo"],
            namespace: "Ext"
          }]
          case fooSchema: return [{
            kind: "external",
            uriOrPath: "outbar",
            importedTypes: ["OutBar"],
            namespace: "Out"
          }]
          case barSchema: return [];
          default: throw new Error(`Unknown schema: ${schema}`)
        }
      },
      parseLocalImportStatements: async (schema: string): Promise<LocalImportStatement[]> => {
        switch (schema) {
          case rootSchema: return [{
            kind: "local",
            uriOrPath: "foo",
            importedTypes: ["Foo"],
          }]
          case fooSchema: return [{
            kind: "local",
            uriOrPath: "bar",
            importedTypes: ["Bar"],
          }]
          case barSchema: return [];
          default: throw new Error(`Unknown schema: ${schema}`)
        }
      }
    }

    const importsParser = new LocalImportsLinker(mockSchemaParser, fetchers, new AbiMerger())
    const { abi, externalImportStatements } = await importsParser.link(rootSchema)

    const expectedAbi: Abi = {
      version: "0.2",
      functions: [],
      enums: [],
      objects: [{
        kind: "Object",
        props: [{
          kind: "Property",
          name: "extfoo",
          required: true,
          type: {
            kind: "UnlinkedImportRef",
            ref_name: "ExtFoo",
          }
        }, {
          kind: "Property",
          name: "foo",
          required: true,
          type: {
            kind: "UnlinkedImportRef",
            ref_name: "Foo",
          }
        }],
        name: "Baz",
      },
      {
        kind: "Object",
        name: "Foo",
        props: [{
          kind: "Property",
          name: "propFoo",
          required: true,
          type: {
            kind: "Ref",
            ref_kind: "Object",
            ref_name: "Additional",
          }
        }, {
          kind: "Property",
          name: "prop2",
          required: true,
          type: {
            kind: "Ref",
            ref_kind: "Object",
            ref_name: "Some",
          }
        }]
      }, {
        kind: "Object",
        name: "Additional",
        props: [{
          kind: "Property",
          name: "bar",
          required: true,
          type: {
            kind: "UnlinkedImportRef",
            ref_name: "Bar",
          }
        }]
      }, {
        kind: "Object",
        name: "Some",
        props: [{
          kind: "Property",
          name: "propSome",
          required: true,
          type: {
            kind: "UnlinkedImportRef",
            ref_name: "OutBar",
          }
        }]
      },
      {
        kind: "Object",
        name: "Bar",
        props: [{
          kind: "Property",
          name: "propBar",
          required: true,
          type: {
            kind: "Ref",
            ref_kind: "Object",
            ref_name: "Transitive"
          }
        }]
      }, {
        kind: "Object",
        name: "Transitive",
        props: [{
          kind: "Property",
          name: "propTransitive",
          required: true,
          type: {
            kind: "Scalar",
            scalar: "String"
          }
        }]
      }
      ]
    }

    expect(abi).toEqual(expectedAbi)
    console.log(externalImportStatements)
  })
})