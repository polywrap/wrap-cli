import {
  createArrayDefinition,
  createMapKeyDefinition,
  createMapDefinition,
  createMapPropertyDefinition,
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createScalarDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    createObjectDefinition({
      type: "SimpleType",
      properties: [
        createMapPropertyDefinition({
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
        createMapPropertyDefinition({
          name: "optionalMap",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({
            name: "optionalMap",
            type: "String",
            required: true,
          }),
          value: createScalarDefinition({
            name: "optionalMap",
            type: "Int",
            required: true,
          }),
        }),
        createMapPropertyDefinition({
          name: "optionalValueMap",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({
            name: "optionalValueMap",
            type: "String",
            required: true,
          }),
          value: createScalarDefinition({
            name: "optionalValueMap",
            type: "Int",
          }),
        }),
        createMapPropertyDefinition({
          name: "optionalKeyMap",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({
            name: "optionalKeyMap",
            type: "String",
            required: true,
          }),
          value: createScalarDefinition({
            name: "optionalKeyMap",
            type: "Int",
            required: true,
          }),
          required: true,
        }),
      ],
    }),
    createObjectDefinition({
      type: "RecursiveType",
      properties: [
        createMapPropertyDefinition({
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
        createMapPropertyDefinition({
          name: "mapOfMap",
          type: "Map<String, Map<String, Int>>",
          key: createMapKeyDefinition({
            name: "mapOfMap",
            type: "String",
            required: true,
          }),
          value: createMapDefinition({
            name: "mapOfMap",
            type: "Map<String, Int>",
            key: createMapKeyDefinition({
              name: "mapOfMap",
              type: "String",
              required: true,
            }),
            value: createScalarDefinition({
              name: "mapOfMap",
              type: "Int",
              required: true,
            }),
            required: true,
          }),
          required: true
        }),
      ],
    }),
  ],
  moduleType: createModuleDefinition({
    methods: [
      createMethodDefinition({
        name: "requiredMapArgs",
        return: createMapPropertyDefinition({
          name: "requiredMapArgs",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({
            name: "requiredMapArgs",
            type: "String",
            required: true,
          }),
          value: createScalarDefinition({
            name: "requiredMapArgs",
            type: "Int",
            required: true,
          }),
          required: true,
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
            required: true,
          }),
        ],
      }),
      createMethodDefinition({
        name: "optionalMapArgs",
        return: createMapPropertyDefinition({
          name: "optionalMapArgs",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({
            name: "optionalMapArgs",
            type: "String",
            required: true,
          }),
          value: createScalarDefinition({
            name: "optionalMapArgs",
            type: "Int",
            required: true,
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
      }),
      createMethodDefinition({
        name: "optionalValueArgs",
        return: createMapPropertyDefinition({
          name: "optionalValueArgs",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({
            name: "optionalValueArgs",
            type: "String",
            required: true,
          }),
          value: createScalarDefinition({
            name: "optionalValueArgs",
            type: "Int",
          }),
          required: true,
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
            }),
            required: true,
          }),
        ],
      }),
    ],
  }),
};
