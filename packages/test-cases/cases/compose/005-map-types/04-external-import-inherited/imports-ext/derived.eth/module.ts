import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    {
      type: "ImportedBaseType",
      kind: 1,
      properties: [
        {
          type: "Map<String, Int>",
          name: "requiredMap",
          required: true,
          kind: 34,
          map: {
            type: "Map<String, Int>",
            name: "requiredMap",
            required: true,
            kind: 262146,
            scalar: {
              type: "Int",
              name: "requiredMap",
              required: true,
              kind: 4
            },
            key: {
              type: "String",
              name: "requiredMap",
              required: true,
              kind: 4
            },
            value: {
              type: "Int",
              name: "requiredMap",
              required: true,
              kind: 4
            }
          }
        }
      ]
    },
    {
      type: "ImportedDerivedType",
      kind: 1,
      properties: [
        {
          type: "Map<String, [Int]>",
          name: "mapOfValueArr",
          required: true,
          kind: 34,
          map: {
            type: "Map<String, [Int]>",
            name: "mapOfValueArr",
            required: true,
            kind: 262146,
            array: {
              type: "[Int]",
              name: "mapOfValueArr",
              required: true,
              kind: 18,
              scalar: {
                type: "Int",
                name: "mapOfValueArr",
                required: true,
                kind: 4
              },
              item: {
                type: "Int",
                name: "mapOfValueArr",
                required: true,
                kind: 4
              }
            },
            key: {
              type: "String",
              name: "mapOfValueArr",
              required: true,
              kind: 4
            },
            value: {
              type: "[Int]",
              name: "mapOfValueArr",
              required: true,
              kind: 18,
              scalar: {
                type: "Int",
                name: "mapOfValueArr",
                required: true,
                kind: 4
              },
              item: {
                type: "Int",
                name: "mapOfValueArr",
                required: true,
                kind: 4
              }
            }
          }
        },
        {
          type: "Map<String, Int>",
          name: "requiredMap",
          required: true,
          kind: 34,
          map: {
            type: "Map<String, Int>",
            name: "requiredMap",
            required: true,
            kind: 262146,
            scalar: {
              type: "Int",
              name: "requiredMap",
              required: true,
              kind: 4
            },
            key: {
              type: "String",
              name: "requiredMap",
              required: true,
              kind: 4
            },
            value: {
              type: "Int",
              name: "requiredMap",
              required: true,
              kind: 4
            }
          }
        }
      ],
      interfaces: [
        {
          type: "ImportedBaseType",
          kind: 2048
        }
      ]
    }
  ]
};
