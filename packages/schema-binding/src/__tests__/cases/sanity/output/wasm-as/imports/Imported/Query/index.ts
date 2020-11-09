import {
  queryWeb3Api,
  Nullable
} from "@web3api/wasm-as";
import { uri } from "../";
import {
  serializeimportedMethod,
  deserializeimportedMethod
} from "./serialization";

export class ImportedQuery {
  public static importedMethod(input: {
    str: string,
    optStr: string | null,
    u: u32,
    optU: Nullable<u32>,
    uArrayArray: Array<Array<Nullable<u32>> | null>
  }): string {
    const args = serializeimportedMethod(input);
    const result = queryWeb3Api(
      uri,
      `query {
        importedMethod(
          str: $str,
          optStr: $optStr,
          u: $u,
          optU: $optU,
          uArrayArray: $uArrayArray
        )
      }`,
      args
    );
    return deserializeimportedMethod(result);
  }
}
