import {
  createMethodDefinition,
  createQueryDefinition,
  createScalarPropertyDefinition,
  createObjectDefinition,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  environment: {
    query: {},
    mutation: {},
  },
  interfaceTypes: [],
  importedObjectTypes: [],
  importedEnumTypes: [],
  importedQueryTypes: [],
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method",
            return: createScalarPropertyDefinition({
              name: "method",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String"
            }),
          ]
        },
      ]
    },
    {
      ...createQueryDefinition({ type: "Mutation" }),
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method",
            return: createScalarPropertyDefinition({
              name: "method",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String"
            }),
          ]
        },
      ]
    }
  ],
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "QueryEnv"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "MutationEnv"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    },
  ],
  enumTypes: []
}
