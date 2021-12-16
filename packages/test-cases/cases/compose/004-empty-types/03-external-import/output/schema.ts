import {
  createQueryDefinition,
  TypeInfo,
  createInterfaceImplementedDefinition,
  createImportedQueryDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  environment: {
    query: {},
    mutation: {},
  },
  objectTypes: [
  ],
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      imports: [
        { type: "Namespace_Query" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Query" })
      ],
      methods: [
      ],
    },
    {
      ...createQueryDefinition({ type: "Mutation" }),
      imports: [
        { type: "Namespace_Mutation" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Mutation" })
      ],
      methods: [
      ],
    },
  ],
  enumTypes: [],
  importedObjectTypes: [
  ],
  importedQueryTypes: [
    {
      ...createImportedQueryDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Query",
        type: "Namespace_Query",
        isInterface: false,
      }),
      methods: [
      ]
    },
    {
      ...createImportedQueryDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Mutation",
        type: "Namespace_Mutation",
        isInterface: false,
      }),
      methods: [
      ]
    },
  ],
  importedEnumTypes: [],
  interfaceTypes: [],
};
