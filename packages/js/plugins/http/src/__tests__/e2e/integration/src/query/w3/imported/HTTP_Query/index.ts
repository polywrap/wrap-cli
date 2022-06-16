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
  serializegetArgs,
  deserializegetResult,
  Input_get,
  serializepostArgs,
  deserializepostResult,
  Input_post
} from "./serialization";
import * as Types from "../..";

export class HTTP_Query {

  public static uri: string = "w3://ens/http.web3api.eth";

  public static get(
    input: Input_get
  ): Result<Types.HTTP_Response | null, string> {
    const args = serializegetArgs(input);
    const result = w3_subinvoke(
      "w3://ens/http.web3api.eth",
      "query",
      "get",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.HTTP_Response | null, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.HTTP_Response | null, string>(
      deserializegetResult(result.unwrap())
    );
  }

  public static post(
    input: Input_post
  ): Result<Types.HTTP_Response | null, string> {
    const args = serializepostArgs(input);
    const result = w3_subinvoke(
      "w3://ens/http.web3api.eth",
      "query",
      "post",
      args
    );

    if (result.isErr) {
      return Result.Err<Types.HTTP_Response | null, string>(
        result.unwrapErr()
      );
    }

    return Result.Ok<Types.HTTP_Response | null, string>(
      deserializepostResult(result.unwrap())
    );
  }
}
