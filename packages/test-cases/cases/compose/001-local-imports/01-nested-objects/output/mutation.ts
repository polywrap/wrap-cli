import {
  createMethodDefinition,
  createModuleDefinition,
  createScalarPropertyDefinition,
  createObjectDefinition,
  TypeInfo,
  createObjectPropertyDefinition,
  createTypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
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
        type: "TypeB",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "String",
        }),
      ],
    },
  ],
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Mutation" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
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
  ],
};
