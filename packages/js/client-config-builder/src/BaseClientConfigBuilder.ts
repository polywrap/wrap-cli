import { BuilderConfig } from "./types/configs/BuilderConfig";
import { ClientConfig } from "./types/configs/ClientConfig";
import { IClientConfigBuilder, TEnv, TUri } from "./types/IClientConfigBuilder";

import {
  CoreClientConfig,
  Wrapper,
  IWrapPackage,
  Env,
  Uri,
  InterfaceImplementations,
  IUriRedirect,
  IUriWrapper,
  IUriPackage,
  IUriResolver,
} from "@polywrap/core-js";
import { IWrapperCache, UriResolverLike } from "@polywrap/uri-resolvers-js";

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
  abstract buildCoreConfig(
    wrapperCache?: IWrapperCache,
    resolver?: IUriResolver<unknown>
  ): CoreClientConfig;

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

  addEnv(uri: TUri, env: TEnv): IClientConfigBuilder {
    this._config.envs[uri] = { ...this._config.envs[uri], ...env };

    return this;
  }

  addEnvs(envs: Record<TUri, TEnv>): IClientConfigBuilder {
    for (const [uri, env] of Object.entries(envs)) {
      this.addEnv(uri, env);
    }

    return this;
  }

  removeEnv(uri: TUri): IClientConfigBuilder {
    delete this._config.envs[uri];

    return this;
  }

  setEnv(uri: TUri, env: TEnv): IClientConfigBuilder {
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
    interfaceUri: TUri,
    implementationUris: Array<TUri> | Set<TUri>
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
    interfaceUri: TUri,
    implementationUri: TUri
  ): IClientConfigBuilder {
    const existingInterface = this._config.interfaces[interfaceUri];

    if (!existingInterface) return this;

    existingInterface.delete(implementationUri);

    return this;
  }

  addRedirect(from: TUri, to: TUri): IClientConfigBuilder {
    this._config.redirects[from] = to;

    return this;
  }

  addRedirects(redirects: Record<TUri, TUri>): IClientConfigBuilder {
    this._config.redirects = { ...this._config.redirects, ...redirects };

    return this;
  }

  removeRedirect(from: TUri): IClientConfigBuilder {
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

  build(): ClientConfig {
    const envs: Env[] = [];
    for (const [uri, env] of Object.entries(this._config.envs)) {
      envs.push({ uri: Uri.from(uri), env });
    }

    const interfaces: InterfaceImplementations[] = [];
    for (const [interfaceUri, implementations] of Object.entries(
      this._config.interfaces
    )) {
      if (implementations.size === 0) continue;
      interfaces.push({
        interface: Uri.from(interfaceUri),
        implementations: Array.from(implementations).map((uri) =>
          Uri.from(uri)
        ),
      });
    }

    const redirects: IUriRedirect[] = [];
    for (const [uri, redirect] of Object.entries(this._config.redirects)) {
      redirects.push({ from: Uri.from(uri), to: Uri.from(redirect) });
    }

    const wrappers: IUriWrapper[] = [];
    for (const [uri, wrapper] of Object.entries(this._config.wrappers)) {
      wrappers.push({ uri: Uri.from(uri), wrapper });
    }

    const packages: IUriPackage[] = [];
    for (const [uri, wrapPackage] of Object.entries(this._config.packages)) {
      packages.push({ uri: Uri.from(uri), package: wrapPackage });
    }

    return {
      envs,
      interfaces,
      redirects,
      wrappers,
      packages,
      resolvers: this._config.resolvers,
    };
  }
}
