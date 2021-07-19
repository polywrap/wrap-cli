import { ObjectDefinition, TypeInfo } from "../typeInfo";

export function validateEnvironment(info: TypeInfo): void {
  if (info.environment.query.client) {
    validateClientEnvironment(
      info,
      "Query",
      info.environment.query.client,
      "sanitizeQueryEnv",
      info.environment.query.sanitized
    );
  }

  if (info.environment.mutation.client) {
    validateClientEnvironment(
      info,
      "Mutation",
      info.environment.mutation.client,
      "sanitizeMutationEnv",
      info.environment.mutation.sanitized
    );
  }
}

export function validateClientEnvironment(
  info: TypeInfo,
  module: "Mutation" | "Query",
  client: ObjectDefinition,
  sanitizeMethod: "sanitizeQueryEnv" | "sanitizeMutationEnv",
  sanitized?: ObjectDefinition
): void {
  if (!sanitized) {
    throw new Error(
      `Client environment type '${client.type}' should have matching sanitized environment type`
    );
  }

  const moduleObject = info.queryTypes.find((type) => type.type === module);
  if (!moduleObject) {
    throw new Error(
      `Must have '${sanitizeMethod}' method inside module methods when using '${client.type}'`
    );
  }

  const sanitizeEnvMethod = moduleObject.methods.find(
    (method) => method.name === sanitizeMethod
  );
  if (!sanitizeEnvMethod) {
    throw new Error(
      `Must have '${sanitizeMethod}' method inside module methods when using '${client.type}'`
    );
  }

  if (
    sanitizeEnvMethod.arguments.length === 0 ||
    sanitizeEnvMethod.arguments.length > 1 ||
    sanitizeEnvMethod.arguments[0].name !== "env" ||
    sanitizeEnvMethod.arguments[0].type !== client.type ||
    sanitizeEnvMethod.arguments[0].required === false
  ) {
    throw new Error(
      `'${sanitizeMethod}' module method should have single argument 'env: ${client.type}'`
    );
  }

  if (
    !sanitizeEnvMethod.return ||
    sanitizeEnvMethod.return.type !== sanitized.type ||
    sanitizeEnvMethod.return.required === false
  ) {
    throw new Error(
      `'${sanitizeMethod}' module method should have required return type '${sanitized.type}'`
    );
  }
}
