import {
  w3_subinvoke,
  Nullable,
  BigInt,
  JSON
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

  public static importedMethod(input: Input_importedMethod): Types.TestImport_Object | null {
    const args = serializeimportedMethodArgs(input);
    const result = w3_subinvoke(
      "testimport.uri.eth",
      "mutation",
      "importedMethod",
      args
    );
    return deserializeimportedMethodResult(result);
  }

  public static anotherMethod(input: Input_anotherMethod): i32 {
    const args = serializeanotherMethodArgs(input);
    const result = w3_subinvoke(
      "testimport.uri.eth",
      "mutation",
      "anotherMethod",
      args
    );
    return deserializeanotherMethodResult(result);
  }
}
