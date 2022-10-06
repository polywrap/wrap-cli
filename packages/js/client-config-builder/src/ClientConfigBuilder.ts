import { getDefaultClientConfig } from "./bundles";

import {
  ClientConfig,
  Uri,
  PluginPackage,
  IUriResolver,
  Env,
  InterfaceImplementations,
  PluginRegistration,
  UriRedirect,
  UriMap,
} from "@polywrap/core-js";
import { IWrapperCache } from "@polywrap/uri-resolvers-js";

export class ClientConfigBuilder {
  private _config: {
    redirects: UriMap<UriRedirect<Uri>>;
    plugins: UriMap<PluginRegistration<Uri>>;
    interfaces: UriMap<InterfaceImplementations<Uri>>;
    envs: UriMap<Env<Uri>>;
    resolver?: IUriResolver<unknown>;
  } = {
    redirects: new UriMap(),
    plugins: new UriMap(),
    interfaces: new UriMap(),
    envs: new UriMap(),
  };

  add(config: Partial<ClientConfig<Uri | string>>): ClientConfigBuilder {
    if (config.envs) {
      for (const env of config.envs) {
        this.addEnv(env.uri, env.env);
      }
    }

    if (config.interfaces) {
      for (const interfaceImpl of config.interfaces) {
        this.addInterfaceImplementations(
          interfaceImpl.interface,
          interfaceImpl.implementations
        );
      }
    }

    if (config.plugins) {
      for (const plugin of config.plugins) {
        this.addPlugin(plugin.uri, plugin.plugin);
      }
    }

    if (config.redirects) {
      for (const redirect of config.redirects) {
        this.addUriRedirect(redirect.from, redirect.to);
      }
    }

    if (config.resolver) {
      this.setResolver(config.resolver);
    }

    return this;
  }

  addDefaults(wrapperCache?: IWrapperCache): ClientConfigBuilder {
    return this.add(getDefaultClientConfig(wrapperCache));
  }

  addPlugin<TPluginConfig>(
    uri: Uri | string,
    plugin: PluginPackage<TPluginConfig>
  ): ClientConfigBuilder {
    const pluginUri = Uri.from(uri);

    const existingRegistration = this._config.plugins.get(pluginUri);

    if (existingRegistration) {
      existingRegistration.plugin = plugin;
    } else {
      this._config.plugins.set(pluginUri, {
        uri: pluginUri,
        plugin: plugin,
      });
    }

    return this;
  }

  removePlugin(uri: Uri | string): ClientConfigBuilder {
    const pluginUri = Uri.from(uri);

    this._config.plugins.delete(pluginUri);

    return this;
  }

  addEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = Uri.from(uri);

    const existingEnv = this._config.envs.get(envUri);

    if (existingEnv) {
      existingEnv.env = {
        ...existingEnv.env,
        ...env,
      };
    } else {
      this._config.envs.set(envUri, {
        env: env,
        uri: envUri,
      });
    }

    return this;
  }

  removeEnv(uri: Uri | string): ClientConfigBuilder {
    const envUri = Uri.from(uri);

    this._config.envs.delete(envUri);

    return this;
  }

  setEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = Uri.from(uri);

    this._config.envs.set(envUri, {
      uri: envUri,
      env: env,
    });

    return this;
  }

  addInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): ClientConfigBuilder {
    const interfaceUriSanitized = Uri.from(interfaceUri);
    const implementationUriSanitized = Uri.from(implementationUri);

    const existingInterface = this._config.interfaces.get(
      interfaceUriSanitized
    );

    if (existingInterface) {
      if (
        !existingInterface.implementations.some((x) =>
          Uri.equals(x, implementationUriSanitized)
        )
      ) {
        existingInterface.implementations.push(implementationUriSanitized);
      }
    } else {
      this._config.interfaces.set(interfaceUriSanitized, {
        interface: interfaceUriSanitized,
        implementations: [implementationUriSanitized],
      });
    }

    return this;
  }

  addInterfaceImplementations(
    interfaceUri: Uri | string,
    implementationUris: Array<Uri | string>
  ): ClientConfigBuilder {
    const interfaceUriSanitized = Uri.from(interfaceUri);
    const implementationUrisSanitized = implementationUris.map(Uri.from);

    const existingInterface = this._config.interfaces.get(
      interfaceUriSanitized
    );

    if (existingInterface) {
      for (const implUri of implementationUrisSanitized) {
        if (
          !existingInterface.implementations.some((x) => Uri.equals(x, implUri))
        ) {
          existingInterface.implementations.push(implUri);
        }
      }
    } else {
      this._config.interfaces.set(interfaceUriSanitized, {
        interface: interfaceUriSanitized,
        implementations: implementationUrisSanitized,
      });
    }

    return this;
  }

  removeInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): ClientConfigBuilder {
    const interfaceUriSanitized = Uri.from(interfaceUri);
    const implementationUriSanitized = Uri.from(implementationUri);

    const existingInterface = this._config.interfaces.get(
      interfaceUriSanitized
    );

    if (existingInterface) {
      const idx = existingInterface.implementations.findIndex((x) =>
        Uri.equals(x, implementationUriSanitized)
      );

      if (idx > -1) {
        existingInterface.implementations.splice(idx, 1);
      }

      if (existingInterface.implementations.length === 0) {
        this._config.interfaces.delete(interfaceUriSanitized);
      }
    }

    return this;
  }

  addUriRedirect(from: Uri | string, to: Uri | string): ClientConfigBuilder {
    const fromSanitized = Uri.from(from);
    const toSanitized = Uri.from(to);

    const existingRedirect = this._config.redirects.get(fromSanitized);

    if (existingRedirect) {
      existingRedirect.to = toSanitized;
    } else {
      this._config.redirects.set(fromSanitized, {
        from: fromSanitized,
        to: toSanitized,
      });
    }

    return this;
  }

  removeUriRedirect(from: Uri | string): ClientConfigBuilder {
    const fromSanitized = Uri.from(from);

    this._config.redirects.delete(fromSanitized);

    return this;
  }

  setResolver(resolver: IUriResolver<unknown>): ClientConfigBuilder {
    this._config.resolver = resolver;

    return this;
  }

  build(): ClientConfig<Uri> {
    if (!this._config.resolver) {
      throw new Error("No URI resolver provided");
    }

    return {
      ...this._config,
      redirects: [...this._config.redirects.values()],
      plugins: [...this._config.plugins.values()],
      interfaces: [...this._config.interfaces.values()],
      envs: [...this._config.envs.values()],
    } as ClientConfig<Uri>;
  }

  buildPartial(): Partial<ClientConfig<Uri>> {
    return {
      ...this._config,
      redirects: [...this._config.redirects.values()],
      plugins: [...this._config.plugins.values()],
      interfaces: [...this._config.interfaces.values()],
      envs: [...this._config.envs.values()],
    };
  }
}
