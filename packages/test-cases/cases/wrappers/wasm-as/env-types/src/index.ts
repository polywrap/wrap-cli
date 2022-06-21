import {
  env,
  Env,
  Input_moduleEnv,
} from "./wrap";

export function moduleEnv(input: Input_moduleEnv): Env {
  return env as Env;
}
