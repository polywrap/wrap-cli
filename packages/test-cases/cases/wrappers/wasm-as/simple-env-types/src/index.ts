import { env, Env, Input_getEnv } from "./wrap";

export function getEnv(input: Input_getEnv): Env {
  return env as Env;
}
