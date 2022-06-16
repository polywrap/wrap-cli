import {
  sanitizeEnv,
  mutEnvironment
} from "../../index";
import {
  deserializesanitizeEnvArgs,
  serializesanitizeEnvResult,
  deserializemutEnvironmentArgs,
  serializemutEnvironmentResult
} from "./serialization";

export function sanitizeEnvWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesanitizeEnvArgs(argsBuf);
  const result = sanitizeEnv({
    env: args.env
  });
  return serializesanitizeEnvResult(result);
}

export function mutEnvironmentWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemutEnvironmentArgs(argsBuf);
  const result = mutEnvironment({
    arg: args.arg
  });
  return serializemutEnvironmentResult(result);
}
