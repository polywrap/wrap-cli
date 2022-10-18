import {
  wrap_subinvoke,
  wrap_subinvokeImplementation,
  Box,
  BigInt,
  BigNumber,
  JSON,
  Result
} from "@polywrap/wasm-as";
import {
  serializeimportedMethodArgs,
  deserializeimportedMethodResult,
  Args_importedMethod,
  serializeanotherMethodArgs,
  deserializeanotherMethodResult,
  Args_anotherMethod,
  serializereturnsArrayOfEnumsArgs,
  deserializereturnsArrayOfEnumsResult,
  Args_returnsArrayOfEnums
} from "./serialization";
import * as Types from "../..";

export class TestImport_Module {

  public static interfaceUri: string = "testimport.uri.eth";

  public uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  public importedMethod(
    args: Args_importedMethod
  ): Result<Types.TestImport_Object | null, string> {
    const argsBuf = serializeimportedMethodArgs(args);
    const result = wrap_subinvokeImplementation(
      "testimport.uri.eth",
      this.uri,
      "importedMethod",
      argsBuf
    );

    if (result.isErr) {
      return Result.Err<Types.TestImport_Object | null, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.TestImport_Object | null, string>(
      deserializeimportedMethodResult(result.unwrap())
    );
  }

  public anotherMethod(
    args: Args_anotherMethod
  ): Result<i32, string> {
    const argsBuf = serializeanotherMethodArgs(args);
    const result = wrap_subinvokeImplementation(
      "testimport.uri.eth",
      this.uri,
      "anotherMethod",
      argsBuf
    );

    if (result.isErr) {
      return Result.Err<i32, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<i32, string>(
      deserializeanotherMethodResult(result.unwrap())
    );
  }

  public returnsArrayOfEnums(
    args: Args_returnsArrayOfEnums
  ): Result<Array<Box<Types.TestImport_Enum_Return> | null>, string> {
    const argsBuf = serializereturnsArrayOfEnumsArgs(args);
    const result = wrap_subinvokeImplementation(
      "testimport.uri.eth",
      this.uri,
      "returnsArrayOfEnums",
      argsBuf
    );

    if (result.isErr) {
      return Result.Err<Array<Box<Types.TestImport_Enum_Return> | null>, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Array<Box<Types.TestImport_Enum_Return> | null>, string>(
      deserializereturnsArrayOfEnumsResult(result.unwrap())
    );
  }
}
