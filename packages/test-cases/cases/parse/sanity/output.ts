import {
  TypeInfo,
  createScalarDefinition,
  createArrayDefinition,
  createObjectDefinition,
  createQueryDefinition,
  createMethodDefinition,
  createScalarPropertyDefinition,
  createArrayPropertyDefinition,
  createObjectPropertyDefinition,
  createImportedObjectDefinition,
  createImportedQueryDefinition,
  createEnumDefinition,
  createEnumPropertyDefinition,
  createImportedEnumDefinition
} from "../../../../schema/parse/src/typeInfo";

export const output: TypeInfo = {
  objectTypes: [
    {
      ...createObjectDefinition({ type: "CustomType" }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
        createScalarPropertyDefinition({ name: "optStr", type: "String", required: false }),
        createScalarPropertyDefinition({ name: "u", type: "UInt", required: true }),
        createScalarPropertyDefinition({ name: "optU", type: "UInt", required: false }),
        createScalarPropertyDefinition({ name: "u8", type: "UInt8", required: true }),
        createScalarPropertyDefinition({ name: "u16", type: "UInt16", required: true }),
        createScalarPropertyDefinition({ name: "u32", type: "UInt32", required: true }),
        createScalarPropertyDefinition({ name: "u64", type: "UInt64", required: true }),
        createScalarPropertyDefinition({ name: "i", type: "Int", required: true }),
        createScalarPropertyDefinition({ name: "i8", type: "Int8", required: true }),
        createScalarPropertyDefinition({ name: "i16", type: "Int16", required: true }),
        createScalarPropertyDefinition({ name: "i32", type: "Int32", required: true }),
        createScalarPropertyDefinition({ name: "i64", type: "Int64", required: true }),
        createScalarPropertyDefinition({ name: "bigint", type: "BigInt", required: true }),
        createScalarPropertyDefinition({ name: "optBigint", type: "BigInt", required: false }),
        createScalarPropertyDefinition({ name: "bytes", type: "Bytes", required: true }),
        createArrayPropertyDefinition({
          name: "uArray",
          type: "[UInt]",
          required: true,
          item: createScalarDefinition({ name: "uArray", type: "UInt", required: true })
        }),
        createArrayPropertyDefinition({
          name: "uOptArray",
          type: "[UInt]",
          required: false,
          item: createScalarDefinition({ name: "uOptArray", type: "UInt", required: true })
        }),
        createArrayPropertyDefinition({
          name: "optUOptArray",
          type: "[UInt]",
          required: false,
          item: createScalarDefinition({ name: "optUOptArray", type: "UInt", required: false })
        }),
        createArrayPropertyDefinition({
          name: "optStrOptArray",
          type: "[String]",
          required: false,
          item: createScalarDefinition({ name: "optStrOptArray", type: "String", required: false })
        }),
        createArrayPropertyDefinition({
          name: "uArrayArray",
          type: "[[UInt]]",
          required: true,
          item: createArrayDefinition({
            name: "uArrayArray",
            type: "[UInt]",
            required: true,
            item: createScalarDefinition({ name: "uArrayArray", type: "UInt", required: true })
          })
        }),
        createArrayPropertyDefinition({
          name: "uOptArrayOptArray",
          type: "[[UInt64]]",
          required: true,
          item: createArrayDefinition({
            name: "uOptArrayOptArray",
            type: "[UInt64]",
            required: false,
            item: createScalarDefinition({ name: "uOptArrayOptArray", type: "UInt64", required: false })
          })
        }),
        createArrayPropertyDefinition({
          name: "uArrayOptArrayArray",
          type: "[[[UInt64]]]",
          required: true,
          item: createArrayDefinition({
            name: "uArrayOptArrayArray",
            type: "[[UInt64]]",
            required: false,
            item: createArrayDefinition({
              name: "uArrayOptArrayArray",
              type: "[UInt64]",
              required: true,
              item: createScalarDefinition({ name: "uArrayOptArrayArray", type: "UInt64", required: true })
            })
          })
        }),
        createArrayPropertyDefinition({
          name: "crazyArray",
          type: "[[[[UInt64]]]]",
          required: false,
          item: createArrayDefinition({
            name: "crazyArray",
            type: "[[[UInt64]]]",
            required: false,
            item: createArrayDefinition({
              name: "crazyArray",
              type: "[[UInt64]]",
              required: true,
              item: createArrayDefinition({
                name: "crazyArray",
                type: "[UInt64]",
                required: false,
                item: createScalarDefinition({ name: "crazyArray", type: "UInt64", required: true })
              })
            })
          })
        }),
        createArrayPropertyDefinition({
          name: "objectArray",
          type: "[UserObject]",
          required: true,
          item: createObjectDefinition({ name: "objectArray", type: "UserObject", required: true })
        }),
        createArrayPropertyDefinition({
          name: "objectArrayArray",
          type: "[[UserObject]]",
          required: true,
          item: createArrayDefinition({
            name: "objectArrayArray",
            type: "[UserObject]",
            required: true,
            item: createObjectDefinition({ name: "objectArrayArray", type: "UserObject", required: true })
          })
        }),
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "UserObject",
          required: true
        }),
        createObjectPropertyDefinition({
          name: "optNestedObject",
          type: "UserObject",
        }),
        createEnumPropertyDefinition({
          name: "optEnum",
          type: "CustomEnum",
        }),
        createEnumPropertyDefinition({
          name: "enum",
          type: "CustomEnum",
          required: true
        }),
        createArrayPropertyDefinition({
          name: "enumArray",
          type: "[CustomEnum]",
          required: true,
          item: createEnumDefinition({
            name: "enumArray",
            type: "CustomEnum",
            required: true,
          })
        }),
        createArrayPropertyDefinition({
          name: "optEnumArray",
          type: "[CustomEnum]",
          required: false,
          item: createEnumDefinition({
            name: "optEnumArray",
            type: "CustomEnum",
            required: false
          })
        })
      ],
    },
    {
      ...createObjectDefinition({ type: "AnotherType" }),
      properties: [createScalarPropertyDefinition({ name: "prop", type: "String" })],
    },
    {
      ...createObjectDefinition({ type: "UserObject" }),
      properties: [
        createScalarPropertyDefinition({ name: "fieldA", type: "String", required: false }),
        createScalarPropertyDefinition({ name: "fieldB", type: "Int", required: true }),
      ],
    },
  ],
  enumTypes: [
    createEnumDefinition({
      type: "CustomEnum",
      constants: ["TEXT", "BINARY"]
    })
  ],
  importedEnumTypes: [
    createImportedEnumDefinition({
      type: "TestImport_Enum",
      uri: "testimport.uri.eth",
      namespace: "TestImport",
      nativeType: "Enum",
      constants: ["TEXT", "BYTES"]
    })
  ],
  queryTypes: [
    {
      ...createQueryDefinition({
        type: "Query",
        imports: [{ type: "TestImport_Query" }]
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "queryMethod",
            return: createArrayPropertyDefinition({
              name: "queryMethod",
              type: "[Int]",
              required: true,
              item: createScalarDefinition({ name: "queryMethod", type: "Int", required: false }),
            })
          }),
          arguments: [createScalarPropertyDefinition({ name: "arg", type: "String", required: true })],
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "userObjectMethod",
            return: createObjectPropertyDefinition({
              name: "userObjectMethod",
              type: "UserObject",
              required: true
            }),
          }),
          arguments: [
            createObjectPropertyDefinition({ name: "userObject", type: "UserObject" }),
            createArrayPropertyDefinition({ name: "arrayObject", type: "[UserObject]", required: true, item: createObjectDefinition({
              type: "UserObject",
              name: "arrayObject",
              required: true
            })}),
          ],
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "enumMethod",
            return: createEnumPropertyDefinition({
              name: "enumMethod",
              type: "CustomEnum",
              required: true
            }),
          }),
          arguments: [
            createEnumPropertyDefinition({ name: "enum", type: "CustomEnum" }),
            createArrayPropertyDefinition({ name: "arrayEnum", type: "[CustomEnum]", required: true, item: createEnumDefinition({
              type: "CustomEnum",
              name: "arrayEnum",
              required: true
            })}),
          ],
        },
      ],
    },
  ],
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "testimport.uri.eth",
        namespace: "TestImport",
        type: "TestImport_Object",
        nativeType: "Object"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
        createObjectPropertyDefinition({ name: "nested", type: "TestImport_NestedObject", required: true })
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "testimport.uri.eth",
        namespace: "TestImport",
        type: "TestImport_NestedObject",
        nativeType: "NestedObject"
      }),
      properties: [
        createArrayPropertyDefinition({
          name: "foo",
          type: "[String]",
          required: true,
          item: createScalarDefinition({
            name: "foo",
            type: "String",
            required: true,
          }),
        }),
        createObjectPropertyDefinition({
          name: "circular",
          type: "TestImport_Object",
          required: false,
        })
      ],
    }
  ],
  importedQueryTypes: [
    {
      ...createImportedQueryDefinition({
        uri: "testimport.uri.eth",
        namespace: "TestImport",
        type: "TestImport_Query",
        nativeType: "Query"
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "importedMethod",
            return: createScalarPropertyDefinition({
              name: "importedMethod",
              type: "String",
              required: true
            }),
          }),
          arguments: [
            createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
            createScalarPropertyDefinition({ name: "optStr", type: "String", required: false }),
            createScalarPropertyDefinition({ name: "u", type: "UInt", required: true }),
            createScalarPropertyDefinition({ name: "optU", type: "UInt", required: false }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              type: "[[UInt]]",
              required: true,
              item: createArrayDefinition({
                name: "uArrayArray",
                type: "[UInt]",
                required: false,
                item: createScalarDefinition({ name: "uArrayArray", type: "UInt", required: false })
              })
            }),
          ],
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "anotherMethod",
            return: createArrayPropertyDefinition({
              name: "anotherMethod",
              type: "[Int64]",
              required: true,
              item: createScalarDefinition({
                name: "anotherMethod",
                type: "Int64",
                required: false
              }),
            }),
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              type: "[String]",
              required: true,
              item: createScalarDefinition({ name: "arg", type: "String", required: true })
            }),
          ],
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "importedObjectMethod",
            return: {
              ...createObjectPropertyDefinition({
                name: "importedObjectMethod",
                type: "TestImport_Object",
                required: true
              }),
              object: {
                ...createObjectDefinition({
                  name: "importedObjectMethod",
                  type: "TestImport_Object",
                  required: true
                }),
              }
            },
          }),
          arguments: [
            {
              ...createObjectPropertyDefinition({
                name: "importedObject",
                type: "TestImport_Object",
                required: true
              }),
              object: {
                ...createObjectDefinition({
                  name: "importedObject",
                  type: "TestImport_Object",
                  required: true
                }),
              }
            }
          ],
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "importedEnumMethod",
            return: createEnumPropertyDefinition({
              name: "importedEnumMethod",
              type: "TestImport_Enum",
              required: true
            }),
          }),
          arguments: [
            {
              ...createEnumPropertyDefinition({
                name: "enum",
                type: "TestImport_Enum",
                required: true
              }),
            },
            {
              ...createEnumPropertyDefinition({
                name: "optEnum",
                type: "TestImport_Enum",
                required: false
              }),
            }
          ]
        },
      ],
    },
    {
      ...createImportedQueryDefinition({
        uri: "testimport.uri.eth",
        namespace: "TestImport",
        type: "TestImport_Mutation",
        nativeType: "Mutation"
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "importedMethod",
            return: createScalarPropertyDefinition({
              name: "importedMethod",
              type: "String",
              required: true
            }),
          }),
          arguments: [createScalarPropertyDefinition({ name: "str", type: "String", required: true })],
        },
      ],
    },
  ],
};
