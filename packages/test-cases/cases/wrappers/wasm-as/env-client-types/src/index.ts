import {
  env,
  Args_environment,
  Args_sanitizeEnv,
  Env
} from "./wrap";

export function environment(args: Args_environment): Env {
  return env as Env;
}

export function sanitizeEnv(args: Args_sanitizeEnv): Env {
  return {
    str: args.env.str,
    optStr: args.env.optStr,
    defStr: "default string",
  }
}
