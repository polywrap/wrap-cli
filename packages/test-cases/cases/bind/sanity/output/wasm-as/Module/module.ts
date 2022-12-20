import * as Types from "..";

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

import {
  wrap_invoke_args,
  wrap_invoke,
  wrap_load_env,
  InvokeArgs,
} from "@polywrap/wasm-as";

export abstract class IModule {
  private _env: Types.Env;

  abstract moduleMethod(
    args: Types.Args_moduleMethod
  ): i32;

  abstract objectMethod(
    args: Types.Args_objectMethod
  ): Types.AnotherType | null;

  abstract optionalEnvMethod(
    args: Types.Args_optionalEnvMethod
  ): Types.AnotherType | null;

  abstract _if(
    args: Types.Args__if
  ): Types._else;

  public get env(): Types.Env {
    return this._env;
  }

  public setEnv(env: Types.Env): void {
    this._env = env;
  }

  public _wrap_invoke(method_size: u32, args_size: u32, env_size: u32): bool {
    const args: InvokeArgs = wrap_invoke_args(
      method_size,
      args_size
    );

    if (args.method == "moduleMethod") {
      return wrap_invoke(args, env_size, this.moduleMethodWrapped);
    }
    else if (args.method == "objectMethod") {
      return wrap_invoke(args, env_size, this.objectMethodWrapped);
    }
    else if (args.method == "optionalEnvMethod") {
      return wrap_invoke(args, env_size, this.optionalEnvMethodWrapped);
    }
    else if (args.method == "if") {
      return wrap_invoke(args, env_size, this.ifWrapped);
    }
    else {
      return wrap_invoke(args, env_size, null);
    }
  }

  private moduleMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
    const args = deserializemoduleMethodArgs(argsBuf);

    const result = this.moduleMethod(
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

  private objectMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
    if (env_size == 0) {
      throw new Error("Environment is not set, and it is required by method 'objectMethod'")
    }
    
    const envBuf = wrap_load_env(env_size);
    this.setEnv(Types.Env.fromBuffer(envBuf));
    const args = deserializeobjectMethodArgs(argsBuf);

    const result = this.objectMethod(
      {
        object: args.object,
        optObject: args.optObject,
        objectArray: args.objectArray,
        optObjectArray: args.optObjectArray
      }
    );
    return serializeobjectMethodResult(result);
  }

  private optionalEnvMethodWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
    if (env_size > 0) {
      const envBuf = wrap_load_env(env_size);
      this.setEnv(Types.Env.fromBuffer(envBuf));
    }
    const args = deserializeoptionalEnvMethodArgs(argsBuf);

    const result = this.optionalEnvMethod(
      {
        object: args.object,
        optObject: args.optObject,
        objectArray: args.objectArray,
        optObjectArray: args.optObjectArray
      }
    );
    return serializeoptionalEnvMethodResult(result);
  }

  private ifWrapped(argsBuf: ArrayBuffer, env_size: u32): ArrayBuffer {
    const args = deserializeifArgs(argsBuf);

    const result = this._if(
      {
        _if: args._if
      }
    );
    return serializeifResult(result);
  }
}