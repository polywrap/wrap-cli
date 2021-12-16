import {
  createMethodDefinition,
  createQueryDefinition,
  createObjectDefinition,
  TypeInfo,
  createObjectPropertyDefinition,
  createImportedObjectDefinition,
  createScalarPropertyDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  environment: {
    query: {},
    mutation: {},
  },
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
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Mutation" }),
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
  importedQueryTypes: [],
  importedEnumTypes: [],
  interfaceTypes: [],
};
