import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createScalarPropertyDefinition,
  createInterfaceImplementedDefinition,
  createAbi,
  Abi,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
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
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            name: "method1",
            return: createObjectPropertyDefinition({
              name: "method1",
              type: "DerivedType1",
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
              type: "DerivedType2",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
};
