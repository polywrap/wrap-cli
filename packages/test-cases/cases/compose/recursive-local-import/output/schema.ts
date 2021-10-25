import {
  createMethodDefinition,
  createQueryDefinition,
  createScalarPropertyDefinition,
  createObjectDefinition,
  TypeInfo,
  createObjectPropertyDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
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
        createObjectPropertyDefinition({
          name: "prop",
          type: "TypeC",
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
  ],
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
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
    {
      ...createQueryDefinition({ type: "Mutation" }),
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
  enumTypes: [],
  importedObjectTypes: [],
  importedQueryTypes: [],
  importedEnumTypes: [],
};
