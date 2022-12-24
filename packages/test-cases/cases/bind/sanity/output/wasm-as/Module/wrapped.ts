import { wrap_load_env } from "@polywrap/wasm-as";
import {
  deserializemoduleMethodArgs,
  serializemoduleMethodResult,
  deserializeobjectMethodArgs,
  serializeobjectMethodResult,
  deserializeoptionalEnvMethodArgs,
  serializeoptionalEnvMethodResult,
  deserializeifArgs,
  serializeifResult
} from "./serialization";
import { IModule } from "./module";
import * as Types from "..";

export function moduleMethodWrapped(module: IModule, argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializemoduleMethodArgs(argsBuf);

  const result = module.moduleMethod(
    {
      str: args.str,
      optStr: args.optStr,
      en: args.en,
      optEnum: args.optEnum,
      enumArray: args.enumArray,
      optEnumArray: args.optEnumArray,
      map: args.map,
      mapOfArr: args.mapOfArr,
      mapOfMap: args.mapOfMap,
      mapOfObj: args.mapOfObj,
      mapOfArrOfObj: args.mapOfArrOfObj
    }
  );
  return serializemoduleMethodResult(result);
}

export function objectMethodWrapped(module: IModule, argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  if (env_size == 0) {
    throw new Error("Environment is not set, and it is required by method 'objectMethod'")
  }
  
  const envBuf = wrap_load_env(env_size);
  module.__setEnv__(Types.Env.fromBuffer(envBuf));
  const args = deserializeobjectMethodArgs(argsBuf);

  const result = module.objectMethod(
    {
      object: args.object,
      optObject: args.optObject,
      objectArray: args.objectArray,
      optObjectArray: args.optObjectArray
    }
  );
  return serializeobjectMethodResult(result);
}

export function optionalEnvMethodWrapped(module: IModule, argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  if (env_size > 0) {
    const envBuf = wrap_load_env(env_size);
    module.__setEnv__(Types.Env.fromBuffer(envBuf));
  }
  const args = deserializeoptionalEnvMethodArgs(argsBuf);

  const result = module.optionalEnvMethod(
    {
      object: args.object,
      optObject: args.optObject,
      objectArray: args.objectArray,
      optObjectArray: args.optObjectArray
    }
  );
  return serializeoptionalEnvMethodResult(result);
}

export function ifWrapped(module: IModule, argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
  const args = deserializeifArgs(argsBuf);

  const result = module._if(
    {
      _if: args._if
    }
  );
  return serializeifResult(result);
}
