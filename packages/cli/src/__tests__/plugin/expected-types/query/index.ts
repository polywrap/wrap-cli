import {
  Client,
  Module,
  Input_sanitizeEnv,
  Input_method,
  Env,
  Object,
} from "./w3";

export interface QueryConfig extends Record<string, unknown> {
  prop: string;
}

export class Query extends Module<QueryConfig> {

  sanitizeEnv(
    input: Input_sanitizeEnv,
    _client: Client
  ): Promise<Env> {
    return Promise.resolve({
      arg1: "sanitized: " + input.env.userProp
    });
  }

  method(
    input: Input_method,
    _client: Client
  ): Object {
    console.log(input.str);
    console.log(this.env.arg1);
    console.log(this.config.prop);
    return {
      u: 5,
      array: [true],
      bytes: Uint8Array.from([1, 2, 3, 4])
    };
  }
}
