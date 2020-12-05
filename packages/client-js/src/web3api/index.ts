import { Web3ApiClient } from "../Web3ApiClient";

export { Manifest } from "./Manifest";

export interface ExecuteOptions {
  module: "query" | "mutation";
  method: string;
  input: Record<string, any>;
  results?: Record<string, any>;
}

export interface ExecuteResult {
  result: Record<string, any>;
  error?: Error;
}

export abstract class Web3Api {

  constructor(protected _uri: string) { }

  public async abstract execute(
    options: ExecuteOptions,
    client: Web3ApiClient
  ): Promise<ExecuteResult>;
}

export class Web3ApiCache extends Map<string, Web3Api> { }

// TODO: logging (client.logLevel === Log.Info && log.logInfo("message..."))
// - logging used to verify call stacks of various client implementations
// TODO: support lazy fetching of files within Web3Api class

// TODO: client.sanitizeRedirects() -> iterate through all redirects, make sure we can resolve all of them (will call getImplementations...)
// TODO: client.getImplementations(uri) -> iterate through all known Web3API's and find all implementations
