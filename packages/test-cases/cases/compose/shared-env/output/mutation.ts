import {
  createMethodDefinition,
  createModuleDefinition,
  createScalarPropertyDefinition,
  createObjectDefinition,
  createTypeInfo,
  createEnvDefinition,
  AnyDefinition,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  envTypes: {
    mutation: createEnvDefinition({
      sanitized: {
        ...createObjectDefinition({
          type: "MutationEnv"
        }),
        properties: [
          {
            ...createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
            first: true,
            last: true,
          } as AnyDefinition,
        ],
      },
    }),
    query: createEnvDefinition({}),
  },
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Mutation" }),
      methods: [
        {
          ...createMethodDefinition({
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
        }
      ]
    }
  ],
}
