import {
  createMethodDefinition,
  createModuleDefinition,
  createScalarPropertyDefinition,
  createObjectDefinition,
  createAbi,
  createEnvDefinition,
  Abi,
  createObjectPropertyDefinition,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
  envType: createEnvDefinition({
      sanitized: {
        ...createObjectDefinition({
          type: "Env"
        }),
        properties: [
          createScalarPropertyDefinition({ name: "after", type: "String", required: true }),
        ],
      },
      client: {
        ...createObjectDefinition({
          type: "ClientEnv"
        }),
        properties: [
          createScalarPropertyDefinition({ name: "before", type: "UInt32", required: true }),
        ],
      }
    }),
  moduleType:
    {
      ...createModuleDefinition({}),
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
        },
        {
          ...createMethodDefinition({
            name: "sanitizeEnv",
            return: createObjectPropertyDefinition({
              name: "sanitizeEnv",
              type: "Env",
              required: true
            })
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "env",
              required: true,
              type: "ClientEnv"
            }),
          ]
        },
      ]
    }
}
