import {
  sanitizeEnv,
  environment
} from "../../index";
import {
  deserializesanitizeEnvArgs,
  serializesanitizeEnvResult,
  deserializeenvironmentArgs,
  serializeenvironmentResult
} from "./serialization";

export function sanitizeEnvWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializesanitizeEnvArgs(argsBuf);
  const result = sanitizeEnv({
    env: args.env
  });
  return serializesanitizeEnvResult(result);
}

export function environmentWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializeenvironmentArgs(argsBuf);
  const result = environment({
    arg: args.arg
  });
  return serializeenvironmentResult(result);
}
