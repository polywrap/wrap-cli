import {
  createArrayDefinition,
  createInterfaceImplementedDefinition,
  createMapKeyDefinition,
  createMapPropertyDefinition,
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createScalarDefinition,
  createAbi,
  Abi,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "BaseType",
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
      ...createObjectDefinition({
        type: "DerivedType",
        interfaces: [
          createInterfaceImplementedDefinition({
            type: "BaseType",
          }),
        ],
      }),
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
      ...createObjectDefinition({
        type: "ImportedDerivedType",
        interfaces: [
          createInterfaceImplementedDefinition({
            type: "ImportedBaseType",
          }),
        ],
      }),
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
      ...createObjectDefinition({
        type: "ImportedBaseType",
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
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            name: "method",
            return: createMapPropertyDefinition({
              name: "method",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "method",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "method",
                type: "Int",
                required: true,
              }),
              required: true,
            }),
            arguments: [
              {
                ...createObjectPropertyDefinition({
                  name: "args",
                  type: "DerivedType",
                  required: true,            
                })
              },
              {
                ...createObjectPropertyDefinition({
                  name: "importedArgs",
                  type: "ImportedDerivedType",
                  required: true,            
                })
              }
            ],
          }),
        },
      ],
    },
};
