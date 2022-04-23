import { Client } from "@web3api/core-js";
import {
  Module,
  QueryEnv,
  Input_method,
  Input_sanitizeEnv
} from "./w3";

export interface QueryConfig extends Record<string, unknown> {

}

export class Query extends Module<QueryConfig> {

  public sanitizeEnv(input: Input_sanitizeEnv): QueryEnv {
    return {
      queryArg: input.bar.toString()
    };
  }

  public method(input: Input_method, _client: Client): string {
    return this.env.queryArg + input.arg;
  }
}
