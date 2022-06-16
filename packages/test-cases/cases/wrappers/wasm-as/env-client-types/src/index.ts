import {
  env,
  Input_environment,
  Input_sanitizeEnv,
  Env
} from "./wrap";

export function environment(input: Input_environment): Env {
  return env as Env;
}

export function sanitizeEnv(input: Input_sanitizeEnv): Env {
  return {
    str: input.env.str,
    optStr: input.env.optStr,
    defStr: "default string",
  }
}
