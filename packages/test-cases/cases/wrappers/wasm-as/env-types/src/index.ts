import {
  env,
  Env,
  Args_moduleEnv,
} from "./wrap";

export function moduleEnv(args: Args_moduleEnv): Env {
  return env as Env;
}
