import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createImportedObjectDefinition,
  WrapAbi
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Base_ImportedBaseType"
        })
      ],
    },
  ],
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [
        { type: "Base_ImportedBaseType" },
        { type: "Derived_ImportedDerivedType" },
        { type: "Derived_ImportedBaseType" },
      ],
      methods: [
        {
          ...createMethodDefinition({
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "Derived_ImportedDerivedType",
            }),
          }),
        },
        {
          ...createMethodDefinition({
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "CustomType",
            }),
          }),
        },
      ],
    },
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "base.eth",
        namespace: "Base",
        nativeType: "ImportedBaseType",
        type: "Base_ImportedBaseType"
      }),
    },
    {
      ...createImportedObjectDefinition({
        uri: "derived.eth",
        namespace: "Derived",
        nativeType: "ImportedDerivedType",
        type: "Derived_ImportedDerivedType"
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "Derived_ImportedBaseType"
        })
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "derived.eth",
        namespace: "Derived",
        nativeType: "ImportedBaseType",
        type: "Derived_ImportedBaseType"
      }),
    },
  ],
};
