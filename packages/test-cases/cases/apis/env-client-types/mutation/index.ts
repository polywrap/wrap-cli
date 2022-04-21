import {
  env,
  Input_mutEnvironment,
  Input_sanitizeEnv,
  MutationEnv
} from "./w3";

export function mutEnvironment(input: Input_mutEnvironment): MutationEnv {
  return env as MutationEnv;
}

export function sanitizeEnv(input: Input_sanitizeEnv): MutationEnv {
  return {
    str: input.env.str,
    optStr: input.env.optStr,
    defMutStr: "default mutation string"
  }
}
