import { Web3ApiClient } from "../client";
import {
  ExecuteOptions,
  ExecuteResult
} from "./execute";

export { Manifest } from "./manifest";

export {
  ExecuteOptions,
  ExecuteResult
};

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
