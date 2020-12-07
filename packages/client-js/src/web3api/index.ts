import {
  Uri,
  Web3ApiClient
} from "../";

export * from "./Manifest";
export * from "./PluginWeb3Api";
export * from "./WasmWeb3Api";
export * from "./uri-resolution";
export * from "./core-plugins";

export interface ExecuteOptions {
  module: "query" | "mutation";
  method: string;
  input: Record<string, any>;
  results?: Record<string, any>;
}

export interface ExecuteResult<
  TData = Record<string, unknown>
> {
  data?: TData | null;
  errors?: Error[];
}

export abstract class Web3Api {

  constructor(protected _uri: Uri) { }

  public async abstract execute<
    TData = Record<string, unknown>
  >(
    options: ExecuteOptions,
    client: Web3ApiClient
  ): Promise<ExecuteResult<TData>>;
}

export class Web3ApiCache extends Map<string, Web3Api> { }

// TODO: logging (client.logLevel === Log.Info && log.logInfo("message..."))
// - logging used to verify call stacks of various client implementations
// TODO: support lazy fetching of files within Web3Api class

// TODO: client.sanitizeRedirects() -> iterate through all redirects, make sure we can resolve all of them (will call getImplementations...)
// TODO: client.getImplementations(uri) -> iterate through all known Web3API's and find all implementations
