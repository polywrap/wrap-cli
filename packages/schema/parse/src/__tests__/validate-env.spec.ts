import { parseSchema } from "..";

const missingSanitizedEnv = `
type ClientEnv {
  prop: String
}
`

const missingModuleSanitizeEnvironment = `
type ClientEnv {
  prop: String
}

type Env {
  prop: String
}

type Module {
  method(prop: String): String
}
`

const invalidModuleSanitizeEnvironmentArguments = `
type ClientEnv {
  prop: String
}

type Env {
  prop: String
}

type Module {
  sanitizeEnv(prop: String): String
}
`

const invalidModuleSanitizeEnvironmentReturnType = `
type ClientEnv {
  prop: String
}

type Env {
  prop: String
}

type Module {
  sanitizeEnv(env: ClientEnv): String
}
`

const exec = (schema: string) => () => parseSchema(
  schema, {
  validators: []
});

describe("Web3API Schema Environment Validation", () => {
  it("throws error if client env exists and sanitized env not defined", () => {
    expect(exec(missingSanitizedEnv)).toThrow(
      /Client environment type 'ClientEnv' should have matching sanitized environment type/gm
    );
  });

  it("throws error if sanitize environment method invalid", () => {
    expect(exec(missingModuleSanitizeEnvironment)).toThrow(
      /Must have 'sanitizeEnv' method inside module methods when using 'ClientEnv'/gm
    );

    expect(exec(invalidModuleSanitizeEnvironmentArguments)).toThrow(
      /'sanitizeEnv' module method should have single argument 'env: ClientEnv'/gm
    );

    expect(exec(invalidModuleSanitizeEnvironmentReturnType)).toThrow(
      /'sanitizeEnv' module method should have required return type 'Env'/gm
    );
  });
});
