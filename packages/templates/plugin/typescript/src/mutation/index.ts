import {
  Client,
  Module,
  Input_sampleMutation,
} from "./w3";

export interface MutationConfig extends Record<string, unknown> { }

export class Mutation extends Module<MutationConfig> {

  public sampleMutation(input: Input_sampleMutation, client: Client): boolean {
    return new Uint8Array(input.data).length > 0;
  }
}
