import { ResolverWithHistory } from "../helpers";

import {
  Uri,
  PluginRegistration,
  toUri,
  PluginWrapPackage,
  UriResolutionResult,
  UriPackageOrWrapper,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";

export class PluginResolver extends ResolverWithHistory {
  pluginUri: Uri;

  constructor(
    private readonly pluginRegistration: PluginRegistration<string | Uri>
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

    const wrapPackage = new PluginWrapPackage(
      uri,
      this.pluginRegistration.plugin
    );

    return UriResolutionResult.ok(uri, wrapPackage);
  }
}
