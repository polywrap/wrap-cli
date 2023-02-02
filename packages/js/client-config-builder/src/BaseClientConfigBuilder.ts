import { BuilderConfig } from "./types/configs/BuilderConfig";
import { IClientConfigBuilder } from "./types/IClientConfigBuilder";

import { CoreClientConfig, Wrapper, IWrapPackage } from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export abstract class BaseClientConfigBuilder implements IClientConfigBuilder {
  protected _config: BuilderConfig = {
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  };

  abstract addDefaults(): IClientConfigBuilder;
  abstract build(): CoreClientConfig;

  get config(): BuilderConfig {
    return this._config;
  }

  add(config: Partial<BuilderConfig>): IClientConfigBuilder {
    if (config.envs) {
      this._config.envs = { ...this._config.envs, ...config.envs };
    }

    if (config.redirects) {
      this._config.redirects = {
        ...this._config.redirects,
        ...config.redirects,
      };
    }

    if (config.wrappers) {
      this._config.wrappers = { ...this._config.wrappers, ...config.wrappers };
    }

    if (config.packages) {
      this._config.packages = { ...this._config.packages, ...config.packages };
    }

    if (config.interfaces) {
      for (const [interfaceUri, implementations] of Object.entries(
        config.interfaces
      )) {
        this.addInterfaceImplementations(interfaceUri, implementations);
      }
    }

    if (config.resolvers) {
      this.addResolvers(config.resolvers);
    }

    return this;
  }

  addWrapper(uri: string, wrapper: Wrapper): IClientConfigBuilder {
    this._config.wrappers[uri] = wrapper;

    return this;
  }

  addWrappers(uriWrappers: Record<string, Wrapper>): IClientConfigBuilder {
    this._config.wrappers = { ...this._config.wrappers, ...uriWrappers };

    return this;
  }

  removeWrapper(uri: string): IClientConfigBuilder {
    delete this._config.wrappers[uri];

    return this;
  }

  addPackage(uri: string, wrapPackage: IWrapPackage): IClientConfigBuilder {
    this._config.packages[uri] = wrapPackage;

    return this;
  }

  addPackages(uriPackages: Record<string, IWrapPackage>): IClientConfigBuilder {
    this._config.packages = { ...this._config.packages, ...uriPackages };

    return this;
  }

  removePackage(uri: string): IClientConfigBuilder {
    delete this._config.packages[uri];

    return this;
  }

  addEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder {
    this._config.envs[uri] = { ...this._config.envs[uri], ...env };

    return this;
  }

  addEnvs(envs: Record<string, Record<string, unknown>>): IClientConfigBuilder {
    for (const [uri, env] of Object.entries(envs)) {
      this.addEnv(uri, env);
    }

    return this;
  }

  removeEnv(uri: string): IClientConfigBuilder {
    delete this._config.envs[uri];

    return this;
  }

  setEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder {
    this._config.envs[uri] = env;

    return this;
  }

  addInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): IClientConfigBuilder {
    const existingInterface = this._config.interfaces[interfaceUri];

    if (existingInterface) {
      existingInterface.add(implementationUri);
    } else {
      this._config.interfaces[interfaceUri] = new Set([implementationUri]);
    }

    return this;
  }

  addInterfaceImplementations(
    interfaceUri: string,
    implementationUris: Array<string> | Set<string>
  ): IClientConfigBuilder {
    const existingInterface = this._config.interfaces[interfaceUri];

    if (existingInterface) {
      for (const implementationUri of implementationUris) {
        existingInterface.add(implementationUri);
      }
    } else {
      this._config.interfaces[interfaceUri] = new Set(implementationUris);
    }

    return this;
  }

  removeInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): IClientConfigBuilder {
    const existingInterface = this._config.interfaces[interfaceUri];

    if (!existingInterface) return this;

    existingInterface.delete(implementationUri);

    return this;
  }

  addRedirect(from: string, to: string): IClientConfigBuilder {
    this._config.redirects[from] = to;

    return this;
  }

  addRedirects(redirects: Record<string, string>): IClientConfigBuilder {
    this._config.redirects = { ...this._config.redirects, ...redirects };

    return this;
  }

  removeRedirect(from: string): IClientConfigBuilder {
    delete this._config.redirects[from];

    return this;
  }

  addResolver(resolver: UriResolverLike): IClientConfigBuilder {
    this._config.resolvers.push(resolver);

    return this;
  }

  addResolvers(resolvers: UriResolverLike[]): IClientConfigBuilder {
    for (const resolver of resolvers) {
      this.addResolver(resolver);
    }

    return this;
  }
}
