import {
  Env,
  Input_methodNoEnv,
  Input_methodRequireEnv,
  Input_methodOptionalEnv,
} from "./wrap";

function createEnv(env: Env): Env {
  return {
    str: env.str,
    optStr: env.optStr,
    optFilledStr: env.optFilledStr,
    number: env.number,
    optNumber: env.optNumber,
    bool: env.bool,
    optBool: env.optBool,
    en: env.en,
    optEnum: env.optEnum,
    object: env.object,
    optObject: env.optObject,
    array: env.array,
  };
}

export function methodNoEnv(input: Input_methodNoEnv): string {
  return input.arg;
}

export function methodRequireEnv(input: Input_methodRequireEnv): Env {
  return createEnv(input.env);
}

export function methodOptionalEnv(input: Input_methodOptionalEnv): Env | null {
  if (input.env) {
    return createEnv(input.env);
  } else {
    return null;
  }
}
