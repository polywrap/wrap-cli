import {
  ClientConfig,
  Uri,
  sanitizeEnvs,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  sanitizeUriRedirects,
} from "@polywrap/core-js";
import { getDefaultClientConfig } from "./bundles/default-client-config";

export class ClientConfigBuilder {
  private _config: ClientConfig<Uri>;

  constructor() {
    this._config = {
      envs: [],
      interfaces: [],
      plugins: [],
      redirects: [],
      uriResolvers: [],
    };
  }

  add(config: Partial<ClientConfig>): ClientConfigBuilder {
    if (config.envs) {
      this._config.envs = [...this._config.envs, ...sanitizeEnvs(config.envs)];
    }

    if (config.interfaces) {
      this._config.interfaces = [
        ...this._config.interfaces,
        ...sanitizeInterfaceImplementations(config.interfaces),
      ];
    }

    if (config.plugins) {
      this._config.plugins = [
        ...this._config.plugins,
        ...sanitizePluginRegistrations(config.plugins),
      ];
    }

    if (config.redirects) {
      this._config.redirects = [
        ...this._config.redirects,
        ...sanitizeUriRedirects(config.redirects),
      ];
    }

    if (config.uriResolvers) {
      this._config.uriResolvers = [
        ...this._config.uriResolvers,
        ...config.uriResolvers,
      ];
    }

    return this;
  }

  addDefaults(): ClientConfigBuilder {
    return this.add(getDefaultClientConfig());
  }

  build(): ClientConfig<Uri> {
    return this._config;
  }
}
