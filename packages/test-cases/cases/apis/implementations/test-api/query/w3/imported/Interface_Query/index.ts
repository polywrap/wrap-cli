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
  serializeabstractQueryMethodArgs,
  deserializeabstractQueryMethodResult,
  Input_abstractQueryMethod
} from "./serialization";
import * as Types from "../..";

export class Interface_Query {

  public static uri: string = "w3://ens/interface.eth";

  public static abstractQueryMethod(
    input: Input_abstractQueryMethod
  ): Result<string, string> {
    const args = serializeabstractQueryMethodArgs(input);
    const result = w3_subinvoke(
      "w3://ens/interface.eth",
      "query",
      "abstractQueryMethod",
      args
    );

    if (result.isErr) {
      return Result.Err<string, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<string, string>(
      deserializeabstractQueryMethodResult(result.unwrap())
    );
  }
}
