import { Tracer } from "@web3api/tracing-js";
import { Web3ApiManifest, DeserializeManifestOptions, deserializeWeb3ApiManifest } from "../../manifest";
import { UriRedirect, Uri, InvokeHandler, Api, InterfaceImplementations } from "../../types";
import { MaybeUriOrApi } from "./MaybeUriOrApi";
import { UriToApiResolver } from "./UriToApiResolver";
import { coreInterfaceUris, UriResolver } from "../../interfaces";
import { getImplementations } from "../get-implementations";

export class UriResolverImplementationsResolver implements UriToApiResolver {
  constructor(
    private readonly redirects: readonly UriRedirect<Uri>[],
    private readonly interfaces: readonly InterfaceImplementations<Uri>[],
    private readonly invoke: InvokeHandler["invoke"],
    private readonly createApi: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => Api,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  name = "UriResolverImplementationsResolver";

  async resolveUri(uri: Uri): Promise<MaybeUriOrApi> {
    const uriResolverImplementations = getImplementations(
      coreInterfaceUris.uriResolver,
      this.interfaces,
      this.redirects
    );
  
    const uriOrApi = await resolveUriWithUriResolvers(
      uri,
      uriResolverImplementations,
      this.invoke,
      this.createApi,
      this.deserializeOptions
    );
  
    return uriOrApi;
  }
}

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
