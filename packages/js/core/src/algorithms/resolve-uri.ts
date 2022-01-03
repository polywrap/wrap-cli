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

export type MaybeUriOrApi = {
  uri?: Uri;
  api?: Api;
}

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
  ): Promise<MaybeUriOrApi> => {
    const finalRedirectedUri = applyRedirects(uri, redirects);
    const plugin = findPluginPackage(finalRedirectedUri, plugins);

    if (plugin) {
      const api = Tracer.traceFunc(
        "resolveUri: createPluginApi",
        (uri: Uri, plugin: PluginPackage) => createPluginApi(uri, plugin)
      )(finalRedirectedUri, plugin);
      
      return {
        api
      };
    }

    // The final URI has been resolved, let's now resolve the Web3API package
    const uriResolverImplementations = getImplementations(
      coreInterfaceUris.uriResolver,
      interfaces,
      redirects
    );

    const uriOrApi = await resolveUriWithUriResolvers(
      finalRedirectedUri,
      uriResolverImplementations,
      invoke,
      createApi,
      deserializeOptions
    );

    return uriOrApi;
  }
);

const resolveUriWithUriResolvers = async (
  uri: Uri,
  uriResolverImplementationUris: Uri[],
  invoke: InvokeHandler["invoke"],
  createApi: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => Api,
  deserializeOptions?: DeserializeManifestOptions
): Promise<MaybeUriOrApi> => {
  let resolvedUri = uri;

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
      //Return the resolved URI
      const convertedUri = new Uri(result.uri);
    
      return {
        uri: convertedUri
      };
    } else if (result.manifest) {
      // We've found our manifest at the current URI resolver
      // meaning the URI resolver can also be used as an API resolver
      const manifest = deserializeWeb3ApiManifest(
        result.manifest,
        deserializeOptions
      );

      const api = Tracer.traceFunc(
        "resolveUri: createApi",
        (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) =>
          createApi(uri, manifest, uriResolver)
      )(resolvedUri, manifest, uriResolver);
   
      return {
        api
      };
    }
  }

  return {
    uri: resolvedUri
  };
};
