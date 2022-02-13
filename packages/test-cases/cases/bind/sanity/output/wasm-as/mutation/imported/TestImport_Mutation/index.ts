import {
  w3_subinvoke,
  Nullable,
  BigInt,
  JSON,
  Result
} from "@web3api/wasm-as";
import {
  serializeimportedMethodArgs,
  deserializeimportedMethodResult,
  Input_importedMethod,
  serializeanotherMethodArgs,
  deserializeanotherMethodResult,
  Input_anotherMethod
} from "./serialization";
import * as Types from "../..";

export class TestImport_Mutation {

  public static uri: string = "testimport.uri.eth";

  public static importedMethod(
    input: Input_importedMethod
  ): Result<Types.TestImport_Object | null, string> {
    const args = serializeimportedMethodArgs(input);
    const result = w3_subinvoke(
      "testimport.uri.eth",
      "mutation",
      "importedMethod",
      args
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

  public static anotherMethod(
    input: Input_anotherMethod
  ): Result<i32, string> {
    const args = serializeanotherMethodArgs(input);
    const result = w3_subinvoke(
      "testimport.uri.eth",
      "mutation",
      "anotherMethod",
      args
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
}
