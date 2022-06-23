import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectPropertyDefinition,
  createImportedObjectDefinition,
  createScalarPropertyDefinition,
  createTypeInfo,
  TypeInfo,
  createImportedModuleDefinition,
} from "@polywrap/schema-parse";
import { createImportedEnvDefinition } from "@polywrap/schema-parse/src/typeInfo";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  objectTypes: [
  ],
  moduleType: {
      ...createModuleDefinition({}),
      imports: [
        { type: "Namespace_ExternalType" },
        { type: "Namespace_Env" },
        { type: "Namespace_Module" }
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
            return: createObjectPropertyDefinition({
              name: "envMethod",
              type: "Namespace_Env",
              required: true,
            }),
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "env",
              type: "Namespace_Env",
              required: true,
            }),
          ],
        },
        {
          ...createMethodDefinition({
            name: "optEnvMethod",
            return: createObjectPropertyDefinition({
              name: "optEnvMethod",
              type: "Namespace_Env",
              required: false,
            }),
          }),
          arguments: [
            createObjectPropertyDefinition({
              name: "env",
              type: "Namespace_Env",
              required: false,
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
