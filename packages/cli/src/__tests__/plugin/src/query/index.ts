import { Client, MaybeAsync } from "@web3api/core-js";
import { Input_method } from "../../expected-types/query";
import { IQuery, Object } from "./w3";

export interface QueryConfigs {

}

export class Query implements IQuery {
  constructor(private _configs: QueryConfigs) {
  }

  public method(input: Input_method, client: Client): MaybeAsync<Object> {
    return {
      u: 0,
      array: [true],
      bytes: null,
    };
  }
}