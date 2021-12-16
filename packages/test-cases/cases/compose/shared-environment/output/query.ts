import {
  createArrayPropertyDefinition,
  createMethodDefinition,
  createQueryDefinition,
  createScalarDefinition,
  createScalarPropertyDefinition,
  createArrayDefinition,
  createObjectPropertyDefinition,
  createObjectDefinition,
  createEnumDefinition,
  TypeInfo,
  createEnumPropertyDefinition
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  environment: {
    query: {},
    mutation: {},
  },
  interfaceTypes: [],
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "QueryEnv"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    }
  ],
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
    }
  ],
  enumTypes: [],
  importedObjectTypes: [],
  importedQueryTypes: [],
  importedEnumTypes: [],
}
