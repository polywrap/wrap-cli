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
            type: "mutation",
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
        nativeType: "Mutation",
        type: "Namespace_Mutation",
        isInterface: false,
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
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
