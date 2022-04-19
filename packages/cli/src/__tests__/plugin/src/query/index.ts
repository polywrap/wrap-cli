import { Client, MaybeAsync } from "@web3api/core-js";
import {
  Module,
  Object,
  Input_method
} from "./w3";

export interface QueryConfig extends Record<string, unknown> {

}

export class Query implements Module<QueryConfig> {
  constructor(private _configs: QueryConfig) {
  }

  public method(_input: Input_method, _client: Client): MaybeAsync<Object> {
    return {
      u: 0,
      array: [true],
      bytes: null,
    };
  }
}