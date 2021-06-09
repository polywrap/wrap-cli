import { Api, Client, Uri, PluginPackage } from "../types";
import { Manifest, deserializeManifest } from "../manifest";
import * as ApiResolver from "../apis/api-resolver";
import { applyRedirects } from "./apply-redirects";
import { findPluginPackage } from "./find-plugin-package";
import { getImplementations } from "./get-implementations";

import { Tracer } from "@web3api/tracing-js";

export const resolveUri = Tracer.traceFunc(
  "core: resolveUri",
  async (
    uri: Uri,
    client: Client,
    createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
    createApi: (uri: Uri, manifest: Manifest, apiResolver: Uri) => Api,
    noValidate?: boolean
  ): Promise<Api> => {
    const redirects = client.redirects();

    const finalRedirectedUri = applyRedirects(uri, redirects);

    const plugin = findPluginPackage(finalRedirectedUri, redirects);

    if (plugin) {
      return Tracer.traceFunc(
        "resolveUri: createPluginApi",
        (uri: Uri, plugin: PluginPackage) => createPluginApi(uri, plugin)
      )(finalRedirectedUri, plugin);
    }

    // The final URI has been resolved, let's now resolve the Web3API package
    const uriResolverImplementations = getImplementations(
      new Uri("w3/api-resolver"),
      redirects,
      client.implementations()
    );

    return await resolveUriWithApiResolvers(
      finalRedirectedUri,
      uriResolverImplementations,
      client,
      createApi,
      noValidate
    );
  }
);

const resolveUriWithApiResolvers = async (
  uri: Uri,
  apiResolverImplementationUris: Uri[],
  client: Client,
  createApi: (uri: Uri, manifest: Manifest, apiResolver: Uri) => Api,
  noValidate?: boolean
): Promise<Api> => {
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

  const tryResolveUriWithApiResolver = async (
    uri: Uri,
    uriResolver: Uri
  ): Promise<ApiResolver.MaybeUriOrManifest | undefined> => {
    const { data } = await ApiResolver.Query.tryResolveUri(
      client,
      uriResolver,
      resolvedUri
    );

    // If nothing was returned, the URI is not supported
    if (!data || (!data.uri && !data.manifest)) {
      Tracer.addEvent("continue", uriResolver.uri);
      return undefined;
    }

    return data;
  };

  // Iterate through all api-resolver implementations,
  // iteratively resolving the URI until we reach the Web3API manifest
  for (let i = 0; i < apiResolverImplementationUris.length; ++i) {
    const uriResolver = apiResolverImplementationUris[i];

    const result = await tryResolveUriWithApiResolver(resolvedUri, uriResolver);

    if (!result) {
      continue;
    }

    if (result.uri) {
      // Use the new URI, and reset our index
      const convertedUri = new Uri(result.uri);
      trackUriRedirect(convertedUri.uri, uriResolver.uri);

      Tracer.addEvent("api-resolver-redirect", {
        from: resolvedUri.uri,
        to: convertedUri.uri,
      });

      // Restart the iteration over again
      i = -1;
      resolvedUri = convertedUri;
      continue;
    } else if (result.manifest) {
      // We've found our manifest at the current URI resolver
      // meaning the URI resolver can also be used as an API resolver
      const manifest = deserializeManifest(result.manifest, { noValidate });

      return Tracer.traceFunc(
        "resolveUri: createApi",
        (uri: Uri, manifest: Manifest, apiResolver: Uri) =>
          createApi(uri, manifest, apiResolver)
      )(resolvedUri, manifest, uriResolver);
    }
  }

  // We've failed to resolve the URI
  throw Error(
    `No Web3API found at URI: ${resolvedUri.uri}` +
      `\nResolution Path: ${JSON.stringify(uriHistory, null, 2)}` +
      `\nResolvers Used: ${apiResolverImplementationUris}`
  );
};
