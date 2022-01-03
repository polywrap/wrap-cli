import {
  env,
  Input_mutEnvironment,
  Input_sanitizeMutationEnv,
  MutationEnv
} from "./w3";

export function mutEnvironment(input: Input_mutEnvironment): MutationEnv {
  return env as MutationEnv;
}

export function sanitizeMutationEnv(input: Input_sanitizeMutationEnv): MutationEnv {
  return {
    str: input.env.str,
    optStr: input.env.optStr,
    defMutStr: "default mutation string"
  }
}
