import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  createTypeInfo,
  TypeInfo,
  createMethodDefinition,
  createMapPropertyDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Query" }),
      imports: [
        { type: "Namespace_Query" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Query" })
      ],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "getMap",
            return: createMapPropertyDefinition({
              name: "getMap",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "getMap",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "getMap",
                type: "Int",
                required: false,
              }),
              required: true,
            }),
            arguments: [
            ],
          }),
        },
      ],
    },
  ],
  importedModuleTypes: [
    {
      ...createImportedModuleDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Query",
        type: "Namespace_Query",
        isInterface: false,
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "getMap",
            return: createMapPropertyDefinition({
              name: "getMap",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "getMap",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "getMap",
                type: "Int",
                required: false,
              }),
              required: true,
            }),
            arguments: [
            ],
          }),
        },
      ]
    },
  ],
};
