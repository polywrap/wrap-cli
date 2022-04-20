import { ObjectDefinition, TypeInfo } from "../typeInfo";

export function validateEnv(info: TypeInfo): void {
  if (info.envTypes.query.client) {
    validateClientEnvironment(
      info,
      "Query",
      info.envTypes.query.client,
      info.envTypes.query.sanitized
    );
  }

  if (info.envTypes.mutation.client) {
    validateClientEnvironment(
      info,
      "Mutation",
      info.envTypes.mutation.client,
      info.envTypes.mutation.sanitized
    );
  }
}

export function validateClientEnvironment(
  info: TypeInfo,
  module: "Mutation" | "Query",
  client: ObjectDefinition,
  sanitized?: ObjectDefinition
): void {
  if (!sanitized) {
    throw new Error(
      `Client environment type '${client.type}' should have matching sanitized environment type`
    );
  }

  const moduleObject = info.moduleTypes.find((type) => type.type === module);
  if (!moduleObject) {
    throw new Error(
      `validateClientEnvironment: Cannot find the specified module type by name '${module}' while trying to validate '${client.type}'`
    );
  }

  const sanitizeEnvMethod = moduleObject.methods.find(
    (method) => method.name === "sanitizeEnv"
  );
  if (!sanitizeEnvMethod) {
    throw new Error(
      `Must have 'sanitizeEnv' method inside module methods when using '${client.type}'`
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
      `'sanitizeEnv' module method should have single argument 'env: ${client.type}'`
    );
  }

  if (
    !sanitizeEnvMethod.return ||
    sanitizeEnvMethod.return.type !== sanitized.type ||
    sanitizeEnvMethod.return.required === false
  ) {
    throw new Error(
      `'sanitizeEnv' module method should have required return type '${sanitized.type}'`
    );
  }
}
