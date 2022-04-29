import { Client } from "@web3api/core-js";
import {
  Module,
  Input_method
} from "./w3";

export interface MutationConfig extends Record<string, unknown> {

}

export class Mutation extends Module<MutationConfig> {

  public method(input: Input_method, _client: Client): string {
    return this.env.mutationArg + input.arg.toString();
  }
}
