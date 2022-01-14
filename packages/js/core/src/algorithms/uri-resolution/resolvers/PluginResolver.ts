import {
  Api,
  Uri,
  PluginPackage,
  Client,
} from "../../../types";
import { findPluginPackage } from "../../find-plugin-package";
import { Tracer } from "@web3api/tracing-js";
import { UriToApiResolver } from "./UriToApiResolver";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriResolutionStack } from "..";

export class PluginResolver implements UriToApiResolver {
  constructor(
    private readonly createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
  ) { }

  name = "Plugin";

  async resolveUri(uri: Uri, client: Client, resolutionStack: UriResolutionStack): Promise<UriResolutionResult> {
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
  };
}