import {
  env,
  MutationEnv,
  Input_mutationEnv,
} from "./w3";

export function mutationEnv(input: Input_mutationEnv): MutationEnv {
  return env as MutationEnv;
}
