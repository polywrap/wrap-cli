import { Env, Args_getEnv, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  getEnv(_: Args_getEnv, env: Env): Env | null {
    return env;
  }
}
