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

export class TestImport_Query {

  public static interfaceUri: string = "testimport.uri.eth";

  public uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  public importedMethod(input: Input_importedMethod): Types.TestImport_Object | null {
    const args = serializeimportedMethodArgs(input);
    const result = w3_subinvoke(
      this.uri,
      "query",
      "importedMethod",
      args
    );
    return deserializeimportedMethodResult(result);
  }

  public anotherMethod(input: Input_anotherMethod): i32 {
    const args = serializeanotherMethodArgs(input);
    const result = w3_subinvoke(
      this.uri,
      "query",
      "anotherMethod",
      args
    );
    return deserializeanotherMethodResult(result);
  }
}
