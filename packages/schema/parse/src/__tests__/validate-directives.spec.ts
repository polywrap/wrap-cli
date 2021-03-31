import { parseSchema } from "..";
import { directiveValidators } from "../validate";

const supportedDirectivesSchema = `
type Query @imports(
  types: ["Hey"]
) {
  func(
    prop: String!
  ): String!
}

type Namespace_Object @imported(
  uri: "uri",
  namespace: "Namespace",
  nativeType: "Object"
) {
  prop: String!
}

type Foo @unknown {
  prop: Boolean! @anotherUnknown
}
`;

const importsDirectiveSchema1 = `
type Object @imports(
  types: ["Hey"]
) {
  prop: String!
}
`;

const importsDirectiveSchema2 = `
type Object {
  prop: String! @imports(
    types: ["Hey"]
  )
}
`;

const importsDirectiveSchema3 = `
type Query @imports(
  typees: ["Hey"]
) {
  prop: String!
}
`;

const importedDirectiveSchema1 = `
type Namespace_Object @imported(
  urri: "uri",
  namespace: "Namespace",
  nativeType: "Object"
) {
  prop: String!
}
`;

const importedDirectiveSchema2 = `
type Namespace_Object {
  prop: String! @imported(
    uri: "uri",
    namespace: "Namespace",
    nativeType: "Object"
  )
}
`;


describe("Web3API Schema Directives Validation", () => {
  it("supportedDirectives", () => {
    expect(() => parseSchema(supportedDirectivesSchema, {
      validators: [
        directiveValidators.supportedDirectives
      ]
    })).toThrow(
      /Found the following usages of unsupported directives:\n@unknown,\n@anotherUnknown/gm
    );
  });

  it("importsDirective: Query Object Only", () => {
    expect(() => parseSchema(importsDirectiveSchema1, {
      validators: [
        directiveValidators.importsDirective
      ]
    })).toThrow(
      /@imports directive should only be used on QUERY or MUTATION type definitions, but it is being used on the following ObjectTypeDefinitions:\nObject/gm
    );
  });

  it("importsDirective: Improper Placement", () => {
    expect(() => parseSchema(importsDirectiveSchema2, {
      validators: [
        directiveValidators.importsDirective
      ]
    })).toThrow(
      /@imports directive should only be used on QUERY or MUTATION type definitions, but it is being used in the following location: definitions -> 0 -> fields -> 0 -> directives -> 0/gm
    );
  });

  it("importsDirective: Incorrect Arguments", () => {
    expect(() => parseSchema(importsDirectiveSchema3, {
      validators: [
        directiveValidators.importsDirective
      ]
    })).toThrow(
      /@imports directive requires argument 'types' of type \[String!\]!/
    );
  });

  it("importedDirective: Incorrect Arguments", () => {
    expect(() => parseSchema(importedDirectiveSchema1, {
      validators: [
        directiveValidators.importedDirective
      ]
    })).toThrow(
      /@imported directive is missing the following arguments:\n- uri/gm
    );
  });

  it("importedDirective: Improper Placement", () => {
    expect(() => parseSchema(importedDirectiveSchema2, {
      validators: [
        directiveValidators.importedDirective
      ]
    })).toThrow(
      /@imported directive should only be used on object or enum type definitions, but it is being used in the following location: definitions -> 0 -> fields -> 0 -> directives -> 0/gm
    );
  });
});
