import {
  Env,
  ExternalEnvApi_Module,
  Args_methodNoEnv,
  Args_methodRequireEnv,
  Args_methodOptionalEnv,
  Args_subinvokeEnvMethod,
  CompoundEnv,
  IModule,
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

export class Module extends IModule {
  methodNoEnv(args: Args_methodNoEnv): string {
    return args.arg;
  }

  methodRequireEnv(args: Args_methodRequireEnv): Env {
    return createEnv(this.env);
  }

  methodOptionalEnv(args: Args_methodOptionalEnv): Env | null {
    return this.env ? createEnv(this.env as Env) : null;
  }

  subinvokeEnvMethod(args: Args_subinvokeEnvMethod): CompoundEnv {
    const externalEnv = ExternalEnvApi_Module.externalEnvMethod({}).unwrap()
  
    return {
      local: this.env,
      external: externalEnv
    };
  }
}