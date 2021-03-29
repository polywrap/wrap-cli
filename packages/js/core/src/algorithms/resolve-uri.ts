import { Api, Client, Uri, PluginPackage } from "../types";
import { Manifest, deserializeManifest } from "../manifest";
import * as ApiResolver from "../apis/api-resolver";
import { getImplementations } from "./get-implementations";

export async function resolveUri(
  uri: Uri,
  client: Client,
  createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
  createApi: (uri: Uri, manifest: Manifest, apiResolver: Uri) => Api,
  noValidate?: boolean
): Promise<Api> {
  let resolvedUri = uri;

  // Keep track of past URIs to avoid infinite loops
  const uriHistory: { uri: string; source: string }[] = [
    {
      uri: resolvedUri.uri,
      source: "ROOT",
    },
  ];

  const trackUriRedirect = (uri: string, source: string) => {
    const dupIdx = uriHistory.findIndex((item) => item.uri === uri);
    uriHistory.push({
      uri,
      source,
    });
    if (dupIdx > -1) {
      throw Error(
        `Infinite loop while resolving URI "${uri}".\nResolution Stack: ${JSON.stringify(
          uriHistory,
          null,
          2
        )}`
      );
    }
  };

  const redirects = client.redirects();

  // Iterate through all redirects. If anything matches
  // apply the redirect. If the redirect `to` is a Plugin,
  // return a PluginWeb3Api instance.
  for (const redirect of redirects) {
    const from = redirect.from;

    if (!from) {
      throw Error(
        `Redirect missing the from property.\nEncountered while resolving ${uri.uri}`
      );
    }

    // Determine what type of comparison to use
    const tryRedirect = (testUri: Uri): Uri | PluginPackage =>
      Uri.equals(testUri, from) ? redirect.to : testUri;

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
  const uriResolverImplementations = getImplementations(
    new Uri("w3/api-resolver"),
    redirects
  );

  for (let i = 0; i < uriResolverImplementations.length; ++i) {
    const uriResolver = uriResolverImplementations[i];

    const { data } = await ApiResolver.Query.tryResolveUri(
      client,
      uriResolver,
      resolvedUri
    );

    // If nothing was returned, the URI is not supported
    if (!data || (!data.uri && !data.manifest)) {
      continue;
    }

    const newUri = data.uri;
    const manifestStr = data.manifest;

    if (newUri) {
      // Use the new URI, and reset our index
      const convertedUri = new Uri(newUri);
      trackUriRedirect(convertedUri.uri, uriResolver.uri);
      resolvedUri = convertedUri;
      i = -1;
      continue;
    } else if (manifestStr) {
      // We've found our manifest at the current URI resolver
      // meaning the URI resolver can also be used as an API resolver
      const manifest = deserializeManifest(manifestStr, { noValidate });
      return createApi(resolvedUri, manifest, uriResolver);
    }
  }

  // We've failed to resolve the URI
  throw Error(
    `No Web3API found at URI: ${uri.uri}` +
      `\nResolution Path: ${JSON.stringify(uriHistory, null, 2)}` +
      `\nResolvers Used: ${uriResolverImplementations}`
  );
}
