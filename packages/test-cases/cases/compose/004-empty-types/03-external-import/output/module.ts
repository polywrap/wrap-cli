import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  createTypeInfo,
  TypeInfo,
} from "@polywrap/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [
        { type: "Namespace_Module" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Module" })
      ],
      methods: [
      ],
    },
  importedModuleTypes: [
    {
      ...createImportedModuleDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Module",
        isInterface: false,
      }),
      methods: [
      ]
    },
  ],
};
