import { Abi, ExternalImportStatement, LocalImportStatement, SchemaParser } from "@polywrap/abi-types"
import { AbiImportsLinker } from "../AbiImportsLinker"
import { AbiMerger } from "../AbiMerger"
import { AbiSanitizer } from "../AbiSanitizer"
import { AbiTreeShaker } from "../AbiTreeShaker"
import { mockFetchers, mockSchemaParser } from "./mocks"

describe("AbiImportsLinker", () => {
  const merger = new AbiMerger()
  const shaker = new AbiTreeShaker(merger)
  const sanitizer = new AbiSanitizer()

  it("Should extract unique definitions", () => {
    const abi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "OutBar",
              }
            }
          ]
        },
        {
          kind: "Object",
          name: "Some2",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "OutBar",
              }
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "Foo",
          constants: ["ONE", "TWO"]
        }
      ],
    }

    const linker = new AbiImportsLinker(mockSchemaParser(), mockFetchers(), merger, shaker)
    const uniqueDefinitions = linker.getUniqueDefinitionsMap(abi)
    const expectedUniqueDefinitions = new Map([
      ["Some", "Object"],
      ["Some2", "Object"],
      ["Foo", "Enum"]
    ])

    expect(uniqueDefinitions).toEqual(expectedUniqueDefinitions)
  })

  it("Should map imports to namespace paths", async () => {
    const abi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          uri: "foo.eth",
          type: "wasm",
          namespace: "FOO",
          imports: [
            {
              id: "1",
              uri: "bar.eth",
              type: "wasm",
              namespace: "BAR",
              imports: [
                {
                  id: "2",
                  uri: "baz.eth",
                  type: "wasm",
                  namespace: "BAZ",
                }
              ],
            }
          ],
        }
      ]
    }

    const fooImport = {
      id: "0",
      uri: "foo.eth",
      type: "wasm",
      namespace: "FOO",
      imports: [
        {
          id: "1",
          uri: "bar.eth",
          type: "wasm",
          namespace: "BAR",
          imports: [
            {
              id: "2",
              uri: "baz.eth",
              type: "wasm",
              namespace: "BAZ",
            }
          ],
        }
      ],
    };

    const barImport = {
      id: "1",
      uri: "bar.eth",
      type: "wasm",
      namespace: "BAR",
      imports: [
        {
          id: "2",
          uri: "baz.eth",
          type: "wasm",
          namespace: "BAZ",
        }
      ],
    };

    const bazImport = {
      id: "2",
      uri: "baz.eth",
      type: "wasm",
      namespace: "BAZ",
    }

    const expectedMapping = new Map([
      ["FOO", { abi: fooImport, absoluteIdPath: "0" }],
      ["FOO_BAR", { abi: barImport, absoluteIdPath: "0.1" }],
      ["FOO_BAR_BAZ", { abi: bazImport, absoluteIdPath: "0.1.2" }]
    ])

    const linker = new AbiImportsLinker(mockSchemaParser(), mockFetchers(), merger, shaker)
    const mapping = linker.mapImportsToNamespacePaths(abi);

    expect(mapping).toEqual(expectedMapping)
  })

  it("Should merge local imports", async () => {
    const abi: Abi = {
      version: "0.2",
    }

    const localAbi1: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        },
        {
          kind: "Object",
          name: "WillBeShakenObj",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        }
      ]
    }

    const localAbi2: Abi = {
      version: "0.2",
      enums: [
        {
          kind: "Enum",
          name: "Foo",
          constants: ["ONE", "TWO"]
        },
        {
          kind: "Enum",
          name: "WillBeShakenEnum",
          constants: ["THREE", "FOUR"]
        }
      ]
    }

    const expectedAbi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "Foo",
          constants: ["ONE", "TWO"]
        }
      ]
    }

    const localImportStatements: LocalImportStatement[] = [
      {
        kind: "local",
        uriOrPath: "local1",
        importedTypes: ["Some"]
      },
      {
        kind: "local",
        uriOrPath: "local2",
        importedTypes: ["Foo"]
      },
    ]

    const fetchers = {
      external: {
        fetch: jest.fn(),
      },
      local: {
        fetch: (uriOrPath: string) => Promise.resolve(uriOrPath)
      }
    }

    const parser: SchemaParser = {
      parse: (uriOrPath: string) => {
        if (uriOrPath === "local1") {
          return Promise.resolve(localAbi1)
        } else {
          return Promise.resolve(localAbi2)
        }
      },
      parseLocalImportStatements: (_: string) => Promise.resolve([]),
      parseExternalImportStatements: (_: string) => Promise.resolve([]),
    }
    const linker = new AbiImportsLinker(parser, fetchers, merger, shaker)
    const mergedAbi = await linker.mergeLocalImports(abi, localImportStatements)

    expect(sanitizer.sanitizeAbi(mergedAbi.abi)).toEqual(expectedAbi)
  })

  it("Should merge local transitive imports", async () => {
    const abi: Abi = {
      version: "0.2",
    }

    const localAbi1: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        },
        {
          kind: "Object",
          name: "WillBeShakenObj",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        }
      ]
    }

    const localAbi2: Abi = {
      version: "0.2",
      enums: [
        {
          kind: "Enum",
          name: "Foo",
          constants: ["ONE", "TWO"]
        },
        {
          kind: "Enum",
          name: "WillBeShakenEnum",
          constants: ["THREE", "FOUR"]
        }
      ]
    }

    const expectedAbi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "Foo",
          constants: ["ONE", "TWO"]
        }
      ]
    }

    const localImportStatements: LocalImportStatement[] = [
      {
        kind: "local",
        uriOrPath: "local1",
        importedTypes: ["Some"]
      }
    ]

    const fetchers = {
      external: {
        fetch: jest.fn(),
      },
      local: {
        fetch: (uriOrPath: string) => Promise.resolve(uriOrPath)
      }
    }

    const parser: SchemaParser = {
      parse: (uriOrPath: string) => {
        if (uriOrPath === "local1") {
          return Promise.resolve(localAbi1)
        } else {
          return Promise.resolve(localAbi2)
        }
      },
      parseLocalImportStatements: (uriOrPath: string) => {
        if (uriOrPath === "local1") {
          return Promise.resolve([
            {
              kind: "local",
              uriOrPath: "local2",
              importedTypes: ["Foo"]
            }
          ])
        }
        return Promise.resolve([])
      },
      parseExternalImportStatements: (_: string) => Promise.resolve([]),
    }
    const linker = new AbiImportsLinker(parser, fetchers, merger, shaker)
    const mergedAbi = await linker.mergeLocalImports(abi, localImportStatements)

    expect(sanitizer.sanitizeAbi(mergedAbi.abi)).toEqual(expectedAbi)
  })

  it("Should embed external imports", async () => {
    const abi: Abi = {
      version: "0.2",
    }

    const extAbi1: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          type: "wasm",
          uri: "ext1",
          namespace: "BAR",
          enums: [
            {
              kind: "Enum",
              name: "Bar",
              constants: ["ONE", "TWO"]
            }
          ]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        },
        {
          kind: "Object",
          name: "WillBeShakenObj",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String",
              }
            }
          ]
        }
      ]
    }

    const extAbi2: Abi = {
      version: "0.2",
      enums: [
        {
          kind: "Enum",
          name: "Foo",
          constants: ["ONE", "TWO"]
        },
        {
          kind: "Enum",
          name: "WillBeShakenEnum",
          constants: ["THREE", "FOUR"]
        }
      ]
    }

    const expectedAbi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "EXT1",
          type: "wasm",
          uri: "ext1",
          namespace: "EXT1",
          objects: extAbi1.objects,
          enums: extAbi1.enums,
          functions: extAbi1.functions,
          imports: extAbi1.imports
        },
        {
          id: "EXT2",
          type: "wasm",
          uri: "ext2",
          namespace: "EXT2",
          objects: extAbi2.objects,
          enums: extAbi2.enums,
          functions: extAbi2.functions,
          imports: extAbi2.imports
        },
      ]
    }

    const externalImportStatements: ExternalImportStatement[] = [
      {
        kind: "external",
        uriOrPath: "ext1",
        namespace: "EXT1",
        importedTypes: ["Some"]
      },
      {
        kind: "external",
        uriOrPath: "ext2",
        namespace: "EXT2",
        importedTypes: ["Foo"]
      },
    ]

    const fetchers = {
      external: {
        fetch: (uriOrPath: string) => {
          if (uriOrPath === "ext1") {
            return Promise.resolve(extAbi1)
          } else {
            return Promise.resolve(extAbi2)
          }
        },
      },
      local: {
        fetch: jest.fn()
      }
    }

    const linker = new AbiImportsLinker(mockSchemaParser(), fetchers, merger, shaker)
    const abiWithExports = await linker.embedExternalImports(abi, externalImportStatements)

    expect(sanitizer.sanitizeAbi(abiWithExports)).toEqual(expectedAbi)
  })

  it("Link unlinked local and external import references", async () => {
    const abi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          type: "wasm",
          uri: "ext",
          namespace: "EXT",
          enums: [
            {
              kind: "Enum",
              name: "Foo",
              constants: ["ONE", "TWO"]
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "Bar",
          constants: ["ONE", "TWO"]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "extProp",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "EXT_Foo",
              }
            },
            {
              kind: "Property",
              name: "extBar",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "Bar",
              }
            }
          ]
        }
      ]
    }

    const expectedAbi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          type: "wasm",
          uri: "ext",
          namespace: "EXT",
          enums: [
            {
              kind: "Enum",
              name: "Foo",
              constants: ["ONE", "TWO"]
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "Bar",
          constants: ["ONE", "TWO"]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "extProp",
              required: true,
              type: {
                kind: "ImportRef",
                ref_name: "Foo",
                ref_kind: "Enum",
                import_id: "0",
              }
            },
            {
              kind: "Property",
              name: "extBar",
              required: true,
              type: {
                kind: "Ref",
                ref_name: "Bar",
                ref_kind: "Enum",
              }
            }
          ]
        }
      ]
    }

    const linker = new AbiImportsLinker(mockSchemaParser(), mockFetchers(), merger, shaker)
    const linkedAbi = await linker.linkImportReferences(abi)

    expect(linkedAbi).toEqual(expectedAbi)
  })

  it("Link external nested/transitive import references", async () => {
    const abi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          type: "wasm",
          uri: "ext1",
          namespace: "EXT1",
          enums: [
            {
              kind: "Enum",
              name: "Foo",
              constants: ["ONE", "TWO"]
            }
          ],
          imports: [
            {
              id: "1",
              type: "wasm",
              uri: "ext2",
              namespace: "EXT2",
              enums: [
                {
                  kind: "Enum",
                  name: "Bar",
                  constants: ["ONE", "TWO"]
                }
              ],
              imports: [
                {
                  id: "2",
                  type: "wasm",
                  uri: "ext3",
                  namespace: "EXT3",
                  enums: [
                    {
                      kind: "Enum",
                      name: "Baz",
                      constants: ["ONE", "TWO"]
                    }
                  ],
                }
              ]
            }
          ]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "extProp",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "EXT1_Foo",
              }
            },
            {
              kind: "Property",
              name: "extProp2",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "EXT1_EXT2_Bar",
              }
            },
            {
              kind: "Property",
              name: "extProp3",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "EXT1_EXT2_EXT3_Baz",
              }
            },
          ]
        }
      ]
    }

    const expectedAbi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          type: "wasm",
          uri: "ext1",
          namespace: "EXT1",
          enums: [
            {
              kind: "Enum",
              name: "Foo",
              constants: ["ONE", "TWO"]
            }
          ],
          imports: [
            {
              id: "1",
              type: "wasm",
              uri: "ext2",
              namespace: "EXT2",
              enums: [
                {
                  kind: "Enum",
                  name: "Bar",
                  constants: ["ONE", "TWO"]
                }
              ],
              imports: [
                {
                  id: "2",
                  type: "wasm",
                  uri: "ext3",
                  namespace: "EXT3",
                  enums: [
                    {
                      kind: "Enum",
                      name: "Baz",
                      constants: ["ONE", "TWO"]
                    }
                  ],
                }
              ]
            }
          ]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "extProp",
              required: true,
              type: {
                kind: "ImportRef",
                ref_name: "Foo",
                ref_kind: "Enum",
                import_id: "0",
              }
            },
            {
              kind: "Property",
              name: "extProp2",
              required: true,
              type: {
                kind: "ImportRef",
                ref_name: "Bar",
                ref_kind: "Enum",
                import_id: "0.1",
              }
            },
            {
              kind: "Property",
              name: "extProp3",
              required: true,
              type: {
                kind: "ImportRef",
                ref_name: "Baz",
                ref_kind: "Enum",
                import_id: "0.1.2",
              }
            },
          ]
        }
      ]
    }

    const linker = new AbiImportsLinker(mockSchemaParser(), mockFetchers(), merger, shaker)
    const linkedAbi = await linker.linkImportReferences(abi)

    expect(linkedAbi).toEqual(expectedAbi)
  })

  it("Link ABI", async () => {
    const extAbi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "0",
          type: "wasm",
          uri: "ext2",
          namespace: "BAR",
          enums: [
            {
              kind: "Enum",
              name: "Bar",
              constants: ["ONE", "TWO"]
            }
          ]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "Foo",
          props: [{
            kind: "Property",
            name: "transitiveProp",
            required: true,
            type: {
              kind: "ImportRef",
              ref_name: "Bar",
              ref_kind: "Enum",
              import_id: "0"
            }
          }]
        }
      ]
    }

    const transitiveLocalAbi: Abi = {
      version: "0.2",
      enums: [
        {
          kind: "Enum",
          name: "TransitiveFoo",
          constants: ["ONE", "TWO"]
        }
      ]
    }

    const localAbi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Ref",
                ref_kind: "Enum",
                ref_name: "LocalFoo",
              }
            },
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "TransitiveFoo",
              }
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "LocalFoo",
          constants: ["ONE", "TWO"]
        }
      ]
    }

    const rootAbi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "RefObj",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "EXT1_Foo",
              }
            },
            {
              kind: "Property",
              name: "propSome2",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                ref_name: "Some",
              }
            }
          ]
        }
      ]
    }
    
    const expectedAbi: Abi = {
      version: "0.2",
      imports: [
        {
          id: "EXT1",
          type: "wasm",
          uri: "ext1",
          namespace: "EXT1",
          imports: [
            {
              id: "0",
              type: "wasm",
              uri: "ext2",
              namespace: "BAR",
              enums: [
                {
                  kind: "Enum",
                  name: "Bar",
                  constants: ["ONE", "TWO"]
                }
              ]
            }
          ],
          objects: [
            {
              kind: "Object",
              name: "Foo",
              props: [{
                kind: "Property",
                name: "transitiveProp",
                required: true,
                type: {
                  kind: "ImportRef",
                  ref_name: "Bar",
                  ref_kind: "Enum",
                  import_id: "0"
                }
              }]
            }
          ]
        }
      ],
      objects: [
        {
          kind: "Object",
          name: "RefObj",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "ImportRef",
                ref_kind: "Object",
                ref_name: "Foo",
                import_id: "EXT1",
              }
            },
            {
              kind: "Property",
              name: "propSome2",
              required: true,
              type: {
                kind: "Ref",
                ref_kind: "Object",
                ref_name: "Some",
              }
            }
          ]
        },
        {
          kind: "Object",
          name: "Some",
          props: [
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Ref",
                ref_kind: "Enum",
                ref_name: "LocalFoo",
              }
            },
            {
              kind: "Property",
              name: "propSome",
              required: true,
              type: {
                kind: "Ref",
                ref_kind: "Enum",
                ref_name: "TransitiveFoo",
              }
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "LocalFoo",
          constants: ["ONE", "TWO"]
        },
        {
          kind: "Enum",
          name: "TransitiveFoo",
          constants: ["ONE", "TWO"]
        }
      ]
    }

    const parser: SchemaParser = {
      parse: async (schemaUri: string): Promise<Abi> => {
        switch (schemaUri) {
          case "local":
            return Promise.resolve(localAbi)
          case "transitiveLocal":
            return Promise.resolve(transitiveLocalAbi)
        }

        throw new Error("Unknown schema")
      },
      parseExternalImportStatements: async (schemaUri: string): Promise<ExternalImportStatement[]> => {
        if (schemaUri === "ext1") {
          return Promise.resolve([
            {
              kind: "external",
              namespace: "EXT1",
              importedTypes: ["Foo"],
              uriOrPath: "ext1",
            }
          ])
        }

        return Promise.resolve([])
      },
      parseLocalImportStatements: async (schemaUri: string): Promise<LocalImportStatement[]> => {
        if (schemaUri === "local") {
          return Promise.resolve([
            {
              kind: "local",
              importedTypes: ["TransitiveFoo"],
              uriOrPath: "transitiveLocal",
            }
          ])
        }
        return Promise.resolve([])
      }
    }

    const fetchers = {
      external: {
        fetch: async (uri: string): Promise<Abi> => {
          return extAbi
        }
      },
      local: {
        fetch: async (path: string): Promise<string> => {
          return path
        }
      }
    }

    const linker = new AbiImportsLinker(parser, fetchers, merger, shaker)

    const linkedAbi = await linker.link(rootAbi, {
      local: [
        {
          kind: "local",
          importedTypes: ["Some"],
          uriOrPath: "local",
        }
      ],
      external: [
        {
          kind: "external",
          namespace: "EXT1",
          importedTypes: ["Foo"],
          uriOrPath: "ext1",
        }
      ]
    })

    expect(sanitizer.sanitizeAbi(linkedAbi)).toEqual(expectedAbi)
  })
})