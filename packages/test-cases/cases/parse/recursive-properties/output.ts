import {
  Abi,
  createAbi,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createArrayPropertyDefinition,
  createObjectRef,
} from "../../../../schema/parse/src/abi";

export const abi: Abi = {
  ...createAbi(),
  objectTypes: [
    {
      ...createObjectDefinition({ type: "Object" }),
      properties: [
        createObjectPropertyDefinition({
          name: "recursive",
          type: "Object",
          required: false
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
          required: false,
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
            required: false,
          })
        }),
        createArrayPropertyDefinition({
          name: "recursiveOptArrayOpt",
          type: "[Object]",
          required: false,
          item: createObjectRef({
            name: "recursiveOptArrayOpt",
            type: "Object",
            required: false,
          })
        }),
      ],
    },
  ],
}