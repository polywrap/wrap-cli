import {
  createMethodDefinition,
  createModuleDefinition,
  createScalarPropertyDefinition,
  createEnvDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  envType: createEnvDefinition({
    properties: [
      createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
    ],
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
      ]
    }
}
