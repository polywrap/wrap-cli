import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createImportedObjectDefinition,
  createMapPropertyDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
  createArrayDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Base_ImportedBaseType"
        })
      ],
      properties: [
        {
          ...createMapPropertyDefinition({
            name: "requiredMap",
            type: "Map<String, Int>",
            key: createMapKeyDefinition({
              name: "requiredMap",
              type: "String",
              required: true,
            }),
            value: createScalarDefinition({
              name: "requiredMap",
              type: "Int",
              required: true,
            }),
            required: true,
          }),
        },
      ],
    },
  ],
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [
        { type: "Base_ImportedBaseType" },
        { type: "Derived_ImportedDerivedType" },
        { type: "Derived_ImportedBaseType" },
      ],
      methods: [
        {
          ...createMethodDefinition({
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "Derived_ImportedDerivedType",
            }),
          }),
        },
        {
          ...createMethodDefinition({
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "CustomType",
            }),
          }),
        },
      ],
    },
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "base.eth",
        namespace: "Base",
        nativeType: "ImportedBaseType",
        type: "Base_ImportedBaseType"
      }),
      properties: [
        {
          ...createMapPropertyDefinition({
            name: "requiredMap",
            type: "Map<String, Int>",
            key: createMapKeyDefinition({
              name: "requiredMap",
              type: "String",
              required: true,
            }),
            value: createScalarDefinition({
              name: "requiredMap",
              type: "Int",
              required: true,
            }),
            required: true,
          }),
        },
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "derived.eth",
        namespace: "Derived",
        nativeType: "ImportedDerivedType",
        type: "Derived_ImportedDerivedType"
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Derived_ImportedBaseType"
        })
      ],
      properties: [
        {
          ...createMapPropertyDefinition({
            name: "mapOfValueArr",
            type: "Map<String, [Int]>",
            key: createMapKeyDefinition({
              name: "mapOfValueArr",
              type: "String",
              required: true,
            }),
            value: createArrayDefinition({
              name: "mapOfValueArr",
              type: "[Int]",
              item: createScalarDefinition({
                name: "mapOfValueArr",
                type: "Int",
                required: true,
              }),
              required: true,
            }),
            required: true,
          }),
        },
        {
          ...createMapPropertyDefinition({
            name: "requiredMap",
            type: "Map<String, Int>",
            key: createMapKeyDefinition({
              name: "requiredMap",
              type: "String",
              required: true,
            }),
            value: createScalarDefinition({
              name: "requiredMap",
              type: "Int",
              required: true,
            }),
            required: true,
          }),
        },
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "derived.eth",
        namespace: "Derived",
        nativeType: "ImportedBaseType",
        type: "Derived_ImportedBaseType"
      }),
      properties: [
        {
          ...createMapPropertyDefinition({
            name: "requiredMap",
            type: "Map<String, Int>",
            key: createMapKeyDefinition({
              name: "requiredMap",
              type: "String",
              required: true,
            }),
            value: createScalarDefinition({
              name: "requiredMap",
              type: "Int",
              required: true,
            }),
            required: true,
          }),
        },
      ],
    },
  ],
};
