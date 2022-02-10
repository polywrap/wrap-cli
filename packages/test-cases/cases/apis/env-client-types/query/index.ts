import {
  env,
  Input_environment,
  Input_sanitizeQueryEnv,
  QueryEnv
} from "./w3";

export function environment(input: Input_environment): QueryEnv {
  return env as QueryEnv;
}

export function sanitizeQueryEnv(input: Input_sanitizeQueryEnv): QueryEnv {
  return {
    str: input.env.str,
    optStr: input.env.optStr,
    defStr: "default string"
  }
}
