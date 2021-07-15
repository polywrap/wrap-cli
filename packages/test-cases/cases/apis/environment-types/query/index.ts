import {
  env,
  Input_environment,
  QueryEnv
} from "./w3";

export function environment(input: Input_environment): QueryEnv {
  return env as QueryEnv;
}
