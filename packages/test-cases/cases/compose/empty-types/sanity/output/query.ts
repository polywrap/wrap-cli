import {
  createMethodDefinition,
  createQueryDefinition,
  createObjectDefinition,
  TypeInfo,
  createObjectPropertyDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
      }),
      properties: [
      ],
    },
  ],
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      imports: [],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method",
            return: createObjectPropertyDefinition({
              name: "method",
              type: "CustomType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
  ],
  enumTypes: [],
  importedObjectTypes: [],
  importedQueryTypes: [],
  importedEnumTypes: [],
};
