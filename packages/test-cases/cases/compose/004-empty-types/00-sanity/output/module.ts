import {
  createModuleDefinition,
  createObjectDefinition,
  createTypeInfo,
  TypeInfo,
} from "@polywrap/schema-parse";

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
  moduleType: {
      ...createModuleDefinition({}),
      imports: [],
      interfaces: [],
      methods: [
      ],
    },
};
