import {
  Api,
  Uri,
  PluginPackage,
  InvokeHandler,
  InterfaceImplementations,
  PluginRegistration,
  UriRedirect,
} from "../types";
import {
  Web3ApiManifest,
  deserializeWeb3ApiManifest,
  DeserializeManifestOptions,
} from "../manifest";
import { applyRedirects } from "./apply-redirects";
import { findPluginPackage } from "./find-plugin-package";
import { getImplementations } from "./get-implementations";
import { coreInterfaceUris, UriResolver } from "../interfaces";

import { Tracer } from "@web3api/tracing-js";

export const resolveUri = Tracer.traceFunc(
  "core: resolveUri",
  async (
    uri: Uri,
    redirects: readonly UriRedirect<Uri>[],
    plugins: readonly PluginRegistration<Uri>[],
    interfaces: readonly InterfaceImplementations<Uri>[],
    invoke: InvokeHandler["invoke"],
    createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
    createApi: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => Api,
    deserializeOptions?: DeserializeManifestOptions
  ): Promise<Api> => {
    const finalRedirectedUri = applyRedirects(uri, redirects);
    const plugin = findPluginPackage(finalRedirectedUri, plugins);

    if (plugin) {
      return Tracer.traceFunc(
        "resolveUri: createPluginApi",
        (uri: Uri, plugin: PluginPackage) => createPluginApi(uri, plugin)
      )(finalRedirectedUri, plugin);
    }

    // The final URI has been resolved, let's now resolve the Web3API package
    const uriResolverImplementations = getImplementations(
      coreInterfaceUris.uriResolver,
      interfaces,
      redirects
    );

    return await resolveUriWithUriResolvers(
      finalRedirectedUri,
      uriResolverImplementations,
      invoke,
      createApi,
      deserializeOptions
    );
  }
);

const resolveUriWithUriResolvers = async (
  uri: Uri,
  uriResolverImplementationUris: Uri[],
  invoke: InvokeHandler["invoke"],
  createApi: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => Api,
  deserializeOptions?: DeserializeManifestOptions
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

  const tryResolveUriWithUriResolver = async (
    uri: Uri,
    uriResolver: Uri
  ): Promise<UriResolver.MaybeUriOrManifest | undefined> => {
    const { data } = await UriResolver.Query.tryResolveUri(
      invoke,
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
      const manifest = deserializeWeb3ApiManifest(
        result.manifest,
        deserializeOptions
      );

      return Tracer.traceFunc(
        "resolveUri: createApi",
        (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) =>
          createApi(uri, manifest, uriResolver)
      )(resolvedUri, manifest, uriResolver);
    }
  }

  // We've failed to resolve the URI
  throw Error(
    `No Web3API found at URI: ${resolvedUri.uri}` +
      `\nResolution Path: ${JSON.stringify(uriHistory, null, 2)}` +
      `\nResolvers Used: ${uriResolverImplementationUris}`
  );
};
