import { Web3Api } from "./";
import { PluginWeb3Api } from "./plugin-web3api";
import { WasmWeb3Api } from "./wasm-web3api";
import { deserializeManifest } from "./manifest";
import * as tryResolveUri from "./queries/tryResolveUri";
import {
  UriRedirect,
  Web3ApiClient
} from "../client";
import { Web3ApiClientPlugin } from "../plugin";

export async function resolveWeb3Api(
  uri: string,
  redirects: UriRedirect[],
  client: Web3ApiClient
): Promise<Web3Api> {

  let resolvedUri = uri;

  // Keep track of past URIs to avoid infinite loops
  const uriHistory: { uri: string; source: string; }[] = [{
    uri: resolvedUri,
    source: "HEAD"
  }];

  const trackUriRedirect = (uri: string, source: string) => {
    const dupIdx = uriHistory.findIndex((item) => item.uri === uri);
    uriHistory.push({ uri, source });
    if (dupIdx > -1) {
      throw Error(
        `Infinite loop while resolving URI "${uri}".\nResolution Stack: ${uriHistory}`
      );
    }
  }

  // Iterate through all redirects. If anything matches (string match or regex match),
  // apply the redirect. If the redirect `to` is a Plugin, return a PluginWeb3Api instance.
  for (const redirect of redirects) {
    let tryRedirect: (testUri: string) => string | (() => Web3ApiClientPlugin);;

    if (typeof redirect.from === "string") {
      tryRedirect = (testUri: string) => testUri === redirect.from ? redirect.to : testUri;
    } else {
      tryRedirect = (testUri: string) => testUri.match(redirect.from) ? redirect.to : testUri;
    }

    const uriOrPlugin = tryRedirect(resolvedUri);

    if (typeof uriOrPlugin === "string") {
      if (uriOrPlugin !== resolvedUri) {
        trackUriRedirect(uriOrPlugin, redirect.from.toString());
        resolvedUri = uriOrPlugin;
      }
    } else {
      // We've found a plugin, return an instance of it
      return new PluginWeb3Api(resolvedUri, uriOrPlugin());
    }
  }

  // TODO: support URI resolver extensions, not just IPFS & ENS

  // The final URI has been resolved, let's now resolve the Web3API package
  const uriResolverImplementations = [
    "ipfs.web3api.eth",
    "ens.web3api.eth"
  ];

  for (let i = 0; i < uriResolverImplementations.length; ++i) {
    const uriResolver = uriResolverImplementations[i];

    const { data, errors } = await client.query<tryResolveUri.Result>({
      uri: uriResolver,
      query: tryResolveUri.query(resolvedUri)
    });

    // Throw errors so the caller (client) can handle them
    if (errors?.length) {
      throw errors;
    }

    // If nothing was returned, the URI is not supported
    if (!data || (!data.uri && !data.manifest)) {
      continue;
    }

    if (data.uri) {
      // Use the new URI, and reset our index
      trackUriRedirect(data.uri, uriResolver);
      resolvedUri = data.uri;
      i = 0;
      continue;
    } else if (data.manifest) {
      // We've found our manifest at the current URI resolver
      const manifest = deserializeManifest(data.manifest);
      return new WasmWeb3Api(resolvedUri, manifest, uriResolver);
    }
  }

  // We've failed to resolve the URI
  throw Error(`No Web3API found at URI: ${uri}`);
}
