import {
  createModuleDefinition,
  createInterfaceImplementedDefinition,
  createImportedModuleDefinition,
  createAbi,
  Abi,
  createMethodDefinition,
  createMapPropertyDefinition,
  createMapKeyDefinition,
  createScalarDefinition,
} from "@polywrap/schema-parse";

export const abi: Abi = {
  ...createAbi(),
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
                required: false,
              }),
              required: true,
            }),
            arguments: [
            ],
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
                required: false,
              }),
              required: true,
            }),
            arguments: [
            ],
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
