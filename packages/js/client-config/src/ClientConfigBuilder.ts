import { getDefaultClientConfig } from "./bundles";
import { toUri } from "./utils/toUri";

import {
  ClientConfig,
  Uri,
  PluginPackage,
  PluginRegistration,
  InterfaceImplementations,
  UriResolver,
} from "@polywrap/core-js";

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

    if (config.uriResolvers) {
      for (const resolver of config.uriResolvers) {
        this.addUriResolver(resolver);
      }
    }

    return this;
  }

  addDefaults(): ClientConfigBuilder {
    return this.add(getDefaultClientConfig());
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

  addUriResolver(resolver: UriResolver): ClientConfigBuilder {
    this._config.uriResolvers.push(resolver);

    return this;
  }

  setUriResolvers(resolvers: UriResolver[]): ClientConfigBuilder {
    this._config.uriResolvers = resolvers;

    return this;
  }

  build(): ClientConfig<Uri> {
    this._sanitizePlugins();
    this._sanitizeInterfacesAndImplementations();

    return this._config;
  }

  private _sanitizePlugins(): void {
    const plugins = this._config.plugins;
    // Plugin map used to keep track of plugins with same URI
    const addedPluginsMap = new Map<string, PluginPackage<unknown>>();

    for (const plugin of plugins) {
      const pluginUri = plugin.uri.uri;

      if (!addedPluginsMap.has(pluginUri)) {
        // If the plugin is not added yet then add it
        addedPluginsMap.set(pluginUri, plugin.plugin);
      }
      // If the plugin with the same URI is already added, then ignore it
      // This means that if the developer defines a plugin with the same URI as a default plugin
      // we will ignore the default one and use the developer's plugin
    }

    // Collection of unique plugins
    const sanitizedPlugins: PluginRegistration<Uri>[] = [];

    // Go through the unique map of plugins and add them to the sanitized plugins
    for (const [uri, plugin] of addedPluginsMap) {
      sanitizedPlugins.push({
        uri: new Uri(uri),
        plugin: plugin,
      });
    }

    this._config.plugins = sanitizedPlugins;
  }

  private _sanitizeInterfacesAndImplementations(): void {
    const interfaces = this._config.interfaces;
    // Interface hash map used to keep track of interfaces with same URI
    // A set is used to keep track of unique implementation URIs
    const addedInterfacesHashMap = new Map<string, Set<string>>();

    for (const interfaceImplementations of interfaces) {
      const interfaceUri = interfaceImplementations.interface.uri;

      if (!addedInterfacesHashMap.has(interfaceUri)) {
        // If the interface is not added yet then just add it along with its implementations
        addedInterfacesHashMap.set(
          interfaceUri,
          new Set(interfaceImplementations.implementations.map((x) => x.uri))
        );
      } else {
        const existingInterfaceImplementations = addedInterfacesHashMap.get(
          interfaceUri
        ) as Set<string>;

        // Get implementations to add to existing set of implementations
        const newImplementationUris = interfaceImplementations.implementations.map(
          (x) => x.uri
        );

        // Add new implementations to existing set
        newImplementationUris.forEach(
          existingInterfaceImplementations.add,
          existingInterfaceImplementations
        );
      }
    }

    // Collection of unique interfaces with implementations merged
    const sanitizedInterfaces: InterfaceImplementations<Uri>[] = [];

    // Go through the unique hash map of interfaces and implementations and add them to the sanitized interfaces
    for (const [
      interfaceUri,
      implementationSet,
    ] of addedInterfacesHashMap.entries()) {
      sanitizedInterfaces.push({
        interface: new Uri(interfaceUri),
        implementations: [...implementationSet].map((x) => new Uri(x)),
      });
    }

    this._config.interfaces = sanitizedInterfaces;
  }
}
