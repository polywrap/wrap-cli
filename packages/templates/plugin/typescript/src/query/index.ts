import {
  Client,
  Module,
  Input_sampleQuery,
} from "./w3";

export interface QueryConfig extends Record<string, unknown> {
  defaultValue: string;
}

export class Query extends Module<QueryConfig> {

  public async sampleQuery(input: Input_sampleQuery, client: Client): Promise<string> {
    return input.data + this.config.defaultValue;
  }
}
