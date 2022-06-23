import { wrap_load_env } from "@polywrap/wasm-as";
import {
  moduleMethod,
  objectMethod,
  optionalEnvMethod,
  Env
} from "../../index";
import {
  deserializemoduleMethodArgs,
  serializemoduleMethodResult,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult,
  deserializeoptionalEnvMethodArgs,
  serializeoptionalEnvMethodResult
} from "./serialization";

export function moduleMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemoduleMethodArgs(argsBuf);
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
  if (env_size == 0) {
    throw new Error("Environment is not set, and it is required by method 'objectMethod'")
  }
  
  const envBuf = wrap_load_env(env_size);
  const env = Env.fromBuffer(envBuf);

  const args = deserializeobjectMethodArgs(args_buf);
  const result = objectMethod({
    object: args.object,
    optObject: args.optObject,
    objectArray: args.objectArray,
    optObjectArray: args.optObjectArray,
    env
  });
  return serializeobjectMethodResult(result);
}

export function optionalEnvMethodWrapped(args_buf: ArrayBuffer, env_size: u32): ArrayBuffer {
  let env: Env | null = null;
  if (env_size > 0) {
    const envBuf = wrap_load_env(env_size);
    env = Env.fromBuffer(envBuf);
  }

  const args = deserializeoptionalEnvMethodArgs(args_buf);
  const result = optionalEnvMethod({
    object: args.object,
    optObject: args.optObject,
    objectArray: args.objectArray,
    optObjectArray: args.optObjectArray,
    env
  });
  return serializeoptionalEnvMethodResult(result);
}
