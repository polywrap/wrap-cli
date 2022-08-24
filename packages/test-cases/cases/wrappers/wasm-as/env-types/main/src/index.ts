import {
  Env,
  ExternalEnvApi_Module,
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
    _number: env._number,
    optNumber: env.optNumber,
    _bool: env._bool,
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