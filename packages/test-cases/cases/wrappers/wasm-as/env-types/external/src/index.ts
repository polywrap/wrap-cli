import {
  Env,
  Args_externalEnvMethod,
} from "./wrap";

export function externalEnvMethod(_: Args_externalEnvMethod, env: Env): Env {
  return env;
}
