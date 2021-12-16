import {
  createMethodDefinition,
  createQueryDefinition,
  createObjectDefinition,
  TypeInfo,
  createObjectPropertyDefinition,
  createScalarPropertyDefinition,
  createInterfaceImplementedDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  environment: {
    query: {},
    mutation: {},
  },
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
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
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
            type: "query",
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
    {
      ...createQueryDefinition({ type: "Mutation" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
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
            type: "mutation",
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
  ],
  enumTypes: [],
  importedObjectTypes: [],
  importedQueryTypes: [],
  importedEnumTypes: [],
  interfaceTypes: [],
};
