import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectPropertyDefinition,
  createScalarPropertyDefinition,
  WrapAbi,
  createObjectDefinition,
  createEnvDefinition,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  moduleType: createModuleDefinition({
    methods: [
      createMethodDefinition({
        name: "envMethod",
        return: createScalarPropertyDefinition({
          name: "envMethod",
          type: "String",
          required: true,
        }),
        arguments: [
          createScalarPropertyDefinition({
            name: "arg",
            type: "String",
            required: true,
          }),
        ],
        env: {
          required: true
        }
      }),
      createMethodDefinition({
        name: "optEnvMethod",
        return: createScalarPropertyDefinition({
          name: "optEnvMethod",
          type: "String",
          required: true,
        }),
        arguments: [
          createScalarPropertyDefinition({
            name: "arg",
            type: "String",
            required: true,
          }),
        ],
        env: {
          required: false
        }
      }),
    ]
  }),
  objectTypes: [
    createObjectDefinition({
      type: "ExternalType",
      properties: [
        createScalarPropertyDefinition({
          name: "str",
          type: "String"
        })
      ],
    }),
  ],
  envType: createEnvDefinition({
    properties: [
      createObjectPropertyDefinition({
        name: "externalProp",
        type: "ExternalType"
      })
    ]
  })
};
