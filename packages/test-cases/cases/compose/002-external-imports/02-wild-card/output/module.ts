import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectPropertyDefinition,
  createImportedObjectDefinition,
  createScalarPropertyDefinition,
  createAbi,
  Abi,
  createImportedEnvDefinition,
  createImportedModuleDefinition,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
  objectTypes: [
  ],
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [
        { type: "Namespace_ExternalType" },
        { type: "Namespace_ExternalType2" },
        { type: "Namespace_Module" },
        { type: "Namespace_Env" },
      ],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            name: "method",
            return: createObjectPropertyDefinition({
              name: "method",
              type: "Namespace_ExternalType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
  enumTypes: [],
  importedModuleTypes: [
    {
      ...createImportedModuleDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        isInterface: false,
        nativeType: "Module",
      }),
      methods: [
        {
          ...createMethodDefinition({
            name: "envMethod",
            return: createScalarPropertyDefinition({
              name: "envMethod",
              type: "String",
              required: true,
            }),
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "arg",
              type: "String",
              required: true,
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "optEnvMethod",
            return: createScalarPropertyDefinition({
              name: "optEnvMethod",
              type: "String",
              required: true,
            }),
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "arg",
              type: "String",
              required: true,
            }),
          ],
        },
      ],
    }
  ],
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "ExternalType",
        type: "Namespace_ExternalType"
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "str",
          type: "String"
        })
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "ExternalType2",
        type: "Namespace_ExternalType2"
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "foo",
          type: "UInt32"
        })
      ],
    },
  ],
  importedEnvTypes: [
    {
      ...createImportedEnvDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Env",
        type: "Namespace_Env"
      }),
      properties: [
        createObjectPropertyDefinition({
          name: "externalProp",
          type: "Namespace_ExternalType"
        })
      ],
    },
  ]
};
