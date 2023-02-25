import { Abi, LocalImportStatement, SchemaParser } from "@polywrap/abi-types"
import { AbiImportsLinker } from "../AbiImportsLinker"
import { AbiMerger } from "../AbiMerger"
import { AbiTreeShaker } from "../AbiTreeShaker"
import { mockFetchers, mockSchemaParser } from "./mocks"

describe("AbiImportsLinker", () => {
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

    const linker = new AbiImportsLinker(mockSchemaParser(), mockFetchers(), new AbiMerger(), new AbiTreeShaker())
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

    const linker = new AbiImportsLinker(mockSchemaParser(), mockFetchers(), new AbiMerger(), new AbiTreeShaker())
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
    const linker = new AbiImportsLinker(parser, fetchers, new AbiMerger(), new AbiTreeShaker())
    const mergedAbi = await linker.mergeLocalImports(abi, localImportStatements)

    expect(mergedAbi.abi).toEqual(expectedAbi)
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
    const linker = new AbiImportsLinker(parser, fetchers, new AbiMerger(), new AbiTreeShaker())
    const mergedAbi = await linker.mergeLocalImports(abi, localImportStatements)

    expect(mergedAbi.abi).toEqual(expectedAbi)
  })

  it("Should embed external imports", async () => {
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
    const linker = new AbiImportsLinker(parser, fetchers, new AbiMerger(), new AbiTreeShaker())
    const mergedAbi = await linker.mergeLocalImports(abi, localImportStatements)

    expect(mergedAbi.abi).toEqual(expectedAbi)
  })
})