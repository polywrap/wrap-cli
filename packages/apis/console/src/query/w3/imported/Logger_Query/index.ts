import {
  w3_subinvoke,
  Nullable
} from "@web3api/wasm-as";
import {
  serializelogArgs,
  deserializelogResult,
  Input_log
} from "./serialization";
import * as Types from "../..";

export class Logger_Query {

  public static uri: string = "w3://ens/js-logger.web3api.eth";

  public static log(input: Input_log): bool {
    const args = serializelogArgs(input);
    const result = w3_subinvoke(
      "w3://ens/js-logger.web3api.eth",
      "query",
      "log",
      args
    );
    return deserializelogResult(result);
  }
}
