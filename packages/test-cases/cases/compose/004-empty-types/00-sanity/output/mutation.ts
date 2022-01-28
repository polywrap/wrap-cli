import {
  createModuleDefinition,
  createObjectDefinition,
  createTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
      }),
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
      ],
    },
  ],
};
