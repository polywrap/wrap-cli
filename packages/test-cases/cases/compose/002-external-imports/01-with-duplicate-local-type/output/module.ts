import {
  createObjectDefinition,
  createMethodDefinition,
  createModuleDefinition,
  createObjectPropertyDefinition,
  createImportedObjectDefinition,
  createScalarPropertyDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  objectTypes: [
    {
      ...createObjectDefinition({ type: "LocalType" }),
      properties: [
        createObjectPropertyDefinition({
          name: "prop",
          type: "Namespace_ExternalType",
        }),
      ],
    },
  ],
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [
        { type: "Namespace_ExternalType" }
      ],
      methods: [
        {
          ...createMethodDefinition({
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "Namespace_ExternalType",
            }),
          }),
        },
        {
          ...createMethodDefinition({
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "LocalType",
            }),
          }),
        },
      ],
    },
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
};
