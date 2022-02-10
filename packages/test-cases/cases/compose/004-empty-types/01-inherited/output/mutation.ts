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
      ...createModuleDefinition({ type: "Mutation" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
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
