import {
  env,
  Env,
  Input_moduleEnv,
} from "./polywrap";

export function moduleEnv(input: Input_moduleEnv): Env {
  return env as Env;
}
