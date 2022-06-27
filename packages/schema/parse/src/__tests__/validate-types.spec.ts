import { parseSchema } from "..";
import { typeValidators } from "../validate";

const typeDefinitions1 = `
type Subscription {
  prop: String!
}
`;

const typeDefinitions2 = `
input Custom {
  prop: String!
}
`;

const typeDefinitions3 = `
interface Custom {
  prop: String!
}
`;

const typeDefinitions4 = `
type Bar {
  prop: String!
}

type Foo {
  foo: String
}

union FooBar = Bar | Foo
`;


const typeDefinitions5 = `
type Bar {
  prop: String!
}

type Bar {
  other: String!
}
`;

const propertyTypes1 = `
type Custom {
  prop: String!
  other: Stringg!
}
`;

const propertyTypes2 = `
type Custom {
  prop: Bar!
  other: Barr!
}

type Bar {
  prop: Int!
}
`;

const propertyTypes3 = `
type Custom {
  prop: [[Bar]]!
  other: [[Barr]]!
}

type Bar {
  prop: Int!
}
`;

const propertyTypes4 = `
type Custom {
  prop: Bar!
}

type Bar {
  prop: Intt!
}
`;

const propertyTypes5 = `
type Module {
  method(
    prop: Bar!
    other: Barr!
  ): String!
}

type Bar {
  prop: Int!
}
`;

const propertyTypes6 = `
type Module {
  method(
    prop: Bar!
  ): Barr!
}

type Bar {
  prop: Int!
}
`;

const propertyTypes7 = `
type Modul {
  method(
    prop: Bar!
  ): String!
}

type Bar {
  prop: Int!
}
`;

const circularTypes1 = `
type A {
  prop: B!
}

type B {
  prop: A!
}
`

const circularTypes2 = `
type A {
  prop: B!
}

type B {
  prop: C!
}

type C {
  prop: A!
}
`

const circularTypes3 = `
type A {
  prop: B!
  root: D!
}

type B {
  prop: C!
}

type C {
  prop: A!
  root: D!
}

type D {
  prop: B!
  root: A!
}
`

const circularTypes4 = `
type Module {
  method1(
    arg1: String!
    arg2: String
    arg3: Boolean
  ): String!
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
`

const circularTypes5 = `
type TestImport_Object @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "Object"
) {
  prop: String!
  nested: TestImport_NestedObject!
}

type TestImport_NestedObject @imported(
  uri: "testimport.uri.eth",
  namespace: "TestImport",
  nativeType: "NestedObject"
) {
  foo: [String!]!
  circular: TestImport_Object!
}
`

const circularTypes6 = `
type A {
  prop: B!
}

type B {
  prop: A
}
`

const circularTypes7 = `
type A {
  prop: A
}
`

const circularTypes8 = `
type A {
  prop: [A!]!
}
`

const circularTypes9 = `
type A {
  prop: [A!]
}
`

const circularTypes10 = `
type A {
  prop: [A]
}
`

describe("Polywrap Schema Type Validation", () => {
  it("typeDefinitions", () => {
    const exec = (schema: string) => () => parseSchema(schema, {
      validators: [typeValidators.getTypeDefinitionsValidator]
    });

    expect(exec(typeDefinitions1)).toThrow(
      /OperationType names \(Mutation, Subscription, Query\) are not allowed./gm
    );

    expect(exec(typeDefinitions2)).toThrow(
      /Input type definitions are not supported.\nFound: input Custom {/gm
    );

    expect(exec(typeDefinitions3)).toThrow(
      /Interface type definitions are not supported.\nFound: interface Custom {/gm
    );

    expect(exec(typeDefinitions4)).toThrow(
      /Union type definitions are not supported.\nFound: union FooBar/gm
    );

    expect(exec(typeDefinitions5)).toThrow(
      /Duplicate object type definition found: Bar/gm
    );
  });

  it("propertyTypes", () => {
    const exec = (schema: string) => () => parseSchema(schema, {
      validators: [typeValidators.getPropertyTypesValidator]
    });

    expect(exec(propertyTypes1)).toThrow(
      /Unknown property type found: type Custom { other: Stringg }/gm
    );

    expect(exec(propertyTypes2)).toThrow(
      /Unknown property type found: type Custom { other: Barr }/gm
    );

    expect(exec(propertyTypes3)).toThrow(
      /Unknown property type found: type Custom { other: Barr }/gm
    );

    expect(exec(propertyTypes4)).toThrow(
      /Unknown property type found: type Bar { prop: Intt }/gm
    );

    expect(exec(propertyTypes5)).toThrow(
      /Unknown property type found: type Module { method: Barr }/gm
    );

    expect(exec(propertyTypes6)).toThrow(
      /Unknown property type found: type Module { method: Barr }/gm
    );

    expect(exec(propertyTypes7)).toThrow(
      /Methods can only be defined on module types \(Module\)\.\nFound: type Modul { method\(prop\) }/gm
    );
  })

  it("Circular type definitions", () => {
    const exec = (schema: string) => () => parseSchema(schema, {
      validators: [typeValidators.getCircularDefinitionsValidator]
    })

    expect(exec(circularTypes1)).toThrow(
      /Graphql cycles are not supported. \nFound: \n- { B -\[prop\]-> A -\[prop\]-> B }/gm
    )

    expect(exec(circularTypes2)).toThrow(
      /Graphql cycles are not supported. \nFound: \n- { C -\[prop\]-> A -\[prop\]-> B -\[prop\]-> C }/gm
    )

    expect(exec(circularTypes3)).toThrow(
      /Graphql cycles are not supported. \nFound: \n- { D -\[prop\]-> B -\[prop\]-> C -\[prop\]-> A -\[root\]-> D }/gm
    )

    //Should ignore Operation Types
    expect(exec(circularTypes4)).not.toThrow()

    expect(exec(circularTypes5)).toThrow(
      /Graphql cycles are not supported. \nFound: \n- { TestImport_NestedObject -\[circular\]-> TestImport_Object -\[nested\]-> TestImport_NestedObject }/gm
    )

    //Should allow circular references on nullable fields
    expect(exec(circularTypes6)).not.toThrow()

    //Should allow recursive reference on nullable fields
    expect(exec(circularTypes7)).not.toThrow()

    //Should allow array of recursive references
    expect(exec(circularTypes8)).not.toThrow()
    expect(exec(circularTypes9)).not.toThrow()
    expect(exec(circularTypes10)).not.toThrow()
  })
});
