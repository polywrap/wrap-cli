import {
  createQueryDefinition,
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
      ...createQueryDefinition({ type: "Query" }),
      imports: [],
      interfaces: [],
      methods: [
      ],
    },
  ],
};
