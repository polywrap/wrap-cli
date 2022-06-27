import { Env, Input_getEnv } from "./wrap";

export function getEnv(input: Input_getEnv): Env | null {
  return input.env;
}
