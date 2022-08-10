import { getEnvFromUriOrResolutionPath } from "./getEnvFromUriOrResolutionPath";
import {
  Wrapper,
  WrapperCache,
  Client,
  Env,
  PluginPackage,
  Uri,
  PluginRegistration,
  Result,
} from "../..";
import { IUriResolutionStep, IUriResolver, UriResolutionResult } from "../core";
import { toUri } from "../../utils";
import { Ok } from "../../types";

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
    return PluginResolver.name;
  }

  async tryResolveToWrapper(
    uri: Uri,
    client: Client,
    cache: WrapperCache,
    resolutionPath: IUriResolutionStep[]
  ): Promise<Result<UriResolutionResult>> {
    if (uri.uri !== this.pluginUri.uri) {
      return this.notFound(uri);
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

    return Ok(new UriResolutionResult(wrapper));
  }

  notFound(uri: Uri): Result<UriResolutionResult> {
    return Ok(new UriResolutionResult(uri));
  }
}
