import {
  Env,
  Args_externalEnvMethod,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  externalEnvMethod(args: Args_externalEnvMethod, env: Env): Env {
    return env;
  }
}
