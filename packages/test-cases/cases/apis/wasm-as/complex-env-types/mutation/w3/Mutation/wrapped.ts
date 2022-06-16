import {
  mutationEnv
} from "../../index";
import {
  deserializemutationEnvArgs,
  serializemutationEnvResult
} from "./serialization";

export function mutationEnvWrapped(argsBuf: ArrayBuffer): ArrayBuffer {
  const args = deserializemutationEnvArgs(argsBuf);
  const result = mutationEnv({
    arg: args.arg
  });
  return serializemutationEnvResult(result);
}
