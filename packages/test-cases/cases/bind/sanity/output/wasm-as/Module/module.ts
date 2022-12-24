import * as Types from "..";

import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Box,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";

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
  wrap_invoke_result,
  wrap_invoke_error,
  wrap_load_env,
  InvokeArgs,
} from "@polywrap/wasm-as";

export abstract class IModule {
  private __env__: Types.Env | null = null;

  public get env(): Types.Env {
    if (this.__env__ === null) {
      throw new Error("Environment is not set, and it is required by this module");
    }
    return this.__env__ as Types.Env;
  }

  public __setEnv__(env: Types.Env): void {
    this.__env__ = env;
  }

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
}