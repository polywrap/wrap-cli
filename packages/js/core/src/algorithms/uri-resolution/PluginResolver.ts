import {
  Api,
  Uri,
  PluginPackage,
  PluginRegistration,
} from "../../types";
import { findPluginPackage } from "../find-plugin-package";
import { Tracer } from "@web3api/tracing-js";
import { MaybeUriOrApi } from "./MaybeUriOrApi";
import { UriToApiResolver } from "./UriToApiResolver";

export class PluginResolver implements UriToApiResolver {
  constructor(
    private readonly plugins: readonly PluginRegistration<Uri>[],
    private readonly createPluginApi: (uri: Uri, plugin: PluginPackage) => Api,
  ) { }

  name = "PluginResolver";

  async resolveUri(uri: Uri): Promise<MaybeUriOrApi> {
    const plugin = findPluginPackage(uri, this.plugins);

    if (plugin) {
      const api = Tracer.traceFunc(
        "resolveUri: createPluginApi",
        (uri: Uri, plugin: PluginPackage) => this.createPluginApi(uri, plugin)
      )(uri, plugin);

      return {
        api
      };
    }

    return Promise.resolve({} as MaybeUriOrApi);
  };
}