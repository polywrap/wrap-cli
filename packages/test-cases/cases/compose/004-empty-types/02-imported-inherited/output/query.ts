import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectDefinition,
  createObjectPropertyDefinition,
  createInterfaceImplementedDefinition,
  createTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";

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
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Query" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
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
            type: "query",
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
  ],
};
