import {
  MutationEnv
} from ".";

export let env: MutationEnv | null = null;

export function loadEnv(_env: MutationEnv): void {
  env = _env;
}
