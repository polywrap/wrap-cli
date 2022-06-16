import {
  MutationEnv
} from "./MutationEnv";

export let env: MutationEnv | null = null;

export function requireEnv(): MutationEnv {
  if (env == null) throw new Error("Undefined mutation env");
  return env as MutationEnv;
}
