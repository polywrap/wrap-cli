import { Tracer } from "@web3api/tracing-js";
import { UriResolver } from "../../interfaces";
import { Web3ApiManifest, DeserializeManifestOptions, deserializeWeb3ApiManifest } from "../../manifest";
import { Uri, InvokeHandler, Api, Client, Contextualized } from "../../types";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriToApiResolver } from "./UriToApiResolver";

export class ApiResolver implements UriToApiResolver {
  constructor(
    public readonly resolverUri: Uri,
    private readonly createApi: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri, client: Client, options: Contextualized) => Api,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  name = "Api";

  async resolveUri(uri: Uri, client: Client, options: Contextualized): Promise<UriResolutionResult> {
    const result = await tryResolveUriWithUriResolver(
      uri, 
      this.resolverUri, 
      client.invoke.bind(client)
    );

    if (!result) {
      return {
        uri
      };
    }

    if (result.uri) {
      return {
        uri: new Uri(result.uri)
      };
    } else if (result.manifest) {
      // We've found our manifest at the current URI resolver
      // meaning the URI resolver can also be used as an API resolver
      const manifest = deserializeWeb3ApiManifest(
        result.manifest,
        this.deserializeOptions
      );

      const api = Tracer.traceFunc(
        "resolveUri: createApi",
        (uri: Uri, manifest: Web3ApiManifest, resolverUri: Uri, client: Client, options: Contextualized) =>
          this.createApi(uri, manifest, resolverUri, client, options)
      )(uri, manifest, this.resolverUri, client, options);
      
      return {
        uri,
        api
      };
    }
    
    return {
      uri
    };
  }
}

const tryResolveUriWithUriResolver = async (
  uri: Uri,
  uriResolver: Uri,
  invoke: InvokeHandler["invoke"],
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