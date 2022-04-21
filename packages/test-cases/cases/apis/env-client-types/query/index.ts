import {
  env,
  Input_environment,
  Input_sanitizeEnv,
  QueryEnv
} from "./w3";

export function environment(input: Input_environment): QueryEnv {
  return env as QueryEnv;
}

export function sanitizeEnv(input: Input_sanitizeEnv): QueryEnv {
  return {
    str: input.env.str,
    optStr: input.env.optStr,
    defStr: "default string"
  }
}
