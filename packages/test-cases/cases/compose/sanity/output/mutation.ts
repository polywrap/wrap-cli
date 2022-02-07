import {
  createArrayPropertyDefinition,
  createMethodDefinition,
  createModuleDefinition,
  createScalarDefinition,
  createScalarPropertyDefinition,
  createArrayDefinition,
  createObjectPropertyDefinition,
  createObjectDefinition,
  createEnumPropertyDefinition,
  createImportedModuleDefinition,
  createImportedObjectDefinition,
  createImportedEnumDefinition,
  createInterfaceImplementedDefinition,
  createObjectRef,
  createEnvDefinition,
  createTypeInfo,
  AnyDefinition,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  envTypes: {
    query: createEnvDefinition({}),
    mutation: createEnvDefinition({
      sanitized: {
        ...createObjectDefinition({ type: "MutationEnv" }),
        properties: [
          {
            ...createScalarPropertyDefinition({ name: "bar", type: "Int", required: false }),
            first: true,
            last: null,
          } as AnyDefinition,
          {
            ...createScalarPropertyDefinition({ name: "foo", type: "String", required: true }),
            first: null,
            last: true,
          } as AnyDefinition,
        ],
      }
    }),
  },
  enumTypes: [],
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Mutation", comment: "Mutation comment" }),
      imports: [
        { type: "Namespace_Query" },
        { type: "Namespace_Mutation" },
        { type: "Namespace_NestedObjectType" },
        { type: "Namespace_ObjectType" },
        { type: "Namespace_Imported_NestedObjectType" },
        { type: "Namespace_Imported_ObjectType" },
        { type: "Namespace_CustomType" },
        { type: "Namespace_CustomEnum" },
        { type: "Namespace_Imported_Enum" },
        { type: "JustMutation_Mutation" },
        { type: "Interface_InterfaceObject1" },
        { type: "Interface_InterfaceObject2" },
        { type: "Interface_Object" },
        { type: "Interface_NestedInterfaceObject" },
        { type: "Interface_Mutation" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({type: "Interface_Mutation"})
      ],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method1",
            return: createScalarPropertyDefinition({
              name: "method1",
              type: "String",
              required: true
            }),
            comment: "method1 comment"
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String",
              comment: "str comment"
            }),
            createScalarPropertyDefinition({
              name: "optStr",
              required: false,
              type: "String",
              comment: "optStr comment"
            }),
            createScalarPropertyDefinition({
              name: "u",
              required: true,
              type: "UInt"
            }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              required: true,
              type: "[[UInt]]",
              item: createArrayDefinition({
                name: "uArrayArray",
                required: false,
                type: "[UInt]",
                item: createScalarDefinition({
                  name: "uArrayArray",
                  required: false,
                  type: "UInt"
                })
              }),
              comment: "uArrayArray comment"
            }),
            createObjectPropertyDefinition({
              name: "implObject",
              required: true,
              type: "LocalImplementationObject",
              comment: "implObject comment"
            }),
          ]
        },
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method2",
            return: createArrayPropertyDefinition({
              name: "method2",
              type: "[Int32]",
              required: true,
              item: createScalarDefinition({
                name: "method2",
                required: true,
                type: "Int32"
              })
            })
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              required: true,
              type: "[String]",
              item: createScalarDefinition({
                name: "arg",
                required: true,
                type: "String"
              })
            })
          ]
        },
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "abstractMutationMethod",
            return: createScalarPropertyDefinition({
              name: "abstractMutationMethod",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "arg",
              required: true,
              type: "UInt8"
            })
          ]
        },
      ]
    }
  ],
  objectTypes: [
    {
      ...createObjectDefinition({ type: "CustomMutationType", comment: "CustomMutationType multi-line comment\nline 2" }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String", required: true, comment: "str comment" }),
        createScalarPropertyDefinition({ name: "optStr", type: "String", required: false, comment: "optStr comment" }),
        createScalarPropertyDefinition({ name: "u", type: "UInt", required: true }),
        createScalarPropertyDefinition({ name: "optU", type: "UInt", required: false }),
        createScalarPropertyDefinition({ name: "u8", type: "UInt8", required: true }),
        createScalarPropertyDefinition({ name: "i", type: "Int", required: true }),
        createScalarPropertyDefinition({ name: "i8", type: "Int8", required: true }),
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
          name: "optStrOptArray",
          type: "[String]",
          required: false,
          item: createScalarDefinition({ name: "optStrOptArray", type: "String", required: false })
        }),
        createArrayPropertyDefinition({
          name: "crazyArray",
          type: "[[[[UInt32]]]]",
          required: false,
          comment: "crazyArray comment",
          item: createArrayDefinition({
            name: "crazyArray",
            type: "[[[UInt32]]]",
            required: false,
            item: createArrayDefinition({
              name: "crazyArray",
              type: "[[UInt32]]",
              required: true,
              item: createArrayDefinition({
                name: "crazyArray",
                type: "[UInt32]",
                required: false,
                item: createScalarDefinition({ name: "crazyArray", type: "UInt32", required: true })
              })
            })
          })
        }),
        createObjectPropertyDefinition({
          name: "commonType",
          type: "CommonType",
          required: true
        }),
        createObjectPropertyDefinition({
          name: "customType",
          type: "Namespace_CustomType",
          required: true,
          comment: "customType comment"
        })
      ],
    },
    {
      ...createObjectDefinition({ type: "AnotherMutationType" }),
      properties: [createScalarPropertyDefinition({ name: "prop", type: "String" })],
    },
    {
      ...createObjectDefinition({
        type: "ImplementationObject",
        interfaces: [
          createInterfaceImplementedDefinition({ type: "Interface_InterfaceObject1" }),
          createInterfaceImplementedDefinition({ type: "Interface_InterfaceObject2" })
        ],
        comment: "ImplementationObject comment"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "anotherProp", type: "String", required: false, comment: "anotherProp comment" }),
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
        createScalarPropertyDefinition({ name: "uint8", type: "UInt8", required: true }),
        createScalarPropertyDefinition({ name: "str2", type: "String", required: true }),
        createObjectPropertyDefinition({ name: "object", type: "Interface_Object", required: false }),
      ]
    },
    {
      ...createObjectDefinition({
        type: "LocalImplementationObject",
        interfaces: [
          createInterfaceImplementedDefinition({ type: "LocalInterfaceObject" }),
        ]
      }),
      properties: [
        createScalarPropertyDefinition({ name: "uint8", type: "UInt8", required: true }),
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
      ]
    },
    {
      ...createObjectDefinition({
        type: "LocalInterfaceObject",
      }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
      ]
    },
    {
      ...createObjectDefinition({ type: "CommonType", comment: "CommonType comment" }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "UInt8", required: true }),
        createObjectPropertyDefinition({ name: "nestedObject", type: "NestedType", required: true }),
        createArrayPropertyDefinition({
          name: "objectArray",
          type: "[[ArrayObject]]",
          required: true,
          comment: "objectArray comment",
          item: createArrayDefinition({
            name: "objectArray",
            type: "[ArrayObject]",
            required: false,
            item: createObjectRef({
              name: "objectArray",
              type: "ArrayObject",
              required: false
            })
          })
        }),
        createObjectPropertyDefinition({ name: "anotherLocal", type: "AnotherLocal", required: true }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "NestedType",
        comment: "NestedType comment"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "ArrayObject",
        comment: "ArrayObject comment"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "AnotherLocal",
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    },
  ],
  importedModuleTypes: [
    {
      ...createImportedModuleDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Query",
        isInterface: false,
        type: "Namespace_Query",
        comment: "Query comment",
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method1",
            return: createScalarPropertyDefinition({
              name: "method1",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "optStr",
              required: false,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "u",
              required: true,
              type: "UInt"
            }),
            createScalarPropertyDefinition({
              name: "optU",
              required: false,
              type: "UInt"
            }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              required: true,
              type: "[[UInt]]",
              item: createArrayDefinition({
                name: "uArrayArray",
                required: false,
                type: "[UInt]",
                item: createScalarDefinition({
                  name: "uArrayArray",
                  required: false,
                  type: "UInt"
                })
              })
            })
          ]
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "method2",
            comment: "method2 comment",
            return: createArrayPropertyDefinition({
              name: "method2",
              type: "[Int32]",
              required: true,
              item: createScalarDefinition({
                name: "method2",
                required: true,
                type: "Int32"
              })
            })
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              required: true,
              type: "[String]",
              comment: "arg comment",
              item: createScalarDefinition({
                name: "arg",
                required: true,
                type: "String"
              })
            })
          ]
        }
      ]
    },
    {
      ...createImportedModuleDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Mutation",
        isInterface: false,
        type: "Namespace_Mutation",
        comment: "Mutation comment",
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method1",
            return: createScalarPropertyDefinition({
              name: "method1",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "optStr",
              required: false,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "u",
              required: true,
              type: "UInt"
            }),
            createScalarPropertyDefinition({
              name: "optU",
              required: false,
              type: "UInt"
            }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              required: true,
              type: "[[UInt]]",
              item: createArrayDefinition({
                name: "uArrayArray",
                required: false,
                type: "[UInt]",
                item: createScalarDefinition({
                  name: "uArrayArray",
                  required: false,
                  type: "UInt"
                })
              })
            })
          ]
        },
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method2",
            return: createArrayPropertyDefinition({
              name: "method2",
              type: "[Int32]",
              required: true,
              item: createScalarDefinition({
                name: "method2",
                required: true,
                type: "Int32"
              })
            })
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              required: true,
              type: "[String]",
              item: createScalarDefinition({
                name: "arg",
                required: true,
                type: "String"
              })
            })
          ]
        },
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "localObjects",
            return: createObjectPropertyDefinition({
              name: "localObjects",
              type: "Namespace_NestedObjectType",
              required: false
            })
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "nestedLocalObject",
              required: false,
              type: "Namespace_NestedObjectType"
            }),
            createArrayPropertyDefinition({
              name: "localObjectArray",
              required: false,
              type: "[Namespace_NestedObjectType]",
              item: createObjectRef({
                name: "localObjectArray",
                required: true,
                type: "Namespace_NestedObjectType"
              })
            })
          ]
        },
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "importedObjects",
            return: createObjectPropertyDefinition({
              name: "importedObjects",
              type: "Namespace_Imported_NestedObjectType",
              required: false
            })
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "nestedLocalObject",
              required: false,
              type: "Namespace_Imported_NestedObjectType"
            }),
            createArrayPropertyDefinition({
              name: "localObjectArray",
              required: false,
              type: "[Namespace_Imported_NestedObjectType]",
              item: createObjectRef({
                name: "localObjectArray",
                required: true,
                type: "Namespace_Imported_NestedObjectType"
              })
            })
          ]
        },
      ]
    },
    {
      ...createImportedModuleDefinition({
        uri: "just.mutation.eth",
        namespace: "JustMutation",
        isInterface: false,
        nativeType: "Mutation",
        type: "JustMutation_Mutation",
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method",
            return: createArrayPropertyDefinition({
              name: "method",
              type: "[Int32]",
              required: true,
              item: createScalarDefinition({
                name: "method",
                type: "Int32",
                required: true
              })
            }),
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              required: true,
              type: "[String]",
              item: createScalarDefinition({
                name: "arg",
                required: true,
                type: "String"
              })
            })
          ]
        },
      ]
    },
    {
      ...createImportedModuleDefinition({
        uri: "test-interface.eth",
        namespace: "Interface",
        nativeType: "Mutation",
        isInterface: false,
        type: "Interface_Mutation",
        comment: "Mutation comment",
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "abstractMutationMethod",
            return: createScalarPropertyDefinition({
              name: "abstractMutationMethod",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "arg",
              required: true,
              type: "UInt8"
            }),
          ]
        },
      ]
    },
  ],
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "NestedObjectType",
        type: "Namespace_NestedObjectType"
      }),
      properties: [createObjectPropertyDefinition({ name: "nestedObject", type: "Namespace_ObjectType", required: true })],
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "ObjectType",
        type: "Namespace_ObjectType"
      }),
      properties: [createScalarPropertyDefinition({ name: "prop", type: "String", required: true })],
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Imported_NestedObjectType",
        type: "Namespace_Imported_NestedObjectType",
        comment: "Imported_NestedObjectType comment"
      }),
      properties: [createObjectPropertyDefinition({ name: "nestedObject", type: "Namespace_Imported_ObjectType", required: true })],
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Imported_ObjectType",
        type: "Namespace_Imported_ObjectType"
      }),
      properties: [createScalarPropertyDefinition({ name: "prop", type: "String", required: true })],
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "CustomType",
        type: "Namespace_CustomType",
        comment: "CustomType comment"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
        createScalarPropertyDefinition({ name: "optStr", type: "String", required: false }),
        createScalarPropertyDefinition({ name: "u", type: "UInt", required: true }),
        createScalarPropertyDefinition({ name: "optU", type: "UInt", required: false }),
        createScalarPropertyDefinition({ name: "u8", type: "UInt8", required: true }),
        createScalarPropertyDefinition({ name: "u16", type: "UInt16", required: true }),
        createScalarPropertyDefinition({ name: "u32", type: "UInt32", required: true }),
        createScalarPropertyDefinition({ name: "i", type: "Int", required: true }),
        createScalarPropertyDefinition({ name: "i8", type: "Int8", required: true }),
        createScalarPropertyDefinition({ name: "i16", type: "Int16", required: true }),
        createScalarPropertyDefinition({ name: "i32", type: "Int32", required: true }),
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
          type: "[[UInt32]]",
          required: true,
          item: createArrayDefinition({
            name: "uOptArrayOptArray",
            type: "[UInt32]",
            required: false,
            item: createScalarDefinition({ name: "uOptArrayOptArray", type: "UInt32", required: false })
          })
        }),
        createArrayPropertyDefinition({
          name: "uArrayOptArrayArray",
          type: "[[[UInt32]]]",
          required: true,
          item: createArrayDefinition({
            name: "uArrayOptArrayArray",
            type: "[[UInt32]]",
            required: false,
            item: createArrayDefinition({
              name: "uArrayOptArrayArray",
              type: "[UInt32]",
              required: true,
              item: createScalarDefinition({ name: "uArrayOptArrayArray", type: "UInt32", required: true })
            })
          })
        }),
        createArrayPropertyDefinition({
          name: "crazyArray",
          type: "[[[[UInt32]]]]",
          required: false,
          item: createArrayDefinition({
            name: "crazyArray",
            type: "[[[UInt32]]]",
            required: false,
            item: createArrayDefinition({
              name: "crazyArray",
              type: "[[UInt32]]",
              required: true,
              item: createArrayDefinition({
                name: "crazyArray",
                type: "[UInt32]",
                required: false,
                item: createScalarDefinition({ name: "crazyArray", type: "UInt32", required: true })
              })
            })
          })
        }),
        createObjectPropertyDefinition({
          name: "object",
          type: "Namespace_ObjectType",
          required: true
        }),
        createObjectPropertyDefinition({
          name: "optObject",
          type: "Namespace_ObjectType",
          required: false
        }),
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "Namespace_NestedObjectType",
          required: true
        }),
        createObjectPropertyDefinition({
          name: "optNestedObject",
          type: "Namespace_NestedObjectType",
          required: false
        }),
        createArrayPropertyDefinition({
          name: "optNestedObjectArray",
          type: "[Namespace_NestedObjectType]",
          required: true,
          item: createObjectRef({
            name: "optNestedObjectArray",
            type: "Namespace_NestedObjectType",
            required: false
          }),
        }),
        createObjectPropertyDefinition({
          name: "importedNestedObject",
          type: "Namespace_Imported_NestedObjectType",
          required: true
        }),
        createArrayPropertyDefinition({
          name: "optImportedNestedObjectArray",
          type: "[Namespace_Imported_NestedObjectType]",
          required: true,
          item: createObjectRef({
            name: "optImportedNestedObjectArray",
            type: "Namespace_Imported_NestedObjectType",
            required: false
          }),
        }),
        createEnumPropertyDefinition({
          name: "enum",
          type: "Namespace_CustomEnum",
          required: true
        }),
        createEnumPropertyDefinition({
          name: "optEnum",
          type: "Namespace_CustomEnum",
          required: false
        }),
        createEnumPropertyDefinition({
          name: "importedEnum",
          type: "Namespace_Imported_Enum",
          required: true
        }),
        createEnumPropertyDefinition({
          name: "optImportedEnum",
          type: "Namespace_Imported_Enum",
          required: false,
          comment: "optImportedEnum comment"
        }),
      ]
    },
    {
      ...createImportedObjectDefinition({
        uri: "test-interface.eth",
        namespace: "Interface",
        nativeType: "InterfaceObject1",
        type: "Interface_InterfaceObject1",
        comment: "InterfaceObject1 comment"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
        createScalarPropertyDefinition({ name: "uint8", type: "UInt8", required: true, comment: "InterfaceObject1_uint8 comment" }),
      ]
    },
    {
      ...createImportedObjectDefinition({
        uri: "test-interface.eth",
        namespace: "Interface",
        nativeType: "InterfaceObject2",
        type: "Interface_InterfaceObject2",
        comment: "InterfaceObject2 comment"
      }),
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Interface_NestedInterfaceObject" })
      ],
      properties: [
        createScalarPropertyDefinition({ name: "str2", type: "String", required: true }),
        createObjectPropertyDefinition({ name: "object", type: "Interface_Object", required: false }),
      ]
    },
    {
      ...createImportedObjectDefinition({
        uri: "test-interface.eth",
        namespace: "Interface",
        nativeType: "Object",
        type: "Interface_Object",
        comment: "Object comment"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "uint8", type: "UInt8", required: true }),
      ]
    },
    {
      ...createImportedObjectDefinition({
        uri: "test-interface.eth",
        namespace: "Interface",
        nativeType: "NestedInterfaceObject",
        type: "Interface_NestedInterfaceObject",
        comment: "NestedInterfaceObject comment"
      }),
      properties: [
        createObjectPropertyDefinition({ name: "object", type: "Interface_Object", required: false, comment: "object comment" }),
      ]
    },
  ],
  importedEnumTypes: [
    {
      ...createImportedEnumDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "CustomEnum",
        type: "Namespace_CustomEnum",
        constants: [
          "STRING",
          "BYTES"
        ]
      })
    },
    {
      ...createImportedEnumDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Imported_Enum",
        type: "Namespace_Imported_Enum",
        constants: [
          "STRING",
          "BYTES"
        ],
        comment: "Imported_Enum comment"
      })
    }
  ],
}
