import { Api, Client, Uri, PluginPackage } from "../types";
import { Web3ApiManifest, deserializeWeb3ApiManifest } from "../manifest";
import * as ApiResolver from "../apis/api-resolver";
import { getImplementations } from "./get-implementations";

import { Tracer } from "@web3api/tracing-js";

export const resolveUri = Tracer.traceFunc(
  "core: resolveUri",
  async (
    uri: Uri,
    client: Client,
    createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
    createApi: (uri: Uri, manifest: Web3ApiManifest, apiResolver: Uri) => Api,
    noValidate?: boolean
  ): Promise<Api> => {
    let resolvedUri = uri;

    // Keep track of past URIs to avoid infinite loops
    let uriHistory: { uri: string; source: string }[] = [
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

    const resetUriHistory = () => {
      uriHistory = [
        {
          uri: resolvedUri.uri,
          source: "ROOT",
        },
      ];
    };

    const redirects = client.redirects();

    // Iterate through all redirects. If anything matches
    // apply the redirect, and restart the process over again.
    // If the redirect `to` is a Plugin, return a PluginWeb3Api instance.
    for (let i = 0; i < redirects.length; ++i) {
      const redirect = redirects[i];
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

      // If we've redirected to another URI
      if (Uri.isUri(uriOrPlugin)) {
        if (uriOrPlugin.uri !== resolvedUri.uri) {
          trackUriRedirect(uriOrPlugin.uri, redirect.from.uri);

          Tracer.addEvent("client-redirect", {
            from: redirect.from.uri,
            to: redirect.to,
          });

          // Restart the iteration over again
          i = -1;
          resolvedUri = uriOrPlugin;
        }
      } else {
        // We've found a plugin, return an instance of it
        return Tracer.traceFunc(
          "resolveUri: createPluginApi",
          (uri: Uri, plugin: PluginPackage) => createPluginApi(uri, plugin)
        )(resolvedUri, uriOrPlugin);
      }
    }

    // The final URI has been resolved, let's now resolve the Web3API package
    const uriResolverImplementations = getImplementations(
      new Uri("w3/api-resolver"),
      redirects
    );

    // Clear the history of URI redirects, so we can now
    // track api-resolver driven redirects
    resetUriHistory();

    // Iterate through all api-resolver implementations,
    // iteratively resolving the URI until we reach the Web3API manifest
    for (let i = 0; i < uriResolverImplementations.length; ++i) {
      const uriResolver = uriResolverImplementations[i];

      const { data } = await ApiResolver.Query.tryResolveUri(
        client,
        uriResolver,
        resolvedUri
      );

      // If nothing was returned, the URI is not supported
      if (!data || (!data.uri && !data.manifest)) {
        Tracer.addEvent("continue", uriResolver.uri);
        continue;
      }

      const newUri = data.uri;
      const manifestStr = data.manifest;

      if (newUri) {
        // Use the new URI, and reset our index
        const convertedUri = new Uri(newUri);
        trackUriRedirect(convertedUri.uri, uriResolver.uri);

        Tracer.addEvent("api-resolver-redirect", {
          from: resolvedUri.uri,
          to: convertedUri.uri,
        });

        // Restart the iteration over again
        i = -1;
        resolvedUri = convertedUri;
        continue;
      } else if (manifestStr) {
        // We've found our manifest at the current URI resolver
        // meaning the URI resolver can also be used as an API resolver
        const manifest = deserializeWeb3ApiManifest(manifestStr, {
          noValidate,
        });

        return Tracer.traceFunc(
          "resolveUri: createApi",
          (uri: Uri, manifest: Web3ApiManifest, apiResolver: Uri) =>
            createApi(uri, manifest, apiResolver)
        )(resolvedUri, manifest, uriResolver);
      }
    }

    // We've failed to resolve the URI
    throw Error(
      `No Web3API found at URI: ${uri.uri}` +
        `\nResolution Path: ${JSON.stringify(uriHistory, null, 2)}` +
        `\nResolvers Used: ${uriResolverImplementations}`
    );
  }
);
