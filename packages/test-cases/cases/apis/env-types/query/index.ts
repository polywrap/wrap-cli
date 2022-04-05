import {
  env,
  requireEnv,
  QueryEnv,
  Input_getEnv,
  Input_tryGetEnv
} from "./w3";

export function tryGetEnv(input: Input_tryGetEnv): QueryEnv | null {
  return env;
}

export function getEnv(input: Input_getEnv): QueryEnv {
  return requireEnv();
}
