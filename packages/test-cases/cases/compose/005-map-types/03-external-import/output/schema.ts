import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  createTypeInfo,
  TypeInfo,
  createScalarDefinition,
  createMapKeyDefinition,
  createMapPropertyDefinition,
  createMethodDefinition,
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
    {
      ...createModuleDefinition({ type: "Mutation" }),
      imports: [
        { type: "Namespace_Mutation" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Mutation" })
      ],
      methods: [
        {
          ...createMethodDefinition({
            name: "updateMap",
            return: createMapPropertyDefinition({
              name: "updateMap",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "updateMap",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "updateMap",
                type: "Int",
                required: false,
              }),
              required: true,
            }),
            arguments: [
              {...createMapPropertyDefinition({
                name: "map",
                type: "Map<String, Int>",
                key: createMapKeyDefinition({
                  name: "map",
                  type: "String",
                  required: true,
                }),
                value: createScalarDefinition({
                  name: "map",
                  type: "Int",
                  required: false,
                }),
                required: true,
              })}
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
    {
      ...createImportedModuleDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Mutation",
        type: "Namespace_Mutation",
        isInterface: false,
      }),
      methods: [
        {
          ...createMethodDefinition({
            name: "updateMap",
            return: createMapPropertyDefinition({
              name: "updateMap",
              type: "Map<String, Int>",
              key: createMapKeyDefinition({
                name: "updateMap",
                type: "String",
                required: true,
              }),
              value: createScalarDefinition({
                name: "updateMap",
                type: "Int",
                required: false,
              }),
              required: true,
            }),
            arguments: [
              {...createMapPropertyDefinition({
                name: "map",
                type: "Map<String, Int>",
                key: createMapKeyDefinition({
                  name: "map",
                  type: "String",
                  required: true,
                }),
                value: createScalarDefinition({
                  name: "map",
                  type: "Int",
                  required: false,
                }),
                required: true,
              })}
            ],
          }),
        },
      ]
    },
  ],
};
