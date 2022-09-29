import { createQueryDocument, parseQuery, QueryInvocations, Uri } from "../";
import { ResultOk } from "@polywrap/result";

describe("parseQuery", () => {
  const dummy = new Uri("wrap://dumb/dummy");

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
              var: $varOne
            }
          }
          var1: $varOne
          var2: $varTwo
        ) {
          someResult {
            prop1
            prop2
          }
        }
      }
    `);

    const result = parseQuery(dummy, doc, {
      varOne: "var 1",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      varTwo: 55,
    });

    const expected: QueryInvocations<Uri> = {
      someMethod: {
        uri: dummy,
        method: "someMethod",
        args: {
          arg1: "hey",
          arg2: 4,
          arg3: true,
          arg4: null,
          arg5: ["hey", "there", [5.5]],
          arg6: {
            prop: "hey",
            obj: {
              prop: 5,
              var: "var 1"
            },
          },
          var1: "var 1",
          var2: 55,
        },
      }
    };

    expect(result).toMatchObject(ResultOk(expected));
  });

  it("works with multiple queries", () => {
    const moduleMethods = `
      someMethod(
        arg1: 4
        arg2: ["hey", "there", [5.5]]
        arg3: {
          prop: "hey"
          obj: {
            prop: 5
          }
        }
        var1: $varOne
        var2: $varTwo
      ) {
        someResult {
          prop1
          prop2
        }
      }

      anotherMethod(
        arg: "hey"
        var: $varOne
      ) {
        resultOne
        resultTwo {
          prop
        }
      }
    `;
    const mutationMethods = `
      mutationSomeMethod: someMethod(
        arg1: 4
        arg2: ["hey", "there", [5.5]]
        arg3: {
          prop: "hey"
          obj: {
            prop: 5
          }
        }
        var1: $varOne
        var2: $varTwo
      ) {
        someResult {
          prop1
          prop2
        }
      }

      mutationAnotherMethod: anotherMethod(
        arg: "hey"
        var: $varOne
      ) {
        resultOne
        resultTwo {
          prop
        }
      }
    `;
    const doc = createQueryDocument(`
      mutation {
        ${mutationMethods}
      }
      query {
        ${moduleMethods}
      }
    `);

    const result = parseQuery(dummy, doc, {
      varOne: "var 1",
      varTwo: 55,
    });

    const method1: QueryInvocations<Uri> = {
      someMethod: {
        uri: dummy,
        method: "someMethod",
        args: {
          arg1: 4,
          arg2: ["hey", "there", [5.5]],
          arg3: {
            prop: "hey",
            obj: {
              prop: 5,
            },
          },
          var1: "var 1",
          var2: 55,
        },
      }
    };
    const method2: QueryInvocations<Uri> = {
      anotherMethod: {
        uri: dummy,
        method: "anotherMethod",
        args: {
          arg: "hey",
          var: "var 1",
        },
      }
    };

    const expected: QueryInvocations<Uri> = {
      ...method1,
      ...method2,
      mutationSomeMethod: method1.someMethod,
      mutationAnotherMethod: method2.anotherMethod,
    };

    expect(result).toMatchObject(ResultOk(expected));
  });

  it("fails when given an empty document", () => {
    const doc = createQueryDocument("{ prop }");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc.definitions as any) = [];
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain("Empty query document found");
  });

  it("fails when a query operations isn't specified", () => {
    const doc = createQueryDocument("fragment Something on Type { something }");
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain("Unrecognized root level definition type");
  });

  it("fails when method is missing", () => {
    const doc = createQueryDocument(`query { something }`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc.definitions[0] as any).selectionSet.selections = [];
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain("Empty selection set found");
  });

  it("fails when a fragment spread is used within an operations", () => {
    const doc = createQueryDocument(`query { ...NamedFragment }`);
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain("Unsupported selection type found: FragmentSpread");
  });

  it("fails when variables were not specified", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain("Variables were not specified");
  });

  it("fails when variables is missing", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);
    const result = parseQuery(dummy, doc, { arg2: "not arg1" });

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain("Missing variable");
  });

  it("succeeds when variables is defined by falsy", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);
    const result = parseQuery(dummy, doc, { arg_1: 0 });
    expect (result.ok).toBeTruthy();
  });

  it("fails when duplicate args arguments are provided", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: 5
          arg1: "hey"
        )
      }
    `);
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain("Duplicate arguments found");
  });

  it("fails when duplicate aliases found", () => {
    const doc = createQueryDocument(`
      mutation {
        alias: method(
          arg: "hey"
        ) {
          result
        }

        alias: method2(
          arg: "hey"
        ) {
          result
        }
      }
    `);
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain(`Duplicate query name found "alias"`);
  });

  it("fails when duplicate methods without alias found", () => {
    const doc = createQueryDocument(`
      mutation {
        method(
          arg: "hey"
        ) {
          result
        }

        method(
          arg: "hey"
        ) {
          result
        }
      }
    `);
    const result = parseQuery(dummy, doc);

    expect (result.ok).toBeFalsy();
    if (result.ok) {
      throw Error("This should never happen");
    }

    const error = result.error?.message;
    expect(error).toContain(`Duplicate query name found "method"`);
  });
});
