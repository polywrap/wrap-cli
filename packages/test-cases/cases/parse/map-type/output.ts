import {
  createArrayDefinition,
  createMapKeyDefinition,
  createMapPropertyDefinition,
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectRef,
  createScalarDefinition,
  createScalarPropertyDefinition,
  WrapAbi,
} from "../../../../schema/parse/src/abi";

export const abi: WrapAbi = {
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
      }),
      properties: [
        createMapPropertyDefinition({
          name: "map",
          type: "Map<String, Int>",
          key: createMapKeyDefinition({ name: "map", type: "String", required: true }),
          value: createScalarDefinition({ name: "map", type: "Int" }),
          required: true
        }),
        createMapPropertyDefinition({
          name: "mapOfArr",
          type: "Map<String, [Int]>",
          key: createMapKeyDefinition({ name: "mapOfArr", type: "String", required: true }),
          value: createArrayDefinition({
            name: "mapOfArr",
            type: "[Int]",
            item: createScalarDefinition({ name: "mapOfArr", type: "Int", required: true }),
            required: true
          }),
          required: true
        }),
        createMapPropertyDefinition({
          name: "mapOfObj",
          type: "Map<String, AnotherType>",
          key: createMapKeyDefinition({ name: "mapOfObj", type: "String", required: true }),
          value: createObjectRef({ name: "mapOfObj", type: "AnotherType", required: true }),
          required: true
        }),
        createMapPropertyDefinition({
          name: "mapOfArrOfObj",
          type: "Map<String, [AnotherType]>",
          key: createMapKeyDefinition({ name: "mapOfArrOfObj", type: "String", required: true }),
          value: createArrayDefinition({
            name: "mapOfArrOfObj",
            type: "[AnotherType]",
            item: createObjectRef({ name: "mapOfArrOfObj", type: "AnotherType", required: true }),
            required: true
          }),
          required: true
        }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "AnotherType"
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String"
        }),
      ],
    },
  ],
  moduleType: {
    ...createModuleDefinition({}),
    methods: [
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
    ],
  },
};
