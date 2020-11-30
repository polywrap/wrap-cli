import {
  UriRedirect,
  Web3ApiClient
} from "../client";
import {
  Web3ApiClientPlugin
} from "../plugin";
import {
  ExecuteOptions,
  ExecuteResult
} from "./execute";
import {
  PluginWeb3Api
} from "./plugin-web3api";

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

export function fetchWeb3Api(uri: string, redirects: UriRedirect[]): Web3Api {
  // Iterate through all redirects. If anything matches (string match or regex match),
  // apply the redirect. If the redirect `to` is a Plugin, return a PluginWeb3Api instance.
  let finalUri = uri;

  for (const redirect of redirects) {
    let tryRedirect: (testUri: string) => string | (() => Web3ApiClientPlugin);;

    if (typeof redirect.from === "string") {
      tryRedirect = (testUri: string) => testUri === redirect.from ? redirect.to : testUri;
    } else {
      tryRedirect = (testUri: string) => testUri.match(redirect.from) ? redirect.to : testUri;
    }

    const uriOrPlugin = tryRedirect(finalUri);

    if (typeof uriOrPlugin === "string") {
      finalUri = uriOrPlugin;
    } else {
      // We've found a plugin, return an instance of it
      return new PluginWeb3Api(finalUri, uriOrPlugin());
    }
  }

  // The final URI has been resolved, let's now resolve the Web3API package
  // TODO:
  // - Short Term: use IPFS & ENS as built-in resolvers
  // - Long Term:
  // - - core.web3api.eth -> "all core Web3API abstract interfaces"
  // - - uri-resolver.core.web3api.eth -> "interface for URI resolvers"
  // - - uri-resolver.ens.web3api.eth -> "implements the uri-resolver interface"
  // - - uri-resolver.ipfs.web3api.eth -> "implements the uri resolver interface"
  // - - - The interface can be used to:
  // - - - (1) check if URI is a valid match ("is this an ENS domain?")
  // - - - (2) resolve to another URI (ENS domain -> IPFS hash)
  // - - - (3) finalize resolution, meaning that the Web3API package can now be accessed from the URI (ls directory, getFile, etc).
  // - - - There will be standard URI resolvers built into the client, which will then enable additionals to be added.
  // - - - IPFS & ENS are the current proposed defaults, which others will extend off of.
  // - - - Possible aggregate call for step 1 & 2: resolve(uri) => string | true | false
}
