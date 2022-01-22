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
      ...createQueryDefinition({ type: "Mutation" }),
      imports: [
        { type: "Namespace_Mutation" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Mutation" })
      ],
      methods: [
      ],
    },
  ],
  importedmoduleTypes: [
    {
      ...createImportedQueryDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Mutation",
        type: "Namespace_Mutation",
        isInterface: false,
      }),
      methods: [
      ]
    },
  ],
};
