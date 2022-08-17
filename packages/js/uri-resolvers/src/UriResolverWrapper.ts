import {
  IUriResolver,
  Uri,
  Client,
  IUriResolutionResponse,
  UriResolutionResponse,
  Result,
  UriResolverInterface,
  IUriResolutionStep,
  Err,
  IWrapPackage,
  Wrapper,
  initWrapper,
  Ok,
} from "@polywrap/core-js";
import {
  DeserializeManifestOptions,
  deserializeWrapManifest,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { CreateWrapperFunc } from "./extendable";

export class UriResolverWrapper implements IUriResolver<unknown> {
  constructor(
    public readonly implementationUri: Uri,
    private readonly createWrapper: CreateWrapperFunc,
    private readonly deserializeOptions?: DeserializeManifestOptions
  ) {}

  public get name(): string {
    return `${UriResolverWrapper.name}: (${this.implementationUri.uri})`;
  }

  async tryResolveToWrapper(
    uri: Uri,
    client: Client
  ): Promise<IUriResolutionResponse<unknown>> {
    const { result, history } = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client
    );

    if (!result.ok) {
      return UriResolutionResponse.err(result.error, history);
    }

    const uriOrManifest = result.value;

    if (uriOrManifest?.uri) {
      return UriResolutionResponse.ok(new Uri(uriOrManifest.uri), history);
    } else if (uriOrManifest?.manifest) {
      // We've found our manifest at the current implementation,
      // meaning the URI resolver can also be used as an Wrapper resolver
      const manifest = await deserializeWrapManifest(
        uriOrManifest.manifest,
        this.deserializeOptions
      );

      const wrapPackage = new WasmPackage(
        uri,
        manifest,
        this.implementationUri.uri,
        this.createWrapper
      );

      return UriResolutionResponse.ok(wrapPackage, history);
    }

    return UriResolutionResponse.ok(uri, history);
  }
}

const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: Client
): Promise<{
  result: Result<UriResolverInterface.MaybeUriOrManifest | undefined, unknown>;
  history?: IUriResolutionStep<unknown>[];
}> => {
  const response = await client.tryResolveToWrapper(implementationUri);

  if (!response.result.ok) {
    return {
      result: Err(response.result.error),
      history: response.history,
    };
  }

  const uriPackageOrWrapper = response.result.value;

  if (uriPackageOrWrapper.type === "uri") {
    const lastFoundUri = uriPackageOrWrapper.uri as Uri;

    return {
      result: Err(
        `While resolving ${uri.uri} with URI resolver extension ${implementationUri.uri}, the extension could not be fully resolved. Last found URI is ${lastFoundUri.uri}`
      ),
      history: response.history,
    };
  }

  let wrapperOrPackage: IWrapPackage | Wrapper;

  if (uriPackageOrWrapper.type === "package") {
    wrapperOrPackage = uriPackageOrWrapper.package;
  } else {
    wrapperOrPackage = uriPackageOrWrapper.wrapper;
  }

  const wrapper = await initWrapper(wrapperOrPackage, client);

  const invokeResult = await client.invokeWrapper<UriResolverInterface.MaybeUriOrManifest>(
    {
      wrapper,
      uri: implementationUri.uri,
      method: "tryResolveUri",
      args: {
        authority: uri.authority,
        path: uri.path,
      },
    }
  );

  const { data, error } = invokeResult;

  const uriOrManifest = data as UriResolverInterface.MaybeUriOrManifest;

  if (error) {
    return {
      result: Err(error),
      history: [],
    };
  }

  return {
    result: Ok(uriOrManifest ?? undefined),
    history: [],
  };
};

// TODO: this is a temporary solution until we implement the WasmPackage
export class WasmPackage implements IWrapPackage {
  constructor(
    public readonly uri: Uri,
    private readonly manifest: WrapManifest,
    private readonly resolver: string,
    private readonly createWrapperFunc: CreateWrapperFunc
  ) {}

  async createWrapper(client: Client): Promise<Wrapper> {
    const env = client.getEnvByUri(this.uri, {});

    return this.createWrapperFunc(this.uri, this.manifest, this.resolver, env);
  }
}
