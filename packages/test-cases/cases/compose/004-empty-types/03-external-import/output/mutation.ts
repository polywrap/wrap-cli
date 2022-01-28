import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  createTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Mutation" }),
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
  importedModuleTypes: [
    {
      ...createImportedModuleDefinition({
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
