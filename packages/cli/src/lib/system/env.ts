import { intlMsg } from "../";

export function loadEnvironmentVariables(
  obj: Record<string, unknown>,
  env: Record<string, unknown> = process.env
): Record<string, unknown> {
  const isEnvVar = (x: unknown) => typeof x === "string" && x[0] === "$";

  const isObject = (val: unknown): boolean => {
    if (val === null) {
      return false;
    }
    return typeof val === "object";
  };

  const loadEnvVar = (value: string): string => {
    const importedVariable = value.substring(1);
    if (env[importedVariable]) {
      return env[importedVariable] as string;
    } else {
      throw new Error(
        intlMsg.lib_system_env_var_not_found({
          variableName: importedVariable,
        })
      );
    }
  };

  const tryLoadEnvVar = (value: unknown) => {
    if (isEnvVar(value)) {
      return loadEnvVar(value as string);
    }
    return value;
  };

  const iterateArray = (value: unknown[]): unknown => {
    return value.map((v) => {
      if (Array.isArray(v)) return iterateArray(v);

      if (isObject(v)) {
        return Object.entries(v as Record<string, unknown>).reduce(
          replaceValue,
          v
        );
      }

      return tryLoadEnvVar(v);
    });
  };

  const replaceValue = (
    object: Record<string, unknown>,
    [key, value]: [string, unknown]
  ) => {
    if (Array.isArray(value)) {
      object[key] = iterateArray(value);
      return object;
    }

    if (isObject(value)) {
      const newValues = Object.entries(value as Record<string, unknown>);
      object[key] = newValues.reduce(replaceValue, value);
      return object;
    }

    object[key] = tryLoadEnvVar(value);
    return object;
  };

  const entries = Object.entries(obj);
  return entries.reduce(replaceValue, obj);
}
