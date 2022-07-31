import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createAbi,
  Abi,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "BaseType",
      }),
      properties: [
      ],
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
      properties: [
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
      properties: [
      ],
    },
    {
      ...createObjectDefinition({
        type: "ImportedBaseType",
      }),
      properties: [
      ],
    },
  ],
  moduleType: {
      ...createModuleDefinition({}),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "DerivedType",
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
              type: "ImportedDerivedType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
};
