import {
  Env,
  Input_externalEnvMethod,
} from "./wrap";

export function externalEnvMethod(_: Input_externalEnvMethod, env: Env): Env {
  return env;
}

