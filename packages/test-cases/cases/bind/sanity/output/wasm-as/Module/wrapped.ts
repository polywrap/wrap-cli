import {
  moduleMethod,
  objectMethod,
} from "../../index";
import { Env } from "../Env";
import {
  deserializemoduleMethodArgs,
  serializemoduleMethodResult,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult
} from "./serialization";

export function moduleMethodWrapped(args_buf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemoduleMethodArgs(args_buf);
  const result = moduleMethod({
    str: args.str,
    optStr: args.optStr,
    en: args.en,
    optEnum: args.optEnum,
    enumArray: args.enumArray,
    optEnumArray: args.optEnumArray,
    map: args.map
  });
  return serializemoduleMethodResult(result);
}

export function objectMethodWrapped(args_buf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const envBuf = w3_load_env(env_size);
  const env = Env.fromBuffer(envBuf);

  const args = deserializeobjectMethodArgs(args_buf, env);
  const result = objectMethod({
    object: args.object,
    optObject: args.optObject,
    objectArray: args.objectArray,
    optObjectArray: args.optObjectArray,
    env: args.env
  });
  return serializeobjectMethodResult(result);
}

export function optionalEnvMethodWrapped(args_buf: ArrayBuffer, env_size: u32): ArrayBuffer {
  let env: Env | null = null;
  if (env_size > 0) {
    const envBuf = w3_load_env(env_size);
    env = Env.fromBuffer(envBuf);
  }

  const args = deserializeoptionalEnvMethodArgs(args_buf, env);
  const result = optionalEnvMethod({
    object: args.object,
    optObject: args.optObject,
    objectArray: args.objectArray,
    optObjectArray: args.optObjectArray,
    env: args.env
  });
  return serializeoptionalEnvMethodResult(result);
}
