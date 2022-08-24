import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  moduleType: {
    type: "Module",
    kind: 128,
    methods: [
      {
        type: "Method",
        name: "method",
        required: true,
        kind: 64,
        arguments: [
          {
            type: "[String]",
            name: "arg",
            required: true,
            kind: 34,
            array: {
              type: "[String]",
              name: "arg",
              required: true,
              kind: 18,
              scalar: {
                type: "String",
                name: "arg",
                required: true,
                kind: 4
              },
              item: {
                type: "String",
                name: "arg",
                required: true,
                kind: 4
              }
            }
          }
        ],
        return: {
          type: "[Int32]",
          name: "method",
          required: true,
          kind: 34,
          array: {
            type: "[Int32]",
            name: "method",
            required: true,
            kind: 18,
            scalar: {
              type: "Int32",
              name: "method",
              required: true,
              kind: 4
            },
            item: {
              type: "Int32",
              name: "method",
              required: true,
              kind: 4
            }
          }
        }
      }
    ]
  }
}