import { Client } from "@web3api/core-js";
import {
  Module,
  Object,
  Input_method
} from "./w3";

export interface QueryConfig extends Record<string, unknown> {

}

export class Query extends Module<QueryConfig> {

  public method(_input: Input_method, _client: Client): Object {
    return {
      u: 0,
      array: [true],
      bytes: null,
    };
  }
}