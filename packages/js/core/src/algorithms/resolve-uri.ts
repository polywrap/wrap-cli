import {
  Api,
  deserializeManifest,
  Manifest,
  Plugin,
  Client,
  Uri
} from "../types";
import * as UriResolver from "../apis/uri-resolver";

// TODO: add a description of the algorithm
export async function resolveUri(
  uri: Uri,
  client: Client,
  createPluginApi: (uri: Uri, plugin: () => Plugin) => Api,
  createApi: (uri: Uri, manifest: Manifest, apiResolver: Uri) => Api
): Promise<Api> {

  let resolvedUri = uri;

  // Keep track of past URIs to avoid infinite loops
  const uriHistory: { uri: string; source: string; }[] = [{
    uri: resolvedUri.uri,
    source: "ROOT"
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

  const redirects = client.redirects();

  // Iterate through all redirects. If anything matches
  // apply the redirect. If the redirect `to` is a Plugin,
  // return a PluginWeb3Api instance.
  for (const redirect of redirects) {

    const from = redirect.from;

    if (!from) {
      throw Error(`Redirect missing the from property.\nEncountered while resolving ${uri.uri}`);
    }

    // Determine what type of comparison to use (string compare or regex match)
    let tryRedirect: (testUri: Uri) => Uri | (() => Plugin);

    if (Uri.isUri(from)) {
      tryRedirect = (testUri: Uri) => testUri.uri === from.uri ? redirect.to : testUri;
    } else {
      tryRedirect = (testUri: Uri) => testUri.uri.match(from) ? redirect.to : testUri;
    }

    const uriOrPlugin = tryRedirect(resolvedUri);

    if (Uri.isUri(uriOrPlugin)) {
      if (uriOrPlugin.uri !== resolvedUri.uri) {
        trackUriRedirect(uriOrPlugin.uri, redirect.from.toString());
        resolvedUri = uriOrPlugin;
      }
    } else {
      // We've found a plugin, return an instance of it
      return createPluginApi(resolvedUri, uriOrPlugin);
    }
  }

  // The final URI has been resolved, let's now resolve the Web3API package
  // TODO: remove this! Go through all known redirects and get the ones that implement uri-resolver & api-resoler
  const uriResolverImplementations = [
    new Uri("ens/ipfs.web3api.eth"),
    new Uri("ens/ens.web3api.eth")
  ];

  for (let i = 0; i < uriResolverImplementations.length; ++i) {
    const uriResolver = uriResolverImplementations[i];

    {
      const { data, errors } = await UriResolver.Query.supportedUriAuthority(
        client, uriResolver, resolvedUri.authority
      );

      // Throw errors so the caller (client) can handle them
      if (errors?.length) {
        throw errors;
      }

      // If nothing was returned, or the scheme is unsupported, continue
      if (!data || !data.supportedUriAuthority) {
        continue;
      }
    }

    // TODO: implement recursive loading of URI-Resolver implementations?
    let newUri: string | undefined;
    let manifestStr: string | undefined;
    {
      const { data, errors } = await UriResolver.Query.tryResolveUriPath(
        client, uriResolver, resolvedUri.path
      );

      // Throw errors so the caller (client) can handle them
      if (errors?.length) {
        throw errors;
      }

      // If nothing was returned, the URI is not supported
      if (!data || !data.tryResolveUriPath ||
         (!data.tryResolveUriPath.uri && !data.tryResolveUriPath.manifest)) {
        continue;
      }

      newUri = data.tryResolveUriPath.uri;
      manifestStr = data.tryResolveUriPath.manifest;
    }

    if (newUri) {
      // Use the new URI, and reset our index
      trackUriRedirect(newUri, uriResolver.uri);
      resolvedUri = new Uri(newUri);
      i = 0;
      continue;
    } else if (manifestStr) {
      // We've found our manifest at the current URI resolver
      // meaning the URI resolver can also be used as an API resolver
      const manifest = deserializeManifest(manifestStr);
      return createApi(resolvedUri, manifest, uriResolver);
    }
  }

  // We've failed to resolve the URI
  throw Error(`No Web3API found at URI: ${uri}`);
}
