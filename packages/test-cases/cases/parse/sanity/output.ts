import {
  createArrayDefinition,
  createArrayPropertyDefinition,
  createCapability,
  createEnumDefinition,
  createEnumPropertyDefinition,
  createEnumRef,
  createEnvDefinition,
  createImportedEnumDefinition,
  createImportedModuleDefinition,
  createImportedObjectDefinition,
  createInterfaceDefinition,
  createInterfaceImplementedDefinition,
  createMapKeyDefinition,
  createMapPropertyDefinition,
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createObjectRef,
  createScalarDefinition,
  createScalarPropertyDefinition,
  Abi, createFractionPropertyDefinition,
} from "../../../../schema/parse/src/abi";

export const abi: Abi = {
  interfaceTypes: [
    createInterfaceDefinition({
      type: "TestImport",
      uri: "testimport.uri.eth",
      namespace: "TestImport",
      capabilities: {
        ...createCapability({
          type: "getImplementations",
          enabled: true,
        }),
      },
    }),
  ],
  envType: createEnvDefinition({
      sanitized: {
        ...createObjectDefinition({ type: "Env" }),
        properties: [
          createScalarPropertyDefinition({
            name: "prop",
            type: "String",
            required: true,
          }),
          createScalarPropertyDefinition({
            name: "propM",
            type: "Int",
            required: true,
          })
        ],
      },
      client: {
        ...createObjectDefinition({ type: "ClientEnv" }),
        properties: [
          createScalarPropertyDefinition({
            name: "prop",
            type: "String",
            required: true,
          }),
          createScalarPropertyDefinition({
            name: "propM",
            type: "String",
            required: false,
          }),
        ],
      },
    }),
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
        comment: "CustomType multi-line comment\nline 2",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "str",
          type: "String",
          required: true,
          comment: "str comment",
        }),
        createScalarPropertyDefinition({
          name: "optStr",
          type: "String",
          required: false,
          comment: "optStr comment",
        }),
        createScalarPropertyDefinition({
          name: "u",
          type: "UInt",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "optU",
          type: "UInt",
          required: false,
        }),
        createScalarPropertyDefinition({
          name: "u8",
          type: "UInt8",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "u16",
          type: "UInt16",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "u32",
          type: "UInt32",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "i",
          type: "Int",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "i8",
          type: "Int8",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "i16",
          type: "Int16",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "i32",
          type: "Int32",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "bigint",
          type: "BigInt",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "optBigint",
          type: "BigInt",
          required: false,
        }),
        createScalarPropertyDefinition({
          name: "bignumber",
          type: "BigNumber",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "optBignumber",
          type: "BigNumber",
          required: false,
        }),
        createScalarPropertyDefinition({
          name: "bigfraction",
          type: "BigFraction",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "optBigfraction",
          type: "BigFraction",
          required: false,
        }),
        createFractionPropertyDefinition({
          name: "fraction",
          type: "Fraction<Int32!>!",
          subType: "Int32",
          required: true,
        }),
        createFractionPropertyDefinition({
          name: "optFraction",
          type: "Fraction<Int32!>",
          subType: "Int32",
          required: false,
        }),
        createScalarPropertyDefinition({
          name: "json",
          type: "JSON",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "optJson",
          type: "JSON",
          required: false,
        }),
        createScalarPropertyDefinition({
          name: "bytes",
          type: "Bytes",
          required: true,
        }),
        createArrayPropertyDefinition({
          name: "uArray",
          type: "[UInt]",
          required: true,
          item: createScalarDefinition({
            name: "uArray",
            type: "UInt",
            required: true,
          }),
        }),
        createArrayPropertyDefinition({
          name: "uOptArray",
          type: "[UInt]",
          required: false,
          item: createScalarDefinition({
            name: "uOptArray",
            type: "UInt",
            required: true,
          }),
        }),
        createArrayPropertyDefinition({
          name: "optUOptArray",
          type: "[UInt]",
          required: false,
          item: createScalarDefinition({
            name: "optUOptArray",
            type: "UInt",
            required: false,
          }),
        }),
        createArrayPropertyDefinition({
          name: "optStrOptArray",
          type: "[String]",
          required: false,
          item: createScalarDefinition({
            name: "optStrOptArray",
            type: "String",
            required: false,
          }),
        }),
        createArrayPropertyDefinition({
          name: "uArrayArray",
          type: "[[UInt]]",
          required: true,
          item: createArrayDefinition({
            name: "uArrayArray",
            type: "[UInt]",
            required: true,
            item: createScalarDefinition({
              name: "uArrayArray",
              type: "UInt",
              required: true,
            }),
          }),
        }),
        createArrayPropertyDefinition({
          name: "uOptArrayOptArray",
          type: "[[UInt32]]",
          required: true,
          item: createArrayDefinition({
            name: "uOptArrayOptArray",
            type: "[UInt32]",
            required: false,
            item: createScalarDefinition({
              name: "uOptArrayOptArray",
              type: "UInt32",
              required: false,
            }),
          }),
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
              item: createScalarDefinition({
                name: "uArrayOptArrayArray",
                type: "UInt32",
                required: true,
              }),
            }),
          }),
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
                item: createScalarDefinition({
                  name: "crazyArray",
                  type: "UInt32",
                  required: true,
                }),
              }),
            }),
          }),
        }),
        createArrayPropertyDefinition({
          name: "objectArray",
          type: "[UserObject]",
          required: true,
          item: createObjectRef({
            name: "objectArray",
            type: "UserObject",
            required: true,
          }),
        }),
        createArrayPropertyDefinition({
          name: "objectArrayArray",
          type: "[[UserObject]]",
          required: true,
          item: createArrayDefinition({
            name: "objectArrayArray",
            type: "[UserObject]",
            required: true,
            item: createObjectRef({
              name: "objectArrayArray",
              type: "UserObject",
              required: true,
            }),
          }),
        }),
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "UserObject",
          required: true,
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
          required: true,
        }),
        createArrayPropertyDefinition({
          name: "enumArray",
          type: "[CustomEnum]",
          required: true,
          item: createEnumRef({
            name: "enumArray",
            type: "CustomEnum",
            required: true,
          }),
        }),
        createArrayPropertyDefinition({
          name: "optEnumArray",
          type: "[CustomEnum]",
          required: false,
          item: createEnumRef({
            name: "optEnumArray",
            type: "CustomEnum",
            required: false,
          }),
        }),
        createMapPropertyDefinition({
          name: "map1",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({ name: "map1", type: "String", required: true }),
          value: createScalarDefinition({ name: "map1", type: "Int" }),
        }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "AnotherType",
        comment: "AnotherType comment",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          comment: "prop comment",
        }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "UserObject",
        comment: "UserObject comment",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "fieldA",
          type: "String",
          required: false,
        }),
        createScalarPropertyDefinition({
          name: "fieldB",
          type: "Int",
          required: true,
        }),
      ],
    },
    {
      ...createObjectDefinition({ type: "UserObjectFromInterface" }),
      interfaces: [
        createInterfaceImplementedDefinition({ type: "UserObject" }),
      ],
      properties: [
        createScalarPropertyDefinition({ name: "fieldA", type: "String", required: false }),
        createScalarPropertyDefinition({ name: "fieldB", type: "Int", required: true }),
        createScalarPropertyDefinition({ name: "fieldC", type: "UInt32", required: true }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "ImplementationObject",
        interfaces: [
          createInterfaceImplementedDefinition({ type: "Interface_Object" }),
          createInterfaceImplementedDefinition({ type: "Interface_Object2" }),
        ],
        comment: "ImplementationObject comment",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "anotherProp",
          type: "String",
          required: false,
          comment: "anotherProp comment",
        }),
        createScalarPropertyDefinition({
          name: "str",
          type: "String",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "uint8",
          type: "UInt8",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "str2",
          type: "String",
          required: true,
        }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "ModuleObjectType",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          required: true,
        }),
      ],
    }
  ],
  enumTypes: [
    createEnumDefinition({
      type: "CustomEnum",
      constants: ["TEXT", "BINARY"],
      comment: "CustomEnum comment",
    }),
  ],
  importedEnumTypes: [
    createImportedEnumDefinition({
      type: "TestImport_Enum",
      uri: "testimport.uri.eth",
      namespace: "TestImport",
      nativeType: "Enum",
      constants: ["TEXT", "BYTES"],
      comment: "TestImport_Enum comment",
    }),
  ],
  moduleType: 
    {
      ...createModuleDefinition({
        imports: [{ type: "TestImport_Module" }, { type: "Interface_Module" }],
        interfaces: [
          createInterfaceImplementedDefinition({ type: "Interface_Module" }),
        ],
        comment: "Module comment",
      }),
      methods: [
        {
          ...createMethodDefinition({
            name: "sanitizeEnv",
            return: createObjectPropertyDefinition({ name: "sanitizeEnv", type: "Env", required: true }),
            arguments: [createObjectPropertyDefinition({ name: "env", type: "ClientEnv", required: true })],
          })
        },
        {
          ...createMethodDefinition({
            name: "moduleMethod",
            return: createArrayPropertyDefinition({
              name: "moduleMethod",
              type: "[Int]",
              required: true,
              item: createScalarDefinition({
                name: "moduleMethod",
                type: "Int",
                required: false,
              }),
            }),
            comment: "moduleMethod comment",
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "arg",
              type: "String",
              required: true,
              comment: "arg comment",
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "userObjectMethod",
            return: createObjectPropertyDefinition({
              name: "userObjectMethod",
              type: "UserObject",
              required: true,
            }),
            comment: "userObjectMethod comment",
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "userObject",
              type: "UserObject",
              comment: "userObject comment",
            }),
            createArrayPropertyDefinition({
              name: "arrayObject",
              type: "[UserObject]",
              required: true,
              comment: "arrayObject comment",
              item: createObjectRef({
                type: "UserObject",
                name: "arrayObject",
                required: true,
              }),
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "enumMethod",
            return: createEnumPropertyDefinition({
              name: "enumMethod",
              type: "CustomEnum",
              required: true,
            }),
            comment: "enumMethod comment",
          }),
          arguments: [
            createEnumPropertyDefinition({
              name: "enum",
              type: "CustomEnum",
              comment: "enum comment",
            }),
            createArrayPropertyDefinition({
              name: "arrayEnum",
              type: "[CustomEnum]",
              required: true,
              comment: "arrayEnum comment",
              item: createEnumRef({
                type: "CustomEnum",
                name: "arrayEnum",
                required: true,
              }),
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "abstractMethod",
            return: createScalarPropertyDefinition({
              name: "abstractMethod",
              type: "String",
              required: true,
            }),
            comment: "abstractMethod comment",
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "arg",
              type: "UInt8",
              required: true,
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "transformMap",
            return: createMapPropertyDefinition({
              name: "transformMap",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "transformMap",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "transformMap",
                type: "Int",
                required: true,
              }),
            }),
          }),
          arguments: [
            createMapPropertyDefinition({
              name: "map",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "map",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "map",
                type: "Int",
                required: true,
              }),
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "transformFraction",
            return: createFractionPropertyDefinition({
              name: "transformFraction",
              type: "Fraction<Int32!>!",
              subType: "Int32",
              required: true,
            }),
          }),
          arguments: [
            createFractionPropertyDefinition({
              name: "fraction",
              type: "Fraction<Int32!>",
              subType: "Int32",
              required: false,
            }),
          ],
        },
      ],
    },
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "testimport.uri.eth",
        namespace: "TestImport",
        type: "TestImport_Object",
        nativeType: "Object",
        comment: "TestImport_Object comment",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          required: true,
          comment: "prop comment",
        }),
        createObjectPropertyDefinition({
          name: "nested",
          type: "TestImport_NestedObject",
          required: true,
          comment: "nested comment",
        }),
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "testimport.uri.eth",
        namespace: "TestImport",
        type: "TestImport_NestedObject",
        nativeType: "NestedObject",
        comment: "TestImport_NestedObject comment",
      }),
      properties: [
        createArrayPropertyDefinition({
          name: "foo",
          type: "[String]",
          required: true,
          comment: "foo comment",
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
        }),
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "interface.uri.eth",
        namespace: "Interface",
        type: "Interface_Object",
        nativeType: "Object",
        comment: "Interface_Object comment",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "str",
          type: "String",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "uint8",
          type: "UInt8",
          required: true,
        }),
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "interface.uri.eth",
        namespace: "Interface",
        type: "Interface_Object2",
        nativeType: "Object2",
        comment: "Interface_Object2 comment",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "str2",
          type: "String",
          required: true,
        }),
      ],
    },
  ],
  importedModuleTypes: [
    {
      ...createImportedModuleDefinition({
        uri: "testimport.uri.eth",
        namespace: "TestImport",
        isInterface: true,
        nativeType: "Module",
        comment: "TestImport_Module comment",
      }),
      methods: [
        {
          ...createMethodDefinition({
            name: "importedMethod",
            return: createScalarPropertyDefinition({
              name: "importedMethod",
              type: "String",
              required: true,
            }),
            comment: "importedMethod comment",
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              type: "String",
              required: true,
            }),
            createScalarPropertyDefinition({
              name: "optStr",
              type: "String",
              required: false,
            }),
            createScalarPropertyDefinition({
              name: "u",
              type: "UInt",
              required: true,
            }),
            createScalarPropertyDefinition({
              name: "optU",
              type: "UInt",
              required: false,
            }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              type: "[[UInt]]",
              required: true,
              comment: "uArrayArray comment",
              item: createArrayDefinition({
                name: "uArrayArray",
                type: "[UInt]",
                required: false,
                item: createScalarDefinition({
                  name: "uArrayArray",
                  type: "UInt",
                  required: false,
                }),
              }),
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "anotherMethod",
            return: createArrayPropertyDefinition({
              name: "anotherMethod",
              type: "[Int32]",
              required: true,
              item: createScalarDefinition({
                name: "anotherMethod",
                type: "Int32",
                required: false,
              }),
            }),
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              type: "[String]",
              required: true,
              item: createScalarDefinition({
                name: "arg",
                type: "String",
                required: true,
              }),
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "importedObjectMethod",
            return: {
              ...createObjectPropertyDefinition({
                name: "importedObjectMethod",
                type: "TestImport_Object",
                required: true,
              }),
              object: {
                ...createObjectRef({
                  name: "importedObjectMethod",
                  type: "TestImport_Object",
                  required: true,
                }),
              },
            },
          }),
          arguments: [
            {
              ...createObjectPropertyDefinition({
                name: "importedObject",
                type: "TestImport_Object",
                required: true,
              }),
              object: {
                ...createObjectRef({
                  name: "importedObject",
                  type: "TestImport_Object",
                  required: true,
                }),
              },
            },
          ],
        },
        {
          ...createMethodDefinition({
            name: "importedEnumMethod",
            return: createEnumPropertyDefinition({
              name: "importedEnumMethod",
              type: "TestImport_Enum",
              required: true,
            }),
          }),
          arguments: [
            {
              ...createEnumPropertyDefinition({
                name: "enum",
                type: "TestImport_Enum",
                required: true,
              }),
            },
            {
              ...createEnumPropertyDefinition({
                name: "optEnum",
                type: "TestImport_Enum",
                required: false,
              }),
            },
          ],
        },
      ],
    },
    {
      ...createImportedModuleDefinition({
        uri: "interface.uri.eth",
        namespace: "Interface",
        isInterface: false,
        nativeType: "Module",
        comment: "Interface_Module comment",
      }),
      methods: [
        {
          ...createMethodDefinition({
            name: "abstractMethod",
            return: createScalarPropertyDefinition({
              name: "abstractMethod",
              type: "String",
              required: true,
            }),
            comment: "abstractMethod comment",
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "arg",
              type: "UInt8",
              required: true,
            }),
          ],
        },
      ],
    },
  ],
};
