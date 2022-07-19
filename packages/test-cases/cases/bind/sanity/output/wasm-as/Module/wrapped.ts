import { wrap_load_env } from "@polywrap/wasm-as";
import {
  moduleMethod,
  objectMethod,
  optionalEnvMethod
} from "../../index";
import {
  deserializemoduleMethodArgs,
  serializemoduleMethodResult,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult,
  deserializeoptionalEnvMethodArgs,
  serializeoptionalEnvMethodResult
} from "./serialization";
import * as Types from "..";

export function moduleMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemoduleMethodArgs(argsBuf);

  const result = moduleMethod(
    {
      str: args.str,
      optStr: args.optStr,
      en: args.en,
      optEnum: args.optEnum,
      enumArray: args.enumArray,
      optEnumArray: args.optEnumArray,
      map: args.map,
      mapOfArr: args.mapOfArr,
      mapOfObj: args.mapOfObj,
      mapOfArrOfObj: args.mapOfArrOfObj
    }
  );
  return serializemoduleMethodResult(result);
}

export function objectMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  if (env_size == 0) {
    throw new Error("Environment is not set, and it is required by method 'objectMethod'")
  }
  
  const envBuf = wrap_load_env(env_size);
  const env = Types.Env.fromBuffer(envBuf);
  const args = deserializeobjectMethodArgs(argsBuf);

  const result = objectMethod(
    {
      object: args.object,
      optObject: args.optObject,
      objectArray: args.objectArray,
      optObjectArray: args.optObjectArray
    },
    env
  );
  return serializeobjectMethodResult(result);
}

export function optionalEnvMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  let env: Types.Env | null = null;
  if (env_size > 0) {
    const envBuf = wrap_load_env(env_size);
    env = Types.Env.fromBuffer(envBuf);
  }
  const args = deserializeoptionalEnvMethodArgs(argsBuf);

  const result = optionalEnvMethod(
    {
      object: args.object,
      optObject: args.optObject,
      objectArray: args.objectArray,
      optObjectArray: args.optObjectArray
    },
    env
  );
  return serializeoptionalEnvMethodResult(result);
}
