import {
  Env,
  Args_externalEnvMethod,
  IModule
} from "./wrap";

export class Module extends IModule {
  externalEnvMethod(args: Args_externalEnvMethod): Env {
    return this.env;
  }
}
