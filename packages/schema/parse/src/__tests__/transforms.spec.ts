import { parseSchema } from "../";
import { addFirstLast } from "../transform/addFirstLast";
import { extendType } from "../transform/extendType";
import {
  createObjectDefinition,
  createScalarPropertyDefinition,
  ObjectDefinition,
  PropertyDefinition,
  Abi,
  createModuleDefinition,
  ModuleDefinition,
  createMethodDefinition,
  MethodDefinition,
  createImportedModuleDefinition,
  ImportedModuleDefinition,
  createEnvDefinition
} from "../abi";

const schema1 = `
type MyType {
  prop1: String!
  prop2: String!
}

type AnotherType {
  prop: String!
}

type Module {
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

type TestImport_Module @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Module"
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

describe("Polywrap Schema Abi Transformations", () => {
  it("addFirstLast", () => {
    const abi = parseSchema(schema1, {
      transforms: [addFirstLast],
    });
    const expected: Abi = {
      envType: createEnvDefinition({}),
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
      moduleType: 
        {
          ...createModuleDefinition({}),
          methods: [
            {
              ...createMethodDefinition({
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
                  {
                    ...createScalarPropertyDefinition({
                      type: "String",
                      name: "arg2",
                      required: false,
                    }),
                    first: null,
                    last: null
                  } as PropertyDefinition,
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
            {
              ...createMethodDefinition({
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
              first: null,
              last: null
            },
            {
              ...createMethodDefinition({
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
        } as ModuleDefinition,
      importedObjectTypes: [],
      importedModuleTypes: [
        {
          ...createImportedModuleDefinition({
            uri: "testimport.uri.eth",
            namespace: "TestImport",
            nativeType: "Module",
            isInterface: false,
          }),
          methods: [
            {
              ...createMethodDefinition({
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

    expect(abi).toMatchObject(expected);
  });

  it("extendType", () => {
    const abi = parseSchema(schema2, {
      transforms: [
        extendType({
          foo: "bar",
        }),
      ],
    });
    const expected: Abi = {
      envType: createEnvDefinition({}),
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
      importedObjectTypes: [],
      importedModuleTypes: [],
    };

    expect(abi).toMatchObject(expected);
  });
});
