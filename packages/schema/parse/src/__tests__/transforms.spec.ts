import { parseSchema } from "../";
import { addFirstLast } from "../transform/addFirstLast";
import { extendType } from "../transform/extendType";
import {
  createObjectDefinition,
  createScalarPropertyDefinition,
  ObjectDefinition,
  PropertyDefinition,
  TypeInfo,
  createModuleDefinition,
  ModuleDefinition,
  createMethodDefinition,
  MethodDefinition,
  createImportedModuleDefinition,
  ImportedModuleDefinition,
  createEnvDefinition
} from "../typeInfo";

const schema1 = `
type MyType {
  prop1: String!
  prop2: String!
}

type AnotherType {
  prop: String!
}

type Query {
  method1(
    arg1: String!
    arg2: String
    arg3: Boolean
  ): String!

  method2(
    arg1: String!
  ): String

  method3(
    arg1: String!
  ): Boolean
}

type Mutation {
  method1(
    arg1: String!
    arg2: String
    arg3: Boolean
  ): String!
}

type TestImport_Query @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Query"
) {
  importedMethod(
    str: String!
  ): String!

  anotherMethod(
    str: String!
  ): String!
}
`;

const schema2 = `
type MyType {
  prop1: String!
  prop2: String!
}

type AnotherType {
  prop: String!
}
`;

describe("Web3API Schema TypeInfo Transformations", () => {
  it("addFirstLast", () => {
    const typeInfo = parseSchema(schema1, {
      transforms: [addFirstLast],
    });
    const expected: TypeInfo = {
      envTypes: {
        query: createEnvDefinition({}),
        mutation: createEnvDefinition({}),
      },
      enumTypes: [],
      importedEnumTypes: [],
      interfaceTypes: [],
      objectTypes: [
        {
          ...createObjectDefinition({ type: "MyType" }),
          properties: [
            {
              ...createScalarPropertyDefinition({
                name: "prop1",
                type: "String",
                required: true
              }),
              first: true,
              last: null,
            } as PropertyDefinition,
            {
              ...createScalarPropertyDefinition({
                name: "prop2",
                type: "String",
                required: true
              }),
              first: null,
              last: true,
            },
          ],
          first: true,
          last: null,
        } as ObjectDefinition,
        {
          ...createObjectDefinition({ type: "AnotherType" }),
          properties: [
            {
              ...createScalarPropertyDefinition({
                name: "prop",
                type: "String",
                required: true
              }),
              first: true,
              last: true,
            } as PropertyDefinition,
          ],
          first: null,
          last: true,
        } as ObjectDefinition,
      ],
      moduleTypes: [
        {
          ...createModuleDefinition({ type: "Query" }),
          methods: [
            {
              ...createMethodDefinition({
                type: "query",
                name: "method1",
                arguments: [
                  {
                    ...createScalarPropertyDefinition({
                      type: "String",
                      name: "arg1",
                      required: true,
                    }),
                    first: true,
                    last: null
                  } as PropertyDefinition,
                  createScalarPropertyDefinition({
                    type: "String",
                    name: "arg2",
                    required: false,
                  }),
                  {
                    ...createScalarPropertyDefinition({
                      type: "Boolean",
                      name: "arg3",
                      required: false,
                    }),
                    first: null,
                    last: true
                  } as PropertyDefinition,
                ],
                return: createScalarPropertyDefinition({
                  type: "String",
                  name: "method1",
                  required: true
                })
              }),
              first: true,
              last: null
            } as MethodDefinition,
            createMethodDefinition({
              type: "query",
              name: "method2",
              arguments: [
                {
                  ...createScalarPropertyDefinition({
                    type: "String",
                    name: "arg1",
                    required: true,
                  }),
                  first: true,
                  last: true
                } as PropertyDefinition,
              ],
              return: createScalarPropertyDefinition({
                type: "String",
                name: "method2"
              })
            }),
            {
              ...createMethodDefinition({
                type: "query",
                name: "method3",
                arguments: [
                  {
                    ...createScalarPropertyDefinition({
                      type: "String",
                      name: "arg1",
                      required: true,
                    }),
                    first: true,
                    last: true
                  } as PropertyDefinition,
                ],
                return: createScalarPropertyDefinition({
                  type: "Boolean",
                  name: "method3",
                  required: false
                })
              }),
              first: null,
              last: true
            } as MethodDefinition,
          ],
          first: true,
          last: null
        } as ModuleDefinition,
        {
          ...createModuleDefinition({ type: "Mutation" }),
          methods: [
            {
              ...createMethodDefinition({
                type: "mutation",
                name: "method1",
                arguments: [
                  {
                    ...createScalarPropertyDefinition({
                      type: "String",
                      name: "arg1",
                      required: true,
                    }),
                    first: true,
                    last: null
                  } as PropertyDefinition,
                  createScalarPropertyDefinition({
                    type: "String",
                    name: "arg2",
                    required: false,
                  }),
                  {
                    ...createScalarPropertyDefinition({
                      type: "Boolean",
                      name: "arg3",
                      required: false,
                    }),
                    first: null,
                    last: true
                  } as PropertyDefinition,
                ],
                return: createScalarPropertyDefinition({
                  type: "String",
                  name: "method1",
                  required: true
                })
              }),
              first: true,
              last: true
            } as MethodDefinition,
          ],
          first: null,
          last: true
        } as ModuleDefinition,
      ],
      importedObjectTypes: [],
      importedModuleTypes: [
        {
          ...createImportedModuleDefinition({
            uri: "testimport.uri.eth",
            namespace: "TestImport",
            nativeType: "Query",
            isInterface: false,
            type: "TestImport_Query"
          }),
          methods: [
            {
              ...createMethodDefinition({
                type: "query",
                name: "importedMethod",
                arguments: [
                  {
                    ...createScalarPropertyDefinition({
                      type: "String",
                      name: "str",
                      required: true,
                    }),
                    first: true,
                    last: true
                  } as PropertyDefinition
                ],
                return: createScalarPropertyDefinition({
                  type: "String",
                  name: "importedMethod",
                  required: true
                })
              }),
              first: true,
              last: null
            } as MethodDefinition,
            {
              ...createMethodDefinition({
                type: "query",
                name: "anotherMethod",
                arguments: [
                  {
                    ...createScalarPropertyDefinition({
                      type: "String",
                      name: "str",
                      required: true,
                    }),
                    first: true,
                    last: true
                  } as PropertyDefinition
                ],
                return: createScalarPropertyDefinition({
                  type: "String",
                  name: "anotherMethod",
                  required: true
                })
              }),
              first: null,
              last: true
            } as MethodDefinition,
          ],
          first: true,
          last: true
        } as ImportedModuleDefinition,
      ],
    };

    expect(typeInfo).toMatchObject(expected);
  });

  it("extendType", () => {
    const typeInfo = parseSchema(schema2, {
      transforms: [
        extendType({
          foo: "bar",
        }),
      ],
    });
    const expected: TypeInfo = {
      envTypes: {
        query: createEnvDefinition({}),
        mutation: createEnvDefinition({}),
      },
      enumTypes: [],
      interfaceTypes: [],
      importedEnumTypes: [],
      objectTypes: [
        {
          ...createObjectDefinition({ type: "MyType" }),
          properties: [
            {
              ...createScalarPropertyDefinition({
                name: "prop1",
                type: "String",
                required: true
              }),
              foo: "bar",
            } as PropertyDefinition,
            {
              ...createScalarPropertyDefinition({
                name: "prop2",
                type: "String",
                required: true
              }),
              foo: "bar",
            },
          ],
          foo: "bar",
        } as ObjectDefinition,
        {
          ...createObjectDefinition({ type: "AnotherType" }),
          properties: [
            {
              ...createScalarPropertyDefinition({
                name: "prop",
                type: "String",
                required: true
              }),
              foo: "bar",
            } as PropertyDefinition,
          ],
          foo: "bar",
        } as ObjectDefinition,
      ],
      moduleTypes: [],
      importedObjectTypes: [],
      importedModuleTypes: [],
    };

    expect(typeInfo).toMatchObject(expected);
  });
});
