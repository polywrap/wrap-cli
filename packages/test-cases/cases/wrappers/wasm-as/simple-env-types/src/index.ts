import { Env, Args_getEnv, IModule } from "./wrap";

export class Module extends IModule {
  getEnv(_: Args_getEnv): Env | null {
    return this.env;
  }
}
