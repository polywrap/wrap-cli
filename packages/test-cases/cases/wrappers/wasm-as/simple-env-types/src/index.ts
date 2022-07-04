import { Env, Args_getEnv } from "./wrap";

export function getEnv(_: Args_getEnv, env: Env | null): Env | null {
  return env;
}
