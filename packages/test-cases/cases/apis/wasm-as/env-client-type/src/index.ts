import {
  env,
  Input_environment,
  Input_sanitizeEnv,
  Env
} from "./w3";

export function environment(input: Input_environment): Env {
  return env;
}

export function sanitizeEnv(input: Input_sanitizeEnv): Env {
  return {
    str: input.env.str,
    optStr: input.env.optStr,
    defStr: "default string"
  }
}
