import {
  Client,
  Module,
  Input_method
} from "./w3";

export interface MutationConfig extends Record<string, unknown> {
  prop: string;
}

export class Mutation extends Module<MutationConfig> {

  method(
    _input: Input_method,
    _client: Client
  ): string {
    return "Mutation method called" + this.config.prop;
  }
}
