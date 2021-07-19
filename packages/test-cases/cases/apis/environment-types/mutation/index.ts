import {
  env,
  Input_mutEnvironment,
  MutationEnv
} from "./w3";

export function mutEnvironment(input: Input_mutEnvironment): MutationEnv {
  return env as MutationEnv
}
