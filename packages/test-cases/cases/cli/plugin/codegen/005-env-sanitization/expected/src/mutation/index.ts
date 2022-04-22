import { Client } from "@web3api/core-js";
import {
  Module,
  MutationEnv,
  Input_method,
  Input_sanitizeEnv,
} from "./w3";

export interface MutationConfig extends Record<string, unknown> {

}

export class Mutation extends Module<MutationConfig> {

  public sanitizeEnv(input: Input_sanitizeEnv): MutationEnv {
    return {
      mutationArg: input.foo.toString()
    };
  }

  public method(input: Input_method, _client: Client): string {
    return this.env.mutationArg + input.arg.toString();
  }
}
