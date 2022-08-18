import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  createMethodDefinition,
  createMapPropertyDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  moduleType:
    {
      ...createModuleDefinition({}),
      imports: [
        { type: "Namespace_Module" },
      ],
      interfaces: [
        createInterfaceImplementedDefinition({ type: "Namespace_Module" })
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
                required: undefined,
              }),
              required: true,
            }),
          }),
        },
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
                required: undefined,
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
                  required: undefined,
                }),
                required: true,
              })}
            ],
          }),
        },
      ],
    },
  importedModuleTypes: [
    {
      ...createImportedModuleDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "Module",
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
                required: undefined,
              }),
              required: true,
            }),
          }),
        },
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
                required: undefined,
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
                  required: undefined,
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
