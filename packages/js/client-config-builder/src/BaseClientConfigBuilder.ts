import { BuilderConfig, IClientConfigBuilder } from "./types";

import {
  CoreClientConfig,
  Wrapper,
  IWrapPackage,
  Uri,
} from "@polywrap/core-js";
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
      this.addEnvs(config.envs);
    }

    if (config.redirects) {
      this.addRedirects(config.redirects);
    }

    if (config.wrappers) {
      this.addWrappers(config.wrappers);
    }

    if (config.packages) {
      this.addPackages(config.packages);
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
    this._config.wrappers[this.sanitizeUri(uri)] = wrapper;

    return this;
  }

  addWrappers(uriWrappers: Record<string, Wrapper>): IClientConfigBuilder {
    for (const uri in uriWrappers) {
      this.addWrapper(this.sanitizeUri(uri), uriWrappers[uri]);
    }

    return this;
  }

  removeWrapper(uri: string): IClientConfigBuilder {
    delete this._config.wrappers[this.sanitizeUri(uri)];

    return this;
  }

  addPackage(uri: string, wrapPackage: IWrapPackage): IClientConfigBuilder {
    this._config.packages[this.sanitizeUri(uri)] = wrapPackage;

    return this;
  }

  addPackages(uriPackages: Record<string, IWrapPackage>): IClientConfigBuilder {
    for (const uri in uriPackages) {
      this.addPackage(this.sanitizeUri(uri), uriPackages[uri]);
    }

    return this;
  }

  removePackage(uri: string): IClientConfigBuilder {
    delete this._config.packages[this.sanitizeUri(uri)];

    return this;
  }

  addEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder {
    this._config.envs[this.sanitizeUri(uri)] = {
      ...this._config.envs[this.sanitizeUri(uri)],
      ...env,
    };

    return this;
  }

  addEnvs(envs: Record<string, Record<string, unknown>>): IClientConfigBuilder {
    for (const [uri, env] of Object.entries(envs)) {
      this.addEnv(this.sanitizeUri(uri), env);
    }

    return this;
  }

  removeEnv(uri: string): IClientConfigBuilder {
    delete this._config.envs[this.sanitizeUri(uri)];

    return this;
  }

  setEnv(uri: string, env: Record<string, unknown>): IClientConfigBuilder {
    this._config.envs[this.sanitizeUri(uri)] = env;

    return this;
  }

  addInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): IClientConfigBuilder {
    const existingInterface = this._config.interfaces[
      this.sanitizeUri(interfaceUri)
    ];

    if (existingInterface) {
      existingInterface.add(this.sanitizeUri(implementationUri));
    } else {
      this._config.interfaces[this.sanitizeUri(interfaceUri)] = new Set([
        this.sanitizeUri(implementationUri),
      ]);
    }

    return this;
  }

  addInterfaceImplementations(
    interfaceUri: string,
    implementationUris: Array<string> | Set<string>
  ): IClientConfigBuilder {
    const existingInterface = this._config.interfaces[
      this.sanitizeUri(interfaceUri)
    ];

    if (existingInterface) {
      for (const implementationUri of implementationUris) {
        existingInterface.add(this.sanitizeUri(implementationUri));
      }
    } else {
      const sanitizedImplUris = [...implementationUris].map((x) =>
        this.sanitizeUri(x)
      );
      this._config.interfaces[this.sanitizeUri(interfaceUri)] = new Set(
        sanitizedImplUris
      );
    }

    return this;
  }

  removeInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): IClientConfigBuilder {
    const existingInterface = this._config.interfaces[
      this.sanitizeUri(interfaceUri)
    ];

    if (!existingInterface) return this;

    existingInterface.delete(this.sanitizeUri(implementationUri));

    if (existingInterface.size == 0) {
      delete this.config.interfaces[this.sanitizeUri(interfaceUri)];
    }

    return this;
  }

  addRedirect(from: string, to: string): IClientConfigBuilder {
    this._config.redirects[this.sanitizeUri(from)] = this.sanitizeUri(to);

    return this;
  }

  addRedirects(redirects: Record<string, string>): IClientConfigBuilder {
    for (const uri in redirects) {
      this.addRedirect(this.sanitizeUri(uri), this.sanitizeUri(redirects[uri]));
    }

    return this;
  }

  removeRedirect(from: string): IClientConfigBuilder {
    delete this._config.redirects[this.sanitizeUri(from)];

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

  private sanitizeUri(uri: string): string {
    return Uri.from(uri).uri;
  }
}
