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
  createMapPropertyDefinition,
  createMapKeyDefinition,
  createImportedModuleDefinition,
  createImportedObjectDefinition,
  createImportedEnumDefinition,
  createInterfaceDefinition,
  createInterfaceImplementedDefinition,
  createObjectRef,
  createEnvDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  envType: createEnvDefinition({
    properties: [
      createScalarPropertyDefinition({
        name: "foo",
        type: "String",
        required: true,
      }),
    ],
  }),
  interfaceTypes: [
    createInterfaceDefinition({
      type: "Namespace",
      namespace: "Namespace",
      uri: "test.eth",
      capabilities: {
        getImplementations: {
          enabled: true,
        },
      },
    }),
  ],
  moduleType: createModuleDefinition({
    comment: "Module comment",
    imports: [
      { type: "Namespace_Module" },
      { type: "Namespace_NestedObjectType" },
      { type: "Namespace_ObjectType" },
      { type: "Namespace_Imported_NestedObjectType" },
      { type: "Namespace_Imported_ObjectType" },
      { type: "Namespace_CustomType" },
      { type: "Namespace_CustomEnum" },
      { type: "Namespace_Imported_Enum" },
      { type: "JustModule_Module" },
      { type: "Interface_InterfaceObject1" },
      { type: "Interface_InterfaceObject2" },
      { type: "Interface_Object" },
      { type: "Interface_NestedInterfaceObject" },
      { type: "Interface_Module" },
      { type: "Interface_ModuleInterfaceArgument" },
      { type: "Interface_NestedModuleInterfaceArgument" },
    ],
    interfaces: [
      createInterfaceImplementedDefinition({ type: "Interface_Module" }),
    ],
    methods: [
      createMethodDefinition({
        name: "method1",
        return: createScalarPropertyDefinition({
          name: "method1",
          type: "String",
          required: true,
        }),
        comment: "method1 comment",
        arguments: [
          createScalarPropertyDefinition({
            name: "str",
            required: true,
            type: "String",
            comment: "str comment",
          }),
          createScalarPropertyDefinition({
            name: "optStr",
            type: "String",
            comment: "optStr comment",
          }),
          createScalarPropertyDefinition({
            name: "u",
            required: true,
            type: "UInt",
          }),
          createArrayPropertyDefinition({
            name: "uArrayArray",
            required: true,
            type: "[[UInt]]",
            item: createArrayDefinition({
              name: "uArrayArray",
              type: "[UInt]",
              item: createScalarDefinition({
                name: "uArrayArray",
                type: "UInt",
              }),
            }),
            comment: "uArrayArray comment",
          }),
          createObjectPropertyDefinition({
            name: "implObject",
            required: true,
            type: "LocalImplementationObject",
            comment: "implObject comment",
          }),
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
            comment: "Map<String!, Int!> comment",
            required: true,
          }),
        ],
      }),
      createMethodDefinition({
        name: "method2",
        comment: "method2 comment",
        return: createArrayPropertyDefinition({
          name: "method2",
          type: "[Int32]",
          required: true,
          item: createScalarDefinition({
            name: "method2",
            required: true,
            type: "Int32",
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
              type: "String",
            }),
          }),
        ],
      }),
      createMethodDefinition({
        name: "abstractModuleMethod",
        return: createObjectPropertyDefinition({
          name: "abstractModuleMethod",
          type: "Interface_InterfaceObject2",
          required: true,
        }),
        arguments: [
          createObjectPropertyDefinition({
            name: "arg",
            required: true,
            type: "Interface_ModuleInterfaceArgument",
          }),
        ],
      }),
    ],
  }),
  objectTypes: [
    createObjectDefinition({
      type: "CustomModuleType",
      comment: "CustomModuleType multi-line comment\nline 2",
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
        }),
        createScalarPropertyDefinition({
          name: "u8",
          type: "UInt8",
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
          item: createScalarDefinition({
            name: "uOptArray",
            type: "UInt",
            required: true,
          }),
        }),
        createArrayPropertyDefinition({
          name: "optStrOptArray",
          type: "[String]",
          item: createScalarDefinition({
            name: "optStrOptArray",
            type: "String",
          }),
        }),
        createArrayPropertyDefinition({
          name: "crazyArray",
          type: "[[[[UInt32]]]]",
          comment: "crazyArray comment",
          item: createArrayDefinition({
            name: "crazyArray",
            type: "[[[UInt32]]]",
            item: createArrayDefinition({
              name: "crazyArray",
              type: "[[UInt32]]",
              item: createArrayDefinition({
                name: "crazyArray",
                type: "[UInt32]",
                item: createScalarDefinition({
                  name: "crazyArray",
                  type: "UInt32",
                  required: true,
                }),
              }),
              required: true,
            }),
          }),
        }),
        createObjectPropertyDefinition({
          name: "commonType",
          type: "CommonType",
          required: true,
        }),
        createMapPropertyDefinition({
          name: "optMap",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({
            name: "optMap",
            type: "String",
            required: true,
          }),
          value: createScalarDefinition({
            name: "optMap",
            type: "Int",
          }),
        }),
        createObjectPropertyDefinition({
          name: "customType",
          type: "Namespace_CustomType",
          required: true,
          comment: "customType comment",
        }),
      ],
    }),
    createObjectDefinition({
      type: "AnotherModuleType",
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String" }),
      ],
    }),
    createObjectDefinition({
      type: "TypeFromInterface",
      interfaces: [
        createInterfaceImplementedDefinition({ type: "AnotherModuleType" }),
      ],
      properties: [
        createScalarPropertyDefinition({
          name: "prop2",
          type: "UInt32",
          required: true,
        }),
        createScalarPropertyDefinition({ name: "prop", type: "String" }),
      ],
    }),
    createObjectDefinition({
      type: "ImplementationObject",
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Interface_InterfaceObject1",
        }),
        createInterfaceImplementedDefinition({
          type: "Interface_InterfaceObject2",
        }),
      ],
      comment: "ImplementationObject comment",
      properties: [
        createScalarPropertyDefinition({
          name: "anotherProp",
          type: "String",
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
        createObjectPropertyDefinition({
          name: "object",
          type: "Interface_Object",
        }),
      ],
    }),
    createObjectDefinition({
      type: "LocalImplementationObject",
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "LocalInterfaceObject",
        }),
      ],
      properties: [
        createScalarPropertyDefinition({
          name: "uint8",
          type: "UInt8",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "str",
          type: "String",
          required: true,
        }),
      ],
    }),
    createObjectDefinition({
      type: "LocalInterfaceObject",
      properties: [
        createScalarPropertyDefinition({
          name: "str",
          type: "String",
          required: true,
        }),
      ],
    }),
    createObjectDefinition({
      type: "CommonType",
      comment: "CommonType comment",
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "UInt8",
          required: true,
        }),
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "NestedType",
          required: true,
        }),
        createArrayPropertyDefinition({
          name: "objectArray",
          type: "[[ArrayObject]]",
          required: true,
          comment: "objectArray comment",
          item: createArrayDefinition({
            name: "objectArray",
            type: "[ArrayObject]",
            item: createObjectRef({
              name: "objectArray",
              type: "ArrayObject",
            }),
          }),
        }),
        createObjectPropertyDefinition({
          name: "anotherLocal",
          type: "AnotherLocal",
          required: true,
        }),
      ],
    }),
    createObjectDefinition({
      type: "NestedType",
      comment: "NestedType comment",
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          required: true,
        }),
      ],
    }),
    createObjectDefinition({
      type: "ArrayObject",
      comment: "ArrayObject comment",
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          required: true,
        }),
      ],
    }),
    createObjectDefinition({
      type: "AnotherLocal",
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          required: true,
        }),
      ],
    }),
  ],
  importedModuleTypes: [
    createImportedModuleDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "Module",
      isInterface: true,
      comment: "Module comment",
      methods: [
        createMethodDefinition({
          name: "method1",
          return: createScalarPropertyDefinition({
            name: "method1",
            type: "String",
            required: true,
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String",
            }),
            createScalarPropertyDefinition({
              name: "optStr",
              type: "String",
            }),
            createScalarPropertyDefinition({
              name: "u",
              required: true,
              type: "UInt",
            }),
            createScalarPropertyDefinition({
              name: "optU",
              type: "UInt",
            }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              required: true,
              type: "[[UInt]]",
              item: createArrayDefinition({
                name: "uArrayArray",
                type: "[UInt]",
                item: createScalarDefinition({
                  name: "uArrayArray",
                  type: "UInt",
                }),
              }),
            }),
          ],
        }),
        createMethodDefinition({
          name: "method2",
          comment: "method2 comment",
          return: createArrayPropertyDefinition({
            name: "method2",
            type: "[Int32]",
            required: true,
            item: createScalarDefinition({
              name: "method2",
              required: true,
              type: "Int32",
            }),
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
                type: "String",
              }),
            }),
          ],
        }),
        createMethodDefinition({
          name: "localObjects",
          return: createObjectPropertyDefinition({
            name: "localObjects",
            type: "Namespace_NestedObjectType",
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "nestedLocalObject",
              type: "Namespace_NestedObjectType",
            }),
            createArrayPropertyDefinition({
              name: "localObjectArray",
              type: "[Namespace_NestedObjectType]",
              item: createObjectRef({
                name: "localObjectArray",
                required: true,
                type: "Namespace_NestedObjectType",
              }),
            }),
          ],
        }),
        createMethodDefinition({
          name: "importedObjects",
          return: createObjectPropertyDefinition({
            name: "importedObjects",
            type: "Namespace_Imported_NestedObjectType",
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "nestedLocalObject",
              type: "Namespace_Imported_NestedObjectType",
            }),
            createArrayPropertyDefinition({
              name: "localObjectArray",
              type: "[Namespace_Imported_NestedObjectType]",
              item: createObjectRef({
                name: "localObjectArray",
                required: true,
                type: "Namespace_Imported_NestedObjectType",
              }),
            }),
          ],
        }),
      ],
    }),
    createImportedModuleDefinition({
      uri: "just.module.eth",
      namespace: "JustModule",
      isInterface: false,
      nativeType: "Module",
      methods: [
        createMethodDefinition({
          name: "method",
          return: createArrayPropertyDefinition({
            name: "method",
            type: "[Int32]",
            required: true,
            item: createScalarDefinition({
              name: "method",
              type: "Int32",
              required: true,
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
                type: "String",
              }),
            }),
          ],
        }),
      ],
    }),
    createImportedModuleDefinition({
      uri: "test-interface.eth",
      namespace: "Interface",
      nativeType: "Module",
      isInterface: false,
      comment: "Module comment",
      methods: [
        createMethodDefinition({
          name: "abstractModuleMethod",
          comment: "abstractModuleMethod comment",
          return: createObjectPropertyDefinition({
            name: "abstractModuleMethod",
            type: "Interface_InterfaceObject2",
            required: true,
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "arg",
              comment: "arg comment",
              required: true,
              type: "Interface_ModuleInterfaceArgument",
            }),
          ],
        }),
      ],
    }),
  ],
  importedObjectTypes: [
    createImportedObjectDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "NestedObjectType",
      type: "Namespace_NestedObjectType",
      properties: [
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "Namespace_ObjectType",
          required: true,
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "ObjectType",
      type: "Namespace_ObjectType",
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          required: true,
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "Imported_NestedObjectType",
      type: "Namespace_Imported_NestedObjectType",
      comment: "Imported_NestedObjectType comment",
      properties: [
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "Namespace_Imported_ObjectType",
          required: true,
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "Imported_ObjectType",
      type: "Namespace_Imported_ObjectType",
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
          required: true,
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "CustomType",
      type: "Namespace_CustomType",
      comment: "CustomType comment",
      properties: [
        createScalarPropertyDefinition({
          name: "str",
          type: "String",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "optStr",
          type: "String",
        }),
        createScalarPropertyDefinition({
          name: "u",
          type: "UInt",
          required: true,
        }),
        createScalarPropertyDefinition({
          name: "optU",
          type: "UInt",
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
          item: createScalarDefinition({
            name: "uOptArray",
            type: "UInt",
            required: true,
          }),
        }),
        createArrayPropertyDefinition({
          name: "optUOptArray",
          type: "[UInt]",
          item: createScalarDefinition({
            name: "optUOptArray",
            type: "UInt",
          }),
        }),
        createArrayPropertyDefinition({
          name: "optStrOptArray",
          type: "[String]",
          item: createScalarDefinition({
            name: "optStrOptArray",
            type: "String",
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
            item: createScalarDefinition({
              name: "uOptArrayOptArray",
              type: "UInt32",
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
          item: createArrayDefinition({
            name: "crazyArray",
            type: "[[[UInt32]]]",
            item: createArrayDefinition({
              name: "crazyArray",
              type: "[[UInt32]]",
              required: true,
              item: createArrayDefinition({
                name: "crazyArray",
                type: "[UInt32]",
                item: createScalarDefinition({
                  name: "crazyArray",
                  type: "UInt32",
                  required: true,
                }),
              }),
            }),
          }),
        }),
        createObjectPropertyDefinition({
          name: "object",
          type: "Namespace_ObjectType",
          required: true,
        }),
        createObjectPropertyDefinition({
          name: "optObject",
          type: "Namespace_ObjectType",
        }),
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "Namespace_NestedObjectType",
          required: true,
        }),
        createObjectPropertyDefinition({
          name: "optNestedObject",
          type: "Namespace_NestedObjectType",
        }),
        createArrayPropertyDefinition({
          name: "optNestedObjectArray",
          type: "[Namespace_NestedObjectType]",
          required: true,
          item: createObjectRef({
            name: "optNestedObjectArray",
            type: "Namespace_NestedObjectType",
          }),
        }),
        createObjectPropertyDefinition({
          name: "importedNestedObject",
          type: "Namespace_Imported_NestedObjectType",
          required: true,
        }),
        createArrayPropertyDefinition({
          name: "optImportedNestedObjectArray",
          type: "[Namespace_Imported_NestedObjectType]",
          required: true,
          item: createObjectRef({
            name: "optImportedNestedObjectArray",
            type: "Namespace_Imported_NestedObjectType",
          }),
        }),
        createEnumPropertyDefinition({
          name: "enum",
          type: "Namespace_CustomEnum",
          required: true,
        }),
        createEnumPropertyDefinition({
          name: "optEnum",
          type: "Namespace_CustomEnum",
        }),
        createEnumPropertyDefinition({
          name: "importedEnum",
          type: "Namespace_Imported_Enum",
          required: true,
        }),
        createEnumPropertyDefinition({
          name: "optImportedEnum",
          type: "Namespace_Imported_Enum",
          comment: "optImportedEnum comment",
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test-interface.eth",
      namespace: "Interface",
      nativeType: "InterfaceObject1",
      type: "Interface_InterfaceObject1",
      comment: "InterfaceObject1 comment",
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
          comment: "InterfaceObject1_uint8 comment",
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test-interface.eth",
      namespace: "Interface",
      nativeType: "InterfaceObject2",
      type: "Interface_InterfaceObject2",
      comment: "InterfaceObject2 comment",
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Interface_NestedInterfaceObject",
        }),
      ],
      properties: [
        createScalarPropertyDefinition({
          name: "str2",
          type: "String",
          required: true,
        }),
        createObjectPropertyDefinition({
          name: "object",
          type: "Interface_Object",
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test-interface.eth",
      namespace: "Interface",
      nativeType: "Object",
      type: "Interface_Object",
      comment: "Object comment",
      properties: [
        createScalarPropertyDefinition({
          name: "uint8",
          type: "UInt8",
          required: true,
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test-interface.eth",
      namespace: "Interface",
      nativeType: "NestedInterfaceObject",
      type: "Interface_NestedInterfaceObject",
      comment: "NestedInterfaceObject comment",
      properties: [
        createObjectPropertyDefinition({
          name: "object",
          type: "Interface_Object",
          comment: "object comment",
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test-interface.eth",
      namespace: "Interface",
      nativeType: "ModuleInterfaceArgument",
      type: "Interface_ModuleInterfaceArgument",
      comment: "ModuleInterfaceArgument comment",
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Interface_NestedModuleInterfaceArgument",
        }),
      ],
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
          comment: "uint8 comment",
        }),
      ],
    }),
    createImportedObjectDefinition({
      uri: "test-interface.eth",
      namespace: "Interface",
      nativeType: "NestedModuleInterfaceArgument",
      type: "Interface_NestedModuleInterfaceArgument",
      comment: "NestedModuleInterfaceArgument comment",
      properties: [
        createScalarPropertyDefinition({
          name: "uint8",
          type: "UInt8",
          required: true,
        }),
      ],
    }),
  ],
  importedEnumTypes: [
    createImportedEnumDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "CustomEnum",
      type: "Namespace_CustomEnum",
      constants: ["STRING", "BYTES"],
    }),
    createImportedEnumDefinition({
      uri: "test.eth",
      namespace: "Namespace",
      nativeType: "Imported_Enum",
      type: "Namespace_Imported_Enum",
      constants: ["STRING", "BYTES"],
      comment: "Imported_Enum comment",
    }),
  ],
};
