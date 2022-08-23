import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createScalarPropertyDefinition,
  createInterfaceImplementedDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  objectTypes: [
    {
      ...createObjectDefinition({ type: "BaseType1" }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String" })
      ],
    },
    {
      ...createObjectDefinition({ type: "DerivedType1" }),
      interfaces: [
        createInterfaceImplementedDefinition({ type: "BaseType1" }),
      ],
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "Int" }),
        createScalarPropertyDefinition({ name: "str", type: "String" })
      ],
    },
    {
      ...createObjectDefinition({ type: "BaseType2" }),
      properties: [
        createScalarPropertyDefinition({ name: "uint", type: "UInt" })
    ],
    },
    {
      ...createObjectDefinition({ type: "DerivedType2" }),
      interfaces: [
        createInterfaceImplementedDefinition({ type: "BaseType1" }),
        createInterfaceImplementedDefinition({ type: "BaseType2" })
      ],
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "Int" }),
        createScalarPropertyDefinition({ name: "str", type: "String" }),
        createScalarPropertyDefinition({ name: "uint", type: "UInt" })
      ],
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
              type: "DerivedType1",
            }),
          }),
        },
        {
          ...createMethodDefinition({
            name: "method2",
            return: createObjectPropertyDefinition({
              name: "method2",
              type: "DerivedType2",
            }),
          }),
        },
      ],
    },
};
