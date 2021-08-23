import {
  Api,
  Client,
  Uri,
  PluginPackage,
  InterfaceImplementations,
  PluginRegistration,
  UriRedirect,
  GetUriPathOptions,
  UriPathNode,
} from "../types";
import { Web3ApiManifest, deserializeWeb3ApiManifest } from "../manifest";
import { applyRedirects, followRedirects } from "./apply-redirects";
import { findPluginPackage } from "./find-plugin-package";
import { getImplementations } from "./get-implementations";
import { coreInterfaceUris, UriResolver } from "../interfaces";

import { Tracer } from "@web3api/tracing-js";

export const resolveUri = Tracer.traceFunc(
  "core: resolveUri",
  async (
    uri: Uri,
    client: Client,
    redirects: readonly UriRedirect<Uri>[],
    plugins: readonly PluginRegistration<Uri>[],
    interfaces: readonly InterfaceImplementations<Uri>[],
    createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
    createApi: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => Api,
    noValidate?: boolean
  ): Promise<{ api: Api; resolvedUris: string[] }> => {
    const finalRedirectedUri = applyRedirects(uri, redirects);

    const plugin = findPluginPackage(finalRedirectedUri, plugins);

    if (plugin) {
      const api = Tracer.traceFunc(
        "resolveUri: createPluginApi",
        (uri: Uri, plugin: PluginPackage) => createPluginApi(uri, plugin)
      )(finalRedirectedUri, plugin);
      return { api, resolvedUris: [uri.uri] };
    }

    // The final URI has been resolved, let's now resolve the Web3API package
    const uriResolverImplementations = getImplementations(
      coreInterfaceUris.uriResolver,
      redirects,
      interfaces
    );

    const {
      manifest,
      uriResolver,
      resolvedUris,
    } = await resolveUriWithUriResolvers(
      finalRedirectedUri,
      uriResolverImplementations,
      client,
      noValidate
    );

    const resolvedUri: Uri = new Uri(resolvedUris[resolvedUris.length - 1]);

    const api: Api = Tracer.traceFunc(
      "resolveUri: createApi",
      (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) =>
        createApi(uri, manifest, uriResolver)
    )(resolvedUri, manifest, uriResolver);

    return { api, resolvedUris };
  }
);

export const resolveUriToPath = Tracer.traceFunc(
  "core: resolveUriToPath",
  async (
    uri: Uri,
    client: Client,
    redirects: readonly UriRedirect<Uri>[],
    plugins: readonly PluginRegistration<Uri>[],
    interfaces: readonly InterfaceImplementations<Uri>[],
    noValidate?: boolean,
    options?: GetUriPathOptions
  ): Promise<UriPathNode[]> => {
    const { ignorePlugins, ignoreRedirects } = options ?? {};

    let path: UriPathNode[];
    if (ignoreRedirects) {
      path = [{ uri, fromRedirect: false }];
    } else {
      path = followRedirects(uri, redirects);
    }
    const finalRedirectedUri: Uri = path[path.length - 1].uri;

    if (!ignorePlugins) {
      const plugin = findPluginPackage(finalRedirectedUri, plugins);
      if (plugin) {
        path[path.length - 1].isPlugin = true;
        return path;
      }
    }
    path[path.length - 1].isPlugin = false;

    // The final URI has been resolved, let's now resolve the Web3API package
    const uriResolverImplementations = getImplementations(
      coreInterfaceUris.uriResolver,
      redirects,
      interfaces
    );

    const { resolvedUris } = await resolveUriWithUriResolvers(
      finalRedirectedUri,
      uriResolverImplementations,
      client,
      noValidate
    );

    resolvedUris.forEach((v: string) =>
      path.push({
        uri: new Uri(v),
        fromRedirect: false,
        isPlugin: false,
      })
    );
    return path;
  }
);

const resolveUriWithUriResolvers = async (
  uri: Uri,
  uriResolverImplementationUris: Uri[],
  client: Client,
  noValidate?: boolean
): Promise<{
  manifest: Web3ApiManifest;
  uriResolver: Uri;
  resolvedUris: string[];
}> => {
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

  const tryResolveUriWithUriResolver = async (
    uri: Uri,
    uriResolver: Uri
  ): Promise<UriResolver.MaybeUriOrManifest | undefined> => {
    const { data } = await UriResolver.Query.tryResolveUri(
      client,
      uriResolver,
      uri
    );

    // If nothing was returned, the URI is not supported
    if (!data || (!data.uri && !data.manifest)) {
      Tracer.addEvent("continue", uriResolver.uri);
      return undefined;
    }

    return data;
  };

  // Iterate through all uri-resolver implementations,
  // iteratively resolving the URI until we reach the Web3API manifest
  for (let i = 0; i < uriResolverImplementationUris.length; ++i) {
    const uriResolver = uriResolverImplementationUris[i];

    const result = await tryResolveUriWithUriResolver(resolvedUri, uriResolver);

    if (!result) {
      continue;
    }

    if (result.uri) {
      // Use the new URI, and reset our index
      const convertedUri = new Uri(result.uri);
      trackUriRedirect(convertedUri.uri, uriResolver.uri);

      Tracer.addEvent("uri-resolver-redirect", {
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
      const manifest = deserializeWeb3ApiManifest(result.manifest, {
        noValidate,
      });

      const resolvedUris: string[] = uriHistory.reduce<string[]>(
        (prev, curr) => {
          prev.push(curr.uri);
          return prev;
        },
        []
      );

      return { manifest, uriResolver, resolvedUris };
    }
  }

  // We've failed to resolve the URI
  throw Error(
    `No Web3API found at URI: ${resolvedUri.uri}` +
      `\nResolution Path: ${JSON.stringify(uriHistory, null, 2)}` +
      `\nResolvers Used: ${uriResolverImplementationUris}`
  );
};
