import { Tracer } from "@web3api/tracing-js";
import { UriResolver } from "../../interfaces";
import { Web3ApiManifest, DeserializeManifestOptions, deserializeWeb3ApiManifest } from "../../manifest";
import { Uri, InvokeHandler, Api } from "../../types";
import { MaybeUriOrApi } from "./MaybeUriOrApi";
import { UriToApiResolver } from "./UriToApiResolver";

export class ApiResolver implements UriToApiResolver {
  constructor(
    private readonly resolverUri: Uri,
    private readonly invoke: InvokeHandler["invoke"],
    private readonly createApi: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => Api,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  name = `ApiResolver: ${this.resolverUri.uri}`;

  async resolveUri(uri: Uri): Promise<MaybeUriOrApi> {

    const result = await tryResolveUriWithUriResolver(uri, this.resolverUri, this.invoke);

    if (!result) {
      return {} as MaybeUriOrApi;
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
        (uri: Uri, manifest: Web3ApiManifest, resolverUri: Uri) =>
          this.createApi(uri, manifest, resolverUri)
      )(uri, manifest, this.resolverUri);
   
      return {
        api
      };
    }

    return {} as MaybeUriOrApi;
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