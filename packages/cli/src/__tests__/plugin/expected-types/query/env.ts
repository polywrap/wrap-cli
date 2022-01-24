import {
  QueryEnv
} from ".";

export let env: QueryEnv | null = null;

export function loadEnv(_env: QueryEnv): void {
  env = _env;
}
