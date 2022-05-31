import { env, MutationEnv, Input_getEnv } from "./w3";

export function getEnv(input: Input_getEnv): MutationEnv {
  return env as MutationEnv;
}
