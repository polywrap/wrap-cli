import {
  ObjectDefinition,
  MODULE_NAME,
  AnyDefinition,
  Abi,
} from "@polywrap/schema-parse";

export function validateEnv(info: Abi): void {
  if (info.envType.client) {
    validateClientEnvironment(
      info,
      info.envType.client,
      info.envType.sanitized
    );
  }
}

export function validateClientEnvironment(
  info: Abi,
  client: ObjectDefinition,
  sanitized?: ObjectDefinition
): void {
  if (!sanitized) {
    throw new Error(
      `Client environment type '${client.type}' should have matching sanitized environment type`
    );
  }

  if (!info.moduleType) {
    throw new Error(
      `validateClientEnvironment: Cannot find the specified module type by name '${MODULE_NAME}' while trying to validate '${client.type}'`
    );
  }

  const sanitizeEnvMethod = info.moduleType.methods.find(
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

export function checkDuplicateEnvProperties(
  envType: ObjectDefinition,
  envProperties: AnyDefinition[]
): void {
  const envPropertiesSet = new Set(
    envProperties.map((envProperty) => envProperty.name)
  );
  for (const specificProperty of envType.properties) {
    if (envPropertiesSet.has(specificProperty.name)) {
      throw new Error(
        `Type '${envType.type}' contains duplicate property '${specificProperty.name}' of type 'Env'`
      );
    }
  }
}
