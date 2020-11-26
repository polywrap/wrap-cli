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

export function fetchWeb3Api(uri: string, redirects: UriRedirect[]) {
  // TODO:
  // - iterate through redirects, see if anything matches (strcmp or regex.match)
  // - if match is string, use new uri, go to step 1
  // - if match is plugin, wrap in PluginWeb3Api and return
  // - else, resolve the URI (use Uri Resolvers [ipfs, ens])

  // URI Resolver is a pattern match, which forwards the URI string to a method on a Web3API
  // ex: ENS => ethereum.web3api.eth:ensToCid(uri) ->
  //     QmHASH => ipfs.web3api.eth:getFile

  // Resolvers can be an iterative process, which results in a single Web3API that can be called into for the "getFile" method.
  // resolve(uri) => string | true | false
  // getFile(uri, './web3api.yaml')
}
