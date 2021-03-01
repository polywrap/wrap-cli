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
type Query {
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
type Query {
  method(
    prop: Bar!
  ): Barr!
}

type Bar {
  prop: Int!
}
`;

const propertyTypes7 = `
type Queryy {
  method(
    prop: Bar!
  ): String!
}

type Bar {
  prop: Int!
}
`;

const infiniteTypes1 = `
type A {
  prop: B!
}

type B {
  prop: A!
}
`

const infiniteTypes2 = `
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

const infiniteTypes3 = `
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

describe("Web3API Schema Type Validation", () => {
  it("typeDefinitions", () => {
    const exec = (schema: string) => () => parseSchema(schema, {
      validators: [typeValidators.typeDefinitions]
    });

    expect(exec(typeDefinitions1)).toThrow(
      /Subscriptions are not yet supported./gm
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
      validators: [typeValidators.propertyTypes]
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
      /Unknown property type found: type Query { method: Barr }/gm
    );

    expect(exec(propertyTypes6)).toThrow(
      /Unknown property type found: type Query { method: Barr }/gm
    );

    expect(exec(propertyTypes7)).toThrow(
      /Methods can only be defined on query types \(Mutation, Query\)\.\nFound: type Queryy { method\(prop\) }/gm
    );
  })

  it("Infinite recursions", () => {
    const exec = (schema: string) => () => parseSchema(schema, {
      validators: [typeValidators.infiniteRecursions]
    })

    expect(exec(infiniteTypes1)).toThrow(
      /Graphql cycles are not supported. \nFound: \n- { B -\[prop\]-> A -\[prop\]-> B }/gm
    )

    expect(exec(infiniteTypes2)).toThrow(
      /Graphql cycles are not supported. \nFound: \n- { C -\[prop\]-> A -\[prop\]-> B -\[prop\]-> C }/gm
    )

    expect(exec(infiniteTypes3)).toThrow(
      /Graphql cycles are not supported. \nFound: \n- { D -\[prop\]-> B -\[prop\]-> C -\[prop\]-> A -\[root\]-> D }/gm
    )
  })
});
