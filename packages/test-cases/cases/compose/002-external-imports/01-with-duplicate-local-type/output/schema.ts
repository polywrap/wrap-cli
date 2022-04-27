import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createImportedObjectDefinition,
  createScalarPropertyDefinition,
  createTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
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
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Query" }),
      imports: [
        { type: "Namespace_ExternalType" }
      ],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "Namespace_ExternalType",
            }),
          }),
          arguments: [
          ],
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "LocalType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
    {
      ...createModuleDefinition({ type: "Mutation" }),
      imports: [
        { type: "Namespace_ExternalType" }
      ],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "Namespace_ExternalType",
            }),
          }),
          arguments: [
          ],
        },
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "LocalType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
  ],
  enumTypes: [],
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
