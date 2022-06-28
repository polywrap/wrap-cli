import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createImportedObjectDefinition,
  createAbi,
  Abi,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
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
      properties: [
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
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "Derived_ImportedDerivedType",
            }),
          }),
          arguments: [
          ],
        },
        {
          ...createMethodDefinition({
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "CustomType",
            }),
          }),
          arguments: [
          ],
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
      properties: [],
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
      properties: [],
    },
    {
      ...createImportedObjectDefinition({
        uri: "derived.eth",
        namespace: "Derived",
        nativeType: "ImportedBaseType",
        type: "Derived_ImportedBaseType"
      }),
      properties: [],
    },
  ],
};
