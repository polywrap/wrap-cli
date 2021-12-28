import {
  env,
  QueryEnv,
  Input_queryEnv,
} from "./w3";

export function queryEnv(input: Input_queryEnv): QueryEnv {
  return env as QueryEnv;
}
