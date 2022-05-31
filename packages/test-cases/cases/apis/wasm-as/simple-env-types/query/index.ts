import { env, QueryEnv, Input_getEnv } from "./w3";

export function getEnv(input: Input_getEnv): QueryEnv {
  return env as QueryEnv;
}
