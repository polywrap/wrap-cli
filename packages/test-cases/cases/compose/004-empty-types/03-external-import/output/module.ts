import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  createAbi,
  Abi,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
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
