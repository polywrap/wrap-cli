import {
  createMethodDefinition,
  createModuleDefinition,
  createObjectPropertyDefinition,
  createImportedObjectDefinition,
  createScalarPropertyDefinition,
  createTypeInfo,
  TypeInfo,
  createImportedUnionDefinition,
  createObjectRef,
  createUnionPropertyDefinition,
  GenericDefinition,
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  ...createTypeInfo(),
  objectTypes: [
  ],
  moduleTypes: [
    {
      ...createModuleDefinition({ type: "Mutation" }),
      imports: [
        { type: "Namespace_ExternalType" },
        { type: "Namespace_ExtMembTypeA" },
        { type: "Namespace_ExtMembTypeObj" },
        { type: "Namespace_ExtMembTypeB" },
        { type: "Namespace_ExtUnion" },
      ],
      interfaces: [],
      methods: [
        {
          ...createMethodDefinition({
            type: "mutation",
            name: "method",
            return: createObjectPropertyDefinition({
              name: "method",
              type: "Namespace_ExternalType",
            }),
          }),
          arguments: [
          ],
        },
      ],
    },
  ],
  enumTypes: [],
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "ExternalType",
        type: "Namespace_ExternalType",
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "str",
          type: "String",
          required: true
        }),
        createUnionPropertyDefinition({ name: "union", type: "Namespace_ExtUnion", required: true })
      ],
    },
    {
      ...createImportedObjectDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "ExtMembTypeA",
        type: "Namespace_ExtMembTypeA"
      }),
      properties: [
        createObjectPropertyDefinition({
          name: "nested",
          type: "Namespace_ExtMembTypeObj",
          required: true
        }),
      ]
    },
    {
      ...createImportedObjectDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "ExtMembTypeObj",
        type: "Namespace_ExtMembTypeObj"
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "prop",
          type: "Int",
          required: true
        }),
      ]
    },
    {
      ...createImportedObjectDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "ExtMembTypeB",
        type: "Namespace_ExtMembTypeB"
      }),
      properties: [
        createScalarPropertyDefinition({
          name: "propB",
          type: "String",
          required: true
        }),
      ]
    }
  ],
  importedUnionTypes: [
    {
      ...createImportedUnionDefinition({
        uri: "external.eth",
        namespace: "Namespace",
        nativeType: "ExtUnion",
        memberTypes: [
          {
            ...createObjectRef({
              type: "Namespace_ExtMembTypeA"
            }),
            first: true,
            last: null 
          } as GenericDefinition,
          {
            ...createObjectRef({
              type: "Namespace_ExtMembTypeB"
            }),
            first: null,
            last: true 
          } as GenericDefinition,
        ],
        type: "Namespace_ExtUnion"
      })
    }
  ],
};
