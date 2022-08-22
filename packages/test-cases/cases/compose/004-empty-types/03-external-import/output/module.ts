import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [
        { type: "Namespace_Module" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Module" })
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
    },
  ],
};
