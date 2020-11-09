import {
  queryWeb3Api,
  Nullable
} from "@web3api/wasm-as";
import {
  serializeimportedMethod,
  deserializeimportedMethod,
  serializeanotherMethod,
  deserializeanotherMethod
} from "./serialization";

export const uri = "testimport.uri.eth";

export class TestImportQuery {
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

  public static anotherMethod(input: {
    arg: Array<string>
  }): i64 {
    const args = serializeanotherMethod(input);
    const result = queryWeb3Api(
      uri,
      `query {
        anotherMethod(
          arg: $arg
        )
      }`,
      args
    );
    return deserializeanotherMethod(result);
  }
}
