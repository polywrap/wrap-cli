import {
  w3_subinvoke,
  w3_subinvokeImplementation,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  Result
} from "@web3api/wasm-as";
import {
  serializeabstractMutationMethodArgs,
  deserializeabstractMutationMethodResult,
  Input_abstractMutationMethod
} from "./serialization";
import * as Types from "../..";

export class Interface_Mutation {

  public static interfaceUri: string = "w3://ens/interface.eth";

  public uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  public abstractMutationMethod(
    input: Input_abstractMutationMethod
  ): Result<u8, string> {
    const args = serializeabstractMutationMethodArgs(input);
    const result = w3_subinvokeImplementation(
      "w3://ens/interface.eth",
      this.uri,
      "mutation",
      "abstractMutationMethod",
      args
    );

    if (result.isErr) {
      return Result.Err<u8, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<u8, string>(
      deserializeabstractMutationMethodResult(result.unwrap())
    );
  }
}
