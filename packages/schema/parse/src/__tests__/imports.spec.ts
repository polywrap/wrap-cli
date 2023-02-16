import { UniqueDefKind } from "../definitions"
import { ImportsParser } from "../imports"
import { ExternalImportStatement, SchemaParser } from "../types"
import { UnlinkedAbiDefs } from "../UnlinkedDefs"

describe("Imports parser", () => {
  it("Works", async () => {

    const rootSchema = `
      import { Foo } into NamespaceFoo from "foo"

      type Baz {
        foo: NamespaceFoo_Foo!
        prop: String!
      }
    `

    const fooSchema = `
      import { Bar } into NamespaceBar from "bar"

      type Some {
        propSome: String!
      }

      type Additional {
        bar: NamespaceBar_Bar!
      }

      type Foo {
        propFoo: Additional!
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
      external: async (uri: string): Promise<string> => {
        switch (uri) {
          case "foo": return fooSchema
          case "bar": return barSchema
          case "root": return rootSchema
          default: throw new Error(`Unknown URI: ${uri}`)
        }
      }
    }

    const mockSchemaParser: SchemaParser = {
      getImportedSchemasTable: (schema: string, schemaPath: string): Promise<Map<string, string>> => {
        throw new Error("Unimplemented getImportedSchemasTable")
      },
      getUniqueDefinitionsTable: (schema: string): Promise<Map<string, UniqueDefKind>> => {
        throw new Error("Unimplemented getUniqueDefinitionsTable")
      },
      getImportStatements: async (schema: string): Promise<ExternalImportStatement[]> => {
        throw new Error("Unimplemented getImportStatements")
      },
      parse: async (schema: string): Promise<UnlinkedAbiDefs> => {
        switch (schema) {
          case rootSchema: return {
            objects: [{
              kind: "Object",
              props: [{
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
            objects: [{
              kind: "Object",
              name: "Some",
              props: [{
                kind: "Property",
                name: "propFoo",
                required: true,
                type: {
                  kind: "Scalar",
                  scalar: "String"
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
              }]
            }]
          }
          case barSchema: return {
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
            uriOrPath: "foo",
            importedTypes: ["Foo"],
            namespace: "NamespaceFoo"
          }]
          case fooSchema: return [{
            kind: "external",
            uriOrPath: "bar",
            importedTypes: ["Bar"],
            namespace: "NamespaceBar"
          }]
          case barSchema: return [];
          default: throw new Error(`Unknown schema: ${schema}`)
        }
      }
    }

    const importsParser = new ImportsParser(mockSchemaParser, fetchers)
    const { definitionDependencyTree, schemaDependencyTree } = await importsParser.getImports(rootSchema, mockSchemaParser)
    
    console.log(JSON.stringify(definitionDependencyTree, null, 2))
    console.log(JSON.stringify(schemaDependencyTree, null, 2))

    console.log(definitionDependencyTree.getAllDependencies(["Foo"]))
  })
})