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

export function methodRequireEnv(_: Input_methodRequireEnv, env: Env): Env {
  return createEnv(env);
}

export function methodOptionalEnv(_: Input_methodOptionalEnv, env: Env | null): Env | null {
  return env ? createEnv(env as Env) : null;
}

export function subinvokeEnvMethod(_: Input_methodRequireEnv, env: Env): CompoundEnv {
  const externalEnv = ExternalEnvApi_Module.externalEnvMethod({}).unwrap()
  
  return {
    local: env,
    external: externalEnv
  };
}