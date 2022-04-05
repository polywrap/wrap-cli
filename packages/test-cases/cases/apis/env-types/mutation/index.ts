import {
  env,
  requireEnv,
  MutationEnv,
  Input_getEnv,
  Input_tryGetEnv
} from "./w3";

export function tryGetEnv(input: Input_tryGetEnv): MutationEnv | null {
  return env;
}

export function getEnv(input: Input_getEnv): MutationEnv {
  return requireEnv();
}
