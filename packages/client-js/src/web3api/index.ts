export * from "./core";

export interface ExecuteOptions {
  module: "query" | "mutation";
  method: string;
  arguments: Record<string, any>;
  results?: Record<string, any>;
}

export interface ExecuteResult {
  result: Record<string, any>;
  error: Error;
}

export abstract class Web3Api {
  abstract execute(
    options: ExecuteOptions,
    client: Web3ApiClient
  ): Promise<ExecuteResult>;
}

export class PluginWeb3Api extends Web3Api {

}

export class WasmWeb3Api extends Web3Api {

}

export class Web3ApiCache extends Map<string, Web3Api> { }