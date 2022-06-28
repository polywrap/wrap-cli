import {
  Env,
  Input_externalEnvMethod,
} from "./wrap";

export function externalEnvMethod(input: Input_externalEnvMethod): Env {
  return input.env;
}

