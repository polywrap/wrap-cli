import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "BaseType",
      }),
    },
    {
      ...createObjectDefinition({
        type: "DerivedType",
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "BaseType"
        })
      ],
    },
    {
      ...createObjectDefinition({
        type: "ImportedDerivedType",
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "ImportedBaseType"
        })
      ],
    },
    {
      ...createObjectDefinition({
        type: "ImportedBaseType",
      }),
    },
  ],
  moduleType: {
      ...createModuleDefinition({}),
      methods: [
        {
          ...createMethodDefinition({
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "DerivedType",
            }),
          }),
        },
        {
          ...createMethodDefinition({
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "ImportedDerivedType",
            }),
          }),
        },
      ],
    },
};
