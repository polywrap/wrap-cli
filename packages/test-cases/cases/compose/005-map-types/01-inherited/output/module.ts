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
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
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
        type: "InheritedType",
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
  ],
  moduleType:
    {
      ...createModuleDefinition({}),
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
                ...createMapPropertyDefinition({
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
                  required: true,
                }),
              },
              {
                ...createObjectPropertyDefinition({
                  name: "other",
                  type: "InheritedType",
                  required: true,            
                })
              }
            ],
          }),
        },
      ],
    },
};
