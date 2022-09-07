import {
  Wrapper,
  Client,
  Env,
  PluginPackage,
  Uri,
  PluginRegistration,
  IWrapPackage,
  toUri,
  getEnvFromUriHistory,
  UriResolutionResult,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js/build/formats/wrap.info/0.1";
import { ResolverWithHistory } from "../base";

export class PluginResolver extends ResolverWithHistory {
  pluginUri: Uri;

  constructor(
    private readonly pluginRegistration: PluginRegistration<string | Uri>,
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {
    super();
    this.pluginUri = toUri(pluginRegistration.uri);
  }

  protected getStepDescription = (): string => `Plugin (${this.pluginUri.uri})`;

  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> {
    if (uri.uri !== this.pluginUri.uri) {
      return UriResolutionResult.ok(uri);
    }

    const wrapPackage = new PluginWrapperPackage(
      uri,
      this.pluginRegistration.plugin,
      this.createPluginWrapper
    );

    return UriResolutionResult.ok(wrapPackage);
  }
}

// TODO: this is a temporary solution until we refactor the plugin package to be an IWrapPackage
export class PluginWrapperPackage implements IWrapPackage {
  constructor(
    public readonly uri: Uri,
    private readonly pluginPackage: PluginPackage<unknown>,
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {}

  async getManifest(): Promise<WrapManifest> {
    return this.pluginPackage.manifest;
  }

  async createWrapper(client: Client, uriHistory: Uri[]): Promise<Wrapper> {
    const env = getEnvFromUriHistory(uriHistory, client);

    return this.createPluginWrapper(this.uri, this.pluginPackage, env);
  }
}
