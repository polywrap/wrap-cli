import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createTypeInfo,
  TypeInfo,
} from "@polywrap/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "BaseType",
      }),
      properties: [
      ],
    },
    {
      ...createObjectDefinition({
        type: "DerivedType",
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "BaseType"
        })
      ],
      properties: [
      ],
    },
    {
      ...createObjectDefinition({
        type: "ImportedDerivedType",
      }),
      interfaces: [
        createInterfaceImplementedDefinition({
          type: "ImportedBaseType"
        })
      ],
      properties: [
      ],
    },
    {
      ...createObjectDefinition({
        type: "ImportedBaseType",
      }),
      properties: [
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
              type: "DerivedType",
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
              type: "ImportedDerivedType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
};
