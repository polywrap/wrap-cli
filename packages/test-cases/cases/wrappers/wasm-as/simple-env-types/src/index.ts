import { env, Env, Args_getEnv } from "./wrap";

export function getEnv(args: Args_getEnv): Env {
  return env as Env;
}
