import { parseSchema } from "..";

const ErrorSchemas = {
  "__new__": `
  type Module {
    __new__: String!
  }
  `,
  "__hello__": `
  type Module {
    __hello__: String!
  }
  `,
}

const ValidSchemas = {
  "_new_": `
  type Module {
    _new_: String!
  }
  `,
  "__new": `
  type Module {
    __new: String!
  }
  `,
  "new__": `
  type Module {
    new__: String!
  }
  `,
  "_hello__": `
  type Module {
    _hello__: String!
  }
  `
}

describe("Polywrap Schema shouldn't contain dunder method name", () => {

  for (const [key, value] of Object.entries(ErrorSchemas)) {
    it(`should throw error for ${key}`, () => {
      expect(() => parseSchema(value)).toThrowError();
    });
  }

  for (const [key, value] of Object.entries(ValidSchemas)) {
    it(`shouldn't throw error for ${key}`, () => {
      expect(() => parseSchema(value)).not.toThrowError();
    });
  }

})