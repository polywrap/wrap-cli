import {
  Env,
  ExternalEnvApi_Module,
  ExternalEnvApi_Env,
  Args_methodNoEnv,
  Args_methodRequireEnv,
  Args_methodOptionalEnv,
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

export function methodNoEnv(args: Args_methodNoEnv): string {
  return args.arg;
}

export function methodRequireEnv(_: Args_methodRequireEnv, env: Env): Env {
  return createEnv(env);
}

export function methodOptionalEnv(_: Args_methodOptionalEnv, env: Env | null): Env | null {
  return env ? createEnv(env as Env) : null;
}

export function subinvokeEnvMethod(_: Args_methodRequireEnv, env: Env): CompoundEnv {
  const externalEnv = ExternalEnvApi_Module.externalEnvMethod({}).unwrap()
  
  return {
    local: env,
    external: externalEnv
  };
}