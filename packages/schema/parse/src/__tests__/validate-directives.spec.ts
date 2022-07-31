import { parseSchema } from "..";
import { directiveValidators } from "../validate";

const supportedDirectivesSchema = `
type Module @imports(
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
type Module @imports(
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

const envDirectiveSchema = `
type Object {
  prop: String! @env(required: true)
}
`;

describe("Polywrap Schema Directives Validation", () => {
  it("supportedDirectives", () => {
    expect(() => parseSchema(supportedDirectivesSchema, {
      validators: [
        directiveValidators.getSupportedDirectivesValidator
      ]
    })).toThrow(
      /Found the following usages of unsupported directives:\n@unknown,\n@anotherUnknown/gm
    );
  });

  it("importsDirective: Module Object Only", () => {
    expect(() => parseSchema(importsDirectiveSchema1, {
      validators: [
        directiveValidators.getImportsDirectiveValidator
      ]
    })).toThrow(
      /@imports directive should only be used on Module type definitions, but it is being used on the following ObjectTypeDefinitions:\nObject/gm
    );
  });

  it("importsDirective: Improper Placement", () => {
    expect(() => parseSchema(importsDirectiveSchema2, {
      validators: [
        directiveValidators.getImportsDirectiveValidator
      ]
    })).toThrow(
      /@imports directive should only be used on Module type definitions, but it is being used in the following location: definitions -> 0 -> fields -> 0 -> directives -> 0/gm
    );
  });

  it("importsDirective: Incorrect Arguments", () => {
    expect(() => parseSchema(importsDirectiveSchema3, {
      validators: [
        directiveValidators.getImportsDirectiveValidator
      ]
    })).toThrow(
      /@imports directive requires argument 'types' of type \[String!\]!/
    );
  });

  it("importedDirective: Incorrect Arguments", () => {
    expect(() => parseSchema(importedDirectiveSchema1, {
      validators: [
        directiveValidators.getImportedDirectiveValidator
      ]
    })).toThrow(
      /@imported directive is missing the following arguments:\n- uri/gm
    );
  });

  it("importedDirective: Improper Placement", () => {
    expect(() => parseSchema(importedDirectiveSchema2, {
      validators: [
        directiveValidators.getImportedDirectiveValidator
      ]
    })).toThrow(
      /@imported directive should only be used on object or enum type definitions, but it is being used in the following location: definitions -> 0 -> fields -> 0 -> directives -> 0/gm
    );
  });

  it("envDirective: Improper Placement", () => {
    expect(() => parseSchema(envDirectiveSchema, {
      validators: [
        directiveValidators.getEnvDirectiveValidator
      ]
    })).toThrow(
      /@env directive should only be used on Module method definitions. Found on field \'prop\' of type \'Object\'/gm
    );
  });
});
