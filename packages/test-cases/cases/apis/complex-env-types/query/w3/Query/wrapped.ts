import {
  queryEnv
} from "../../index";
import {
  deserializequeryEnvArgs,
  serializequeryEnvResult
} from "./serialization";

export function queryEnvWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializequeryEnvArgs(argsBuf);
  const result = queryEnv({
    arg: args.arg
  });
  return serializequeryEnvResult(result);
}
