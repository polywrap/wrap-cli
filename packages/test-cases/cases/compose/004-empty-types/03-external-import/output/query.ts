import {
  createQueryDefinition,
  createInterfaceImplementedDefinition,
  createImportedQueryDefinition,
  createTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  moduleTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      imports: [
        { type: "Namespace_Query" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Query" })
      ],
      methods: [
      ],
    },
  ],
  importedModuleTypes: [
    {
      ...createImportedQueryDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Query",
        type: "Namespace_Query",
        isInterface: false,
      }),
      methods: [
      ]
    },
  ],
};
