import {
  getEnv
} from "../../index";
import {
  deserializegetEnvArgs,
  serializegetEnvResult
} from "./serialization";

export function getEnvWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializegetEnvArgs(argsBuf);
  const result = getEnv({
    arg: args.arg
  });
  return serializegetEnvResult(result);
}
