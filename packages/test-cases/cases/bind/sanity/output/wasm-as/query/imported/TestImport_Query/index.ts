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

export namespace TestImport_Query {

  export namespace Interface {

    export const uri: string = "testimport.uri.eth";

    export function importedMethod(
      input: Input_importedMethod,
      implementationUri: string
    ): Types.TestImport_Object | null {
      return Try.importedMethod(input, implementationUri).unwrap();
    }

    export function anotherMethod(
      input: Input_anotherMethod,
      implementationUri: string
    ): i32 {
      return Try.anotherMethod(input, implementationUri).unwrap();
    }

    export namespace Try {

      export function importedMethod(
        input: Input_importedMethod,
        implementationUri: string
      ): Result<Types.TestImport_Object | null, string> {
        const args = serializeimportedMethodArgs(input);
        const result = w3_subinvoke(
          implementationUri,
          "query",
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

      export function anotherMethod(
        input: Input_anotherMethod,
        implementationUri: string
      ): Result<i32, string> {
        const args = serializeanotherMethodArgs(input);
        const result = w3_subinvoke(
          implementationUri,
          "query",
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
  }
}
