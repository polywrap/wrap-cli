import { parseSchema } from "../";
import { addFirstLast } from "../transform/addFirstLast";
import { extendType } from "../transform/extendType";
import {
  createObjectDefinition,
  createScalarPropertyDefinition,
  ObjectDefinition,
  PropertyDefinition,
  TypeInfo
} from "../typeInfo";

const schema = `
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
    const typeInfo = parseSchema(schema, {
      transforms: [addFirstLast]
    });
    const expected: TypeInfo = {
      userTypes: [
        {
          ...createObjectDefinition("MyType"),
          properties: [
            {
              ...createScalarPropertyDefinition("prop1", "String", true),
              first: true,
              last: null
            } as PropertyDefinition,
            {
              ...createScalarPropertyDefinition("prop2", "String", true),
              first: null,
              last: true
            }
          ],
          first: true,
          last: null
        } as ObjectDefinition,
        {
          ...createObjectDefinition("AnotherType"),
          properties: [
            {
              ...createScalarPropertyDefinition("prop", "String", true),
              first: true,
              last: true
            } as PropertyDefinition
          ],
          first: null,
          last: true
        } as ObjectDefinition
      ],
      queryTypes: [],
      importedObjectTypes: [],
      importedQueryTypes: []
    };

    expect(typeInfo).toMatchObject(expected);
  });

  it("extendType", () => {
    const typeInfo = parseSchema(schema, {
      transforms: [extendType({ foo: "bar" })]
    });
    const expected: TypeInfo = {
      userTypes: [
        {
          ...createObjectDefinition("MyType"),
          properties: [
            {
              ...createScalarPropertyDefinition("prop1", "String", true),
              foo: "bar"
            } as PropertyDefinition,
            {
              ...createScalarPropertyDefinition("prop2", "String", true),
              foo: "bar"
            }
          ],
          foo: "bar"
        } as ObjectDefinition,
        {
          ...createObjectDefinition("AnotherType"),
          properties: [
            {
              ...createScalarPropertyDefinition("prop", "String", true),
              foo: "bar"
            } as PropertyDefinition
          ],
          foo: "bar"
        } as ObjectDefinition
      ],
      queryTypes: [],
      importedObjectTypes: [],
      importedQueryTypes: []
    };

    expect(typeInfo).toMatchObject(expected);
  });
});
