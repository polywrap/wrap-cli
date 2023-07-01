import * as Types from "..";

import {
  BigInt,
  BigNumber,
  Box,
  JSON,
} from "@polywrap/wasm-as";

export abstract class ModuleBase {
  abstract moduleMethod(
    args: Types.Args_moduleMethod
  ): i32;

  abstract objectMethod(
    args: Types.Args_objectMethod,
    env: Types.Env
  ): Types.AnotherType | null;

  abstract optionalEnvMethod(
    args: Types.Args_optionalEnvMethod,
    env: Types.Env | null
  ): Types.AnotherType | null;

  abstract _if(
    args: Types.Args__if
  ): Types._else;
}