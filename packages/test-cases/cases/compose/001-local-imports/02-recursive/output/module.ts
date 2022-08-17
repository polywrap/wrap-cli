import {
  createMethodDefinition,
  createModuleDefinition,
  createScalarPropertyDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "TypeA",
      }),
      properties: [
        createObjectPropertyDefinition({
          name: "prop",
          type: "TypeB",
        }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "TypeC",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
        }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "TypeB",
      }),
      properties: [
        createObjectPropertyDefinition({
          name: "prop",
          type: "TypeC",
        }),
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
            return: createObjectPropertyDefinition({
              name: "method",
              type: "TypeA",
            }),
          }),
        },
      ],
    },
};
