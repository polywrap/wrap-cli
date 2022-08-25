import { getDefaultClientConfig } from "./bundles";
import { toUri } from "./utils/toUri";

import {
  ClientConfig,
  Uri,
  PluginPackage,
  IUriResolver,
  Env,
  InterfaceImplementations,
  PluginRegistration,
  UriRedirect,
} from "@polywrap/core-js";
import { IWrapperCache } from "@polywrap/uri-resolvers-js";

export class ClientConfigBuilder {
  private _config: {
    redirects: UriRedirect<Uri>[];
    plugins: PluginRegistration<Uri>[];
    interfaces: InterfaceImplementations<Uri>[];
    envs: Env<Uri>[];
    resolver?: IUriResolver<unknown>;
  } = {
    redirects: [],
    plugins: [],
    interfaces: [],
    envs: [],
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
    const pluginUri = toUri(uri);

    const existingRegistration = this._config.plugins.find((x) =>
      Uri.equals(x.uri, pluginUri)
    );

    if (existingRegistration) {
      existingRegistration.plugin = plugin;
    } else {
      this._config.plugins.push({
        uri: pluginUri,
        plugin: plugin,
      });
    }

    return this;
  }

  removePlugin(uri: Uri | string): ClientConfigBuilder {
    const pluginUri = toUri(uri);

    const idx = this._config.plugins.findIndex((x) =>
      Uri.equals(x.uri, pluginUri)
    );

    if (idx > -1) {
      this._config.plugins.splice(idx, 1);
    }

    return this;
  }

  addEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = toUri(uri);

    const idx = this._config.envs.findIndex((x) => Uri.equals(x.uri, envUri));

    if (idx > -1) {
      this._config.envs[idx].env = {
        ...this._config.envs[idx].env,
        ...env,
      };
    } else {
      this._config.envs.push({
        uri: envUri,
        env: env,
      });
    }

    return this;
  }

  removeEnv(uri: Uri | string): ClientConfigBuilder {
    const envUri = toUri(uri);

    const idx = this._config.envs.findIndex((x) => Uri.equals(x.uri, envUri));

    if (idx > -1) {
      this._config.envs.splice(idx, 1);
    }

    return this;
  }

  setEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = toUri(uri);

    const idx = this._config.envs.findIndex((x) => Uri.equals(x.uri, envUri));

    if (idx > -1) {
      this._config.envs[idx].env = env;
    } else {
      this._config.envs.push({
        uri: envUri,
        env: env,
      });
    }

    return this;
  }

  addInterfaceImplementation(
    interfaceUri: Uri | string,
    implementationUri: Uri | string
  ): ClientConfigBuilder {
    const interfaceUriSanitized = toUri(interfaceUri);
    const implementationUriSanitized = toUri(implementationUri);

    const existingInterface = this._config.interfaces.find((x) =>
      Uri.equals(x.interface, interfaceUriSanitized)
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
      this._config.interfaces.push({
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
    const interfaceUriSanitized = toUri(interfaceUri);
    const implementationUrisSanitized = implementationUris.map(toUri);

    const existingInterface = this._config.interfaces.find((x) =>
      Uri.equals(x.interface, interfaceUriSanitized)
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
      this._config.interfaces.push({
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
    const interfaceUriSanitized = toUri(interfaceUri);
    const implementationUriSanitized = toUri(implementationUri);

    const existingInterface = this._config.interfaces.find((x) =>
      Uri.equals(x.interface, interfaceUriSanitized)
    );

    if (existingInterface) {
      const idx = existingInterface.implementations.findIndex((x) =>
        Uri.equals(x, implementationUriSanitized)
      );

      if (idx > -1) {
        existingInterface.implementations.splice(idx, 1);
      }

      if (existingInterface.implementations.length === 0) {
        this._config.interfaces.splice(
          this._config.interfaces.indexOf(existingInterface),
          1
        );
      }
    }

    return this;
  }

  addUriRedirect(from: Uri | string, to: Uri | string): ClientConfigBuilder {
    const fromSanitized = toUri(from);
    const toSanitized = toUri(to);

    const existingRedirect = this._config.redirects.find((x) =>
      Uri.equals(x.from, fromSanitized)
    );

    if (existingRedirect) {
      existingRedirect.to = toSanitized;
    } else {
      this._config.redirects.push({
        from: fromSanitized,
        to: toSanitized,
      });
    }

    return this;
  }

  removeUriRedirect(from: Uri | string): ClientConfigBuilder {
    const fromSanitized = toUri(from);

    const idx = this._config.redirects.findIndex((x) =>
      Uri.equals(x.from, fromSanitized)
    );

    if (idx > -1) {
      this._config.redirects.splice(idx, 1);
    }

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

    return this._config as ClientConfig<Uri>;
  }
}
