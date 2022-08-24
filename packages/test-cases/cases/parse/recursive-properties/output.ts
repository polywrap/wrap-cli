import {
  WrapAbi,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createArrayPropertyDefinition,
  createObjectRef,
} from "../../../../schema/parse/src/abi";

export const abi: WrapAbi = {
  version: "0.1",
  objectTypes: [
    {
      ...createObjectDefinition({ type: "Object" }),
      properties: [
        createObjectPropertyDefinition({
          name: "recursive",
          type: "Object",
        }),
        createArrayPropertyDefinition({
          name: "recursiveArray",
          type: "[Object]",
          required: true,
          item: createObjectRef({
            name: "recursiveArray",
            type: "Object",
            required: true,
          })
        }),
        createArrayPropertyDefinition({
          name: "recursiveOptArray",
          type: "[Object]",
          item: createObjectRef({
            name: "recursiveOptArray",
            type: "Object",
            required: true,
          })
        }),
        createArrayPropertyDefinition({
          name: "recursiveArrayOpt",
          type: "[Object]",
          required: true,
          item: createObjectRef({
            name: "recursiveArrayOpt",
            type: "Object",
          })
        }),
        createArrayPropertyDefinition({
          name: "recursiveOptArrayOpt",
          type: "[Object]",
          item: createObjectRef({
            name: "recursiveOptArrayOpt",
            type: "Object",
          })
        }),
      ],
    },
  ],
}