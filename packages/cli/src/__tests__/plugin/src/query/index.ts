import { Client, MaybeAsync } from "@web3api/core-js";
import {
  Module,
  Object,
  Input_method
} from "./w3";

export interface QueryConfigs {

}

export class Query implements Module {
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