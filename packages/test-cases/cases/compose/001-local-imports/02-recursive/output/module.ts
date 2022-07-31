import {
  createMethodDefinition,
  createModuleDefinition,
  createScalarPropertyDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createAbi,
  Abi,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
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
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            name: "method",
            return: createObjectPropertyDefinition({
              name: "method",
              type: "TypeA",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
};
