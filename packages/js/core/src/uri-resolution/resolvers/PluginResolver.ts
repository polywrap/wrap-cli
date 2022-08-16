import { getEnvFromUriOrResolutionPath } from "./getEnvFromUriOrResolutionPath";
import {
  Wrapper,
  WrapperCache,
  Client,
  Env,
  PluginPackage,
  Uri,
  PluginRegistration,
} from "../..";
import {
  IUriResolutionStep,
  IUriResolver,
  IUriResolutionResult,
} from "../core";
import { toUri } from "../../utils";
import { UriResolutionResult } from "../core";

export class PluginResolver implements IUriResolver {
  pluginUri: Uri;

  constructor(
    private readonly pluginRegistration: PluginRegistration<string | Uri>,
    private readonly createPluginWrapper: (
      uri: Uri,
      plugin: PluginPackage<unknown>,
      environment: Env<Uri> | undefined
    ) => Wrapper
  ) {
    this.pluginUri = toUri(pluginRegistration.uri);
  }

  public get name(): string {
    return `${PluginResolver.name} (${this.pluginUri.uri})`;
  }

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep<unknown>[]
  ): Promise<IUriResolutionResult> {
    if (uri.uri !== this.pluginUri.uri) {
      return UriResolutionResult.ok(uri);
    }

    const environment = getEnvFromUriOrResolutionPath(
      uri,
      resolutionPath,
      client
    );

    const wrapper = this.createPluginWrapper(
      uri,
      this.pluginRegistration.plugin,
      environment
    );

    return UriResolutionResult.ok(wrapper);
  }
}
