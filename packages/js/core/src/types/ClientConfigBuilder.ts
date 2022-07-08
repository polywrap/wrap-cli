import { ClientConfig } from "./Client";
import { Uri } from "./";

export class ClientConfigBuilder<TUri extends Uri | string = string> {
  private _config: ClientConfig<TUri>;

  constructor() {
    this._config = {
      envs: [],
      interfaces: [],
      plugins: [],
      redirects: [],
      uriResolvers: [],
    };
  }

  add(config: Partial<ClientConfig<TUri>>): ClientConfigBuilder<TUri> {
    if (config.envs) {
      this._config.envs = [...this._config.envs, ...config.envs];
    }

    if (config.interfaces) {
      this._config.interfaces = [
        ...this._config.interfaces,
        ...config.interfaces,
      ];
    }

    if (config.plugins) {
      this._config.plugins = [...this._config.plugins, ...config.plugins];
    }

    if (config.redirects) {
      this._config.redirects = [...this._config.redirects, ...config.redirects];
    }

    if (config.uriResolvers) {
      this._config.uriResolvers = [
        ...this._config.uriResolvers,
        ...config.uriResolvers,
      ];
    }

    return this;
  }

  build(): ClientConfig<TUri> {
    return this._config;
  }
}
