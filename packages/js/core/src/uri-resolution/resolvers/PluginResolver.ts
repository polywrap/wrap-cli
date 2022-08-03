import { getEnvFromUriOrResolutionPath } from "./getEnvFromUriOrResolutionPath";
import {
  Wrapper,
  WrapperCache,
  Client,
  Env,
  PluginPackage,
  Uri,
  PluginRegistration,
} from "../../types";
import {
  IUriResolutionResult,
  IUriResolutionStep,
  IUriResolver,
} from "../core";
import { toUri } from "../../utils";

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
  ): Promise<IUriResolutionResult> {
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

    return {
      uri,
      wrapper,
    };
  }

  notFound(uri: Uri): IUriResolutionResult {
    return {
      uri,
    };
  }
}
