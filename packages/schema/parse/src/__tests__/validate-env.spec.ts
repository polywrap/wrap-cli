import { parseSchema } from "..";

const missingSanitizedQueryEnv = `
type QueryClientEnv {
  prop: String
}
`

const missingSanitizedMutationEnv = `
type MutationClientEnv {
  prop: String
}
`
const missingQuery = `
type QueryClientEnv {
  prop: String
}

type QueryEnv {
  prop: String
}
`

const missingQuerySanitizeEnvironment = `
type QueryClientEnv {
  prop: String
}

type QueryEnv {
  prop: String
}

type Query {
  method(prop: String): String
}
`

const invalidQuerySanitizeEnvironmentArguments = `
type QueryClientEnv {
  prop: String
}

type QueryEnv {
  prop: String
}

type Query {
  sanitizeQueryEnv(prop: String): String
}
`

const invalidQuerySanitizeEnvironmentReturnType = `
type QueryClientEnv {
  prop: String
}

type QueryEnv {
  prop: String
}

type Query {
  sanitizeQueryEnv(env: QueryClientEnv): String
}
`

const missingMutation = `
type MutationClientEnv {
  prop: String
}

type MutationEnv {
  prop: String
}
`

const missingMutationSanitizeEnvironment = `
type MutationClientEnv {
  prop: String
}

type MutationEnv {
  prop: String
}

type Mutation {
  method(prop: String): String
}
`

const invalidMutationSanitizeEnviromentArguments = `
type MutationClientEnv {
  prop: String
}

type MutationEnv {
  prop: String
}

type Mutation {
  sanitizeMutationEnv(prop: String): String
}
`

const invalidMutationSanitizeEnvironmentReturnType = `
type MutationClientEnv {
  prop: String
}

type MutationEnv {
  prop: String
}

type Mutation {
  sanitizeMutationEnv(env: MutationClientEnv): String
}
`

const exec = (schema: string) => () => parseSchema(
  schema, {
  validators: []
});

describe("Web3API Schema Environment Validation", () => {
  it("throws error if query client env exists and sanitized env not defined", () => {
    expect(exec(missingSanitizedQueryEnv)).toThrow(
      /Client environment type 'QueryClientEnv' should have matching sanitized environment type/gm
    );

    expect(exec(missingSanitizedMutationEnv)).toThrow(
      /Client environment type 'MutationClientEnv' should have matching sanitized environment type/gm
    );
  });

  it("throws error if sanitize environment method invalid", () => {
    expect(exec(missingQuery)).toThrow(
      /Must have 'sanitizeQueryEnv' method inside module methods when using 'QueryClientEnv'/gm
    );

    expect(exec(missingMutation)).toThrow(
      /Must have 'sanitizeMutationEnv' method inside module methods when using 'MutationClientEnv'/gm
    );

    expect(exec(missingQuerySanitizeEnvironment)).toThrow(
      /Must have 'sanitizeQueryEnv' method inside module methods when using 'QueryClientEnv'/gm
    );

    expect(exec(missingMutationSanitizeEnvironment)).toThrow(
      /Must have 'sanitizeMutationEnv' method inside module methods when using 'MutationClientEnv'/gm
    );

    expect(exec(invalidQuerySanitizeEnvironmentArguments)).toThrow(
      /'sanitizeQueryEnv' module method should have single argument 'env: QueryClientEnv'/gm
    );

    expect(exec(invalidMutationSanitizeEnviromentArguments)).toThrow(
      /'sanitizeMutationEnv' module method should have single argument 'env: MutationClientEnv'/gm
    );

    expect(exec(invalidQuerySanitizeEnvironmentReturnType)).toThrow(
      /'sanitizeQueryEnv' module method should have required return type 'QueryEnv'/gm
    );

    expect(exec(invalidMutationSanitizeEnvironmentReturnType)).toThrow(
      /'sanitizeMutationEnv' module method should have required return type 'MutationEnv'/gm
    );
  });
});
