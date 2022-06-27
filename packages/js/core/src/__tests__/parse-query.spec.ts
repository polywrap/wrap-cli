import { createQueryDocument, parseQuery, QueryInvocations, Uri } from "../";

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
        resultFilter: {
          someResult: {
            prop1: true,
            prop2: true,
          },
        },
      }
    };

    expect(result).toMatchObject(expected);
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
        resultFilter: {
          someResult: {
            prop1: true,
            prop2: true,
          },
        }
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
        resultFilter: {
          resultOne: true,
          resultTwo: {
            prop: true,
          },
        }
      }
    };

    const expected: QueryInvocations<Uri> = {
      ...method1,
      ...method2,
      mutationSomeMethod: method1.someMethod,
      mutationAnotherMethod: method2.anotherMethod,
    };

    expect(result).toMatchObject(expected);
  });

  it("fails when given an empty document", () => {
    const doc = createQueryDocument("{ prop }");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc.definitions as any) = [];
    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Empty query document found/
    );
  });

  it("fails when a query operations isn't specified", () => {
    const doc = createQueryDocument("fragment Something on Type { something }");
    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Unrecognized root level definition type/
    );
  });

  it("fails when method is missing", () => {
    const doc = createQueryDocument(`query { something }`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc.definitions[0] as any).selectionSet.selections = [];
    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Empty selection set found/
    );
  });

  it("fails when a fragment spread is used within an operations", () => {
    const doc = createQueryDocument(`query { ...NamedFragment }`);
    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Unsupported selection type found: FragmentSpread/
    );
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
    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Unsupported result selection type found: FragmentSpread/
    );
  });

  it("fails when variables were not specified", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);

    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Variables were not specified/
    );
  });

  it("fails when variables is missing", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);

    expect(() =>
      parseQuery(dummy, doc, {
        arg2: "not arg1",
      })
    ).toThrowError(/Missing variable/);
  });

  it("succeeds when variables is defined by falsy", () => {
    const doc = createQueryDocument(`
      mutation {
        someMethod(
          arg1: $arg_1
        )
      }
    `);

    expect(() =>
      parseQuery(dummy, doc, {
        arg_1: 0,
      })
    ).not.toThrowError(/Missing variable/);
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

    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Duplicate arguments found/
    );
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

    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Duplicate result selections found/
    );
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

    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Duplicate query name found "alias"/
    );
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

    expect(() => parseQuery(dummy, doc)).toThrowError(
      /Duplicate query name found "method"/
    );
  });
});
