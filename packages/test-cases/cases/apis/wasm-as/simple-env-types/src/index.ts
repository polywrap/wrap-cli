import { env, Env, Input_getEnv } from "./w3";

export function getEnv(input: Input_getEnv): Env {
  return env as Env;
}
