import {
  createMethodDefinition,
  createQueryDefinition,
  createObjectDefinition,
  TypeInfo,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createImportedObjectDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  environment: {
    query: {},
    mutation: {},
  },
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
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      imports: [
        { type: "Base_ImportedBaseType" },
        { type: "Derived_ImportedDerivedType" },
        { type: "Derived_ImportedBaseType" },
      ],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
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
            type: "query",
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
    {
      ...createQueryDefinition({ type: "Mutation" }),
      imports: [
        { type: "Base_ImportedBaseType" },
        { type: "Derived_ImportedDerivedType" },
        { type: "Derived_ImportedBaseType" },
      ],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
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
            type: "mutation",
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
  ],
  enumTypes: [],
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
  importedQueryTypes: [],
  importedEnumTypes: [],
  interfaceTypes: [],
};
