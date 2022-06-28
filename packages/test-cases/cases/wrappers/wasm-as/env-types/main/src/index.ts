import {
  Env,
  ExternalEnvApi_Module,
  ExternalEnvApi_Env,
  Input_methodNoEnv,
  Input_methodRequireEnv,
  Input_methodOptionalEnv,
  CompoundEnv,
} from "./wrap";

function createEnv(env: Env): Env {
  return {
    str: env.str,
    optStr: env.optStr,
    optFilledStr: env.optFilledStr,
    m_number: env.m_number,
    optNumber: env.optNumber,
    m_bool: env.m_bool,
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
  return input.env ? createEnv(input.env as Env) : null;
}

export function subinvokeEnvMethod(input: Input_methodRequireEnv): CompoundEnv {
  const externalEnv = ExternalEnvApi_Module.externalEnvMethod({}).unwrap()
  
  return {
    local: input.env,
    external: externalEnv
  };
}