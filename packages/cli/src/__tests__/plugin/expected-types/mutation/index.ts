import {
  Client,
  Module,
  Input_method
} from "./w3";

export interface MutationConfig {
  prop: string;
}

export class Mutation extends Module<MutationConfig> {

  method(
    input: Input_method,
    client: Client
  ): string {
    return "Mutation method called" + this.config.prop;
  }
}
