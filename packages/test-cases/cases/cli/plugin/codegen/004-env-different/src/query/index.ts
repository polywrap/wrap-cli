import { Client } from "@web3api/core-js";
import {
  Module,
  Input_method
} from "./w3";

export interface QueryConfig extends Record<string, unknown> {

}

export class Query extends Module<QueryConfig> {

  public method(input: Input_method, _client: Client): string {
    return this.env.queryArg + input.arg;
  }
}
