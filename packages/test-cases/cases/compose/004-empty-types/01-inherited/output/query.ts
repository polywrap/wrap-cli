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
            name: "method",
            return: createObjectPropertyDefinition({
              name: "method",
              type: "DerivedType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
  ],
};
