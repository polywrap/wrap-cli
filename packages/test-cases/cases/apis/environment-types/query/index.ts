import {
  env,
  Input_environment
} from "./w3";

export function environment(input: Input_environment): string | null {
  return env.uri
}
