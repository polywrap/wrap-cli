import { Api, Uri, PluginPackage, Client } from "../../../types";
import { findPluginPackage } from "../../../algorithms/find-plugin-package";
import { IUriToApiResolver, UriResolutionResult } from "../../core";

import { Tracer } from "@web3api/tracing-js";

export class PluginResolver implements IUriToApiResolver {
  constructor(
    private readonly createPluginApi: (uri: Uri, plugin: PluginPackage) => Api
  ) {}

  name = "Plugin";

  async resolveUri(uri: Uri, client: Client): Promise<UriResolutionResult> {
    const plugin = findPluginPackage(uri, client.getPlugins({}));

    if (plugin) {
      const api = Tracer.traceFunc(
        "resolveUri: createPluginApi",
        (uri: Uri, plugin: PluginPackage) => this.createPluginApi(uri, plugin)
      )(uri, plugin);

      return {
        uri,
        api,
      };
    }

    return Promise.resolve({
      uri,
    });
  }
}
