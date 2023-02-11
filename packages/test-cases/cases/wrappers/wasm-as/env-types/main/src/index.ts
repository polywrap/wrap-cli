import {
  Env,
  ExternalEnvApi_Module,
  Args_methodNoEnv,
  Args_methodRequireEnv,
  Args_methodOptionalEnv,
  Args_subinvokeEnvMethod,
  CompoundEnv,
  ModuleBase,
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

export class Module extends ModuleBase {
  methodNoEnv(args: Args_methodNoEnv): string {
    return args.arg;
  }

  methodRequireEnv(args: Args_methodRequireEnv, env: Env): Env {
    return createEnv(env);
  }

  methodOptionalEnv(args: Args_methodOptionalEnv, env: Env | null): Env | null {
    return env ? createEnv(env) : null;
  }

  subinvokeEnvMethod(args: Args_subinvokeEnvMethod, env: Env): CompoundEnv {
    const externalEnv = ExternalEnvApi_Module.externalEnvMethod({}).unwrap()
  
    return {
      local: env,
      external: externalEnv
    };
  }
}