import { getDefaultClientConfig } from "./bundles";
import {
  sanitizeEnvs,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  sanitizeUriRedirects,
} from "./utils/sanitize";

import {
  ClientConfig,
  Uri,
  PluginPackage,
  PluginRegistration,
  InterfaceImplementations,
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
