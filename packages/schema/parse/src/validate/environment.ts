import { EnvironmentType, TypeInfo } from "../typeInfo";

export function validateEnvironment(info: TypeInfo): void {
  if (info.environment.query.client) {
    validateQueryEnvironment(info);
  }

  if (info.environment.mutation.client) {
    validateMutationEnvironment(info);
  }
}

export function validateQueryEnvironment(info: TypeInfo): void {
  if (!info.environment.query.sanitized) {
    throw new Error(
      `Client enviroment type '${EnvironmentType.MutationClientEnvType}' should have matching sanitized enviroment type '${EnvironmentType.QueryEnvType}'`
    );
  }

  const query = info.queryTypes.find((type) => type.type === "Query");
  if (!query) {
    throw new Error(
      `Must have 'sanitizeQueryEnv' method inside Query methods when using '${EnvironmentType.QueryClientEnvType}'`
    );
  }

  const sanitizeEnvMethod = query.methods.find(
    (method) => method.name === "sanitizeQueryEnv"
  );
  if (!sanitizeEnvMethod) {
    throw new Error(
      `Must have 'sanitizeQueryEnv' method inside Query methods when using '${EnvironmentType.QueryClientEnvType}'`
    );
  }

  if (
    sanitizeEnvMethod.arguments.length === 0 ||
    sanitizeEnvMethod.arguments.length > 1 ||
    sanitizeEnvMethod.arguments[0].name !== "env" ||
    sanitizeEnvMethod.arguments[0].type !==
      EnvironmentType.QueryClientEnvType ||
    sanitizeEnvMethod.arguments[0].required === false
  ) {
    throw new Error(
      `'sanitizeQueryEnv' query method should have single argument 'env: ${EnvironmentType.QueryClientEnvType}'`
    );
  }

  if (
    !sanitizeEnvMethod.return ||
    sanitizeEnvMethod.return.type !== EnvironmentType.QueryEnvType ||
    sanitizeEnvMethod.return.required === false
  ) {
    throw new Error(
      `'sanitizeQueryEnv' query method should have required return type '${EnvironmentType.QueryEnvType}'`
    );
  }
}

export function validateMutationEnvironment(info: TypeInfo): void {
  if (!info.environment.mutation.sanitized) {
    throw new Error(
      `Client enviroment type '${EnvironmentType.MutationClientEnvType}' should have matching sanitized enviroment type '${EnvironmentType.MutationEnvType}'`
    );
  }

  const mutation = info.queryTypes.find((type) => type.type === "Mutation");
  if (!mutation) {
    throw new Error(
      `Must have 'sanitizeMutationEnv' method inside Mutation methods when using '${EnvironmentType.MutationClientEnvType}'`
    );
  }

  const sanitizeEnvMethod = mutation.methods.find(
    (method) => method.name === "sanitizeMutationEnv"
  );
  if (!sanitizeEnvMethod) {
    throw new Error(
      `Must have 'sanitizeMutationEnv' method inside Mutation methods when using '${EnvironmentType.MutationClientEnvType}'`
    );
  }

  if (
    sanitizeEnvMethod.arguments.length === 0 ||
    sanitizeEnvMethod.arguments.length > 1 ||
    sanitizeEnvMethod.arguments[0].name !== "env" ||
    sanitizeEnvMethod.arguments[0].type !==
      EnvironmentType.MutationClientEnvType ||
    sanitizeEnvMethod.arguments[0].required === false
  ) {
    throw new Error(
      `'sanitizeMutationEnv' mutation method should have single argument 'env: ${EnvironmentType.MutationClientEnvType}'`
    );
  }

  if (
    !sanitizeEnvMethod.return ||
    sanitizeEnvMethod.return.type !== EnvironmentType.MutationEnvType ||
    sanitizeEnvMethod.return.required === false
  ) {
    throw new Error(
      `'sanitizeMutationEnv' mutation method should return type '${EnvironmentType.MutationEnvType}'`
    );
  }
}
