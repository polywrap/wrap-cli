import {
  MutationEnv
} from "./MutationEnv";

export let env: MutationEnv | null = null;

export function ensureEnv(): MutationEnv {
  if (env == null) throw new Error("Undefined mutation env");
  return env as MutationEnv;
}
