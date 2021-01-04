// TODO: multiple-queries

import { createQueryDocument, InvokeApiOptions } from "../types";
import { parseQuery } from "../algorithms";

describe("parseQuery", () => {
  it("works in the typical case", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: "hey"
          arg2: 4
          arg3: true
          arg4: null
          arg5: ["hey", "there", [5.5]]
          arg6: {
            prop: "hey"
            obj: {
              prop: 5
            }
          }
          var1: $var_1
          var2: $var_2
        ) {
          someResult {
            prop1
            prop2
          }
        }
      }
    `);

    const result = parseQuery(doc, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      var_1: "var 1",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      var_2: 55,
    });

    const expected: InvokeApiOptions = {
      module: "mutation",
      method: "someMethod",
      input: {
        arg1: "hey",
        arg2: 4,
        arg3: true,
        arg4: null,
        arg5: ["hey", "there", [5.5]],
        arg6: {
          prop: "hey",
          obj: {
            prop: 5,
          },
        },
        var1: "var 1",
        var2: 55,
      },
      resultFilter: {
        someResult: {
          prop1: true,
          prop2: true,
        },
      },
    };

    expect(result).toMatchObject([expected]);
  });

  it("fails when given an empty document", () => {
    const doc = createQueryDocument("{ prop }");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc.definitions as any) = [];
    expect(() => parseQuery(doc)).toThrowError(/Empty query document found/);
  });

  it("fails when a query operations isn't specified", () => {
    const doc = createQueryDocument("fragment Something on Type { something }");
    expect(() => parseQuery(doc)).toThrowError(/Unrecognized root level definition type/);
  });

  it("fails when given a subscription operation type, which is currently unsupported", () => {
    const doc = createQueryDocument("subscription { something }");
    expect(() => parseQuery(doc)).toThrowError(/Subscription queries are not yet supported/);
  });

  it("fails when method is missing", () => {
    const doc = createQueryDocument(`query { something }`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc.definitions[0] as any).selectionSet.selections = [];
    expect(() => parseQuery(doc)).toThrowError(/Empty selection set found/);
  });

  it("fails when a fragment spread is used within an operations", () => {
    const doc = createQueryDocument(`query { ...NamedFragment }`);
    expect(() => parseQuery(doc)).toThrowError(/Unsupported selection type found: FragmentSpread/);
  });

  it("fails when a fragment spread is used on result values", () => {
    const doc = createQueryDocument(`
      query {
        something(
          arg: 5
        ) {
          ...NamedFragment
        }
      }
    `);
    expect(() => parseQuery(doc)).toThrowError(/Unsupported result selection type found: FragmentSpread/);
  });

  it("fails when variables were not specified", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);

    expect(() => parseQuery(doc)).toThrowError(/Variables were not specified/);
  });

  it("fails when variables is missing", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);

    expect(() => parseQuery(doc, { arg2: "not arg1" })).toThrowError(/Missing variable/);
  });

  it("fails when duplicate input arguments are provided", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: 5
          arg1: "hey"
        )
      }
    `);

    expect(() => parseQuery(doc)).toThrowError(/Duplicate input argument found/);
  });

  it("fails when duplicate result selections found", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: 5
        ) {
          prop1
          prop1
        }
      }
    `);

    expect(() => parseQuery(doc)).toThrowError(/Duplicate result selections found/);
  });
});
