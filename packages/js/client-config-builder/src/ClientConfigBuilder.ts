import { getDefaultConfig } from "./bundles";
import { BaseClientConfigBuilder } from "./BaseClientConfigBuilder";
import { IClientConfigBuilder } from "./types/IClientConfigBuilder";
import { BuilderConfig } from "./types";

import {
  CoreClientConfig,
  Env,
  InterfaceImplementations,
  IUriPackage,
  IUriRedirect,
  IUriResolver,
  IUriWrapper,
  Uri,
} from "@polywrap/core-js";
import {
  IWrapperCache,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  StaticResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

export class ClientConfigBuilder extends BaseClientConfigBuilder {
  // $start: ClientConfigBuilder-constructor
  /**
   * Instantiate a ClientConfigBuilder
   */
  constructor() /* $ */ {
    super();
  }

  addDefaults(): IClientConfigBuilder {
    return this.add(getDefaultConfig());
  }

  build(
    wrapperCache?: IWrapperCache,
    resolver?: IUriResolver<unknown>
  ): CoreClientConfig {
    return {
      envs: this.buildEnvs(),
      interfaces: this.buildInterfaces(),
      resolver:
        resolver ??
        RecursiveResolver.from(
          PackageToWrapperCacheResolver.from(
            [
              StaticResolver.from([
                ...this.buildRedirects(),
                ...this.buildWrappers(),
                ...this.buildPackages(),
              ]),
              ...this._config.resolvers,
              new ExtendableUriResolver(),
            ],
            wrapperCache ?? new WrapperCache()
          )
        ),
    };
  }

  get config(): BuilderConfig {
    return this._config;
  }

  private buildEnvs(): Env[] {
    const envs: Env[] = [];

    for (const [uri, env] of Object.entries(this._config.envs)) {
      envs.push({ uri: Uri.from(uri), env });
    }

    return envs;
  }

  private buildInterfaces(): InterfaceImplementations[] {
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

    return interfaces;
  }

  private buildRedirects(): IUriRedirect[] {
    const redirects: IUriRedirect[] = [];

    for (const [uri, redirect] of Object.entries(this._config.redirects)) {
      redirects.push({ from: Uri.from(uri), to: Uri.from(redirect) });
    }

    return redirects;
  }

  private buildWrappers(): IUriWrapper[] {
    const wrappers: IUriWrapper[] = [];

    for (const [uri, wrapper] of Object.entries(this._config.wrappers)) {
      wrappers.push({ uri: Uri.from(uri), wrapper });
    }

    return wrappers;
  }

  private buildPackages(): IUriPackage[] {
    const packages: IUriPackage[] = [];

    for (const [uri, wrapPackage] of Object.entries(this._config.packages)) {
      packages.push({ uri: Uri.from(uri), package: wrapPackage });
    }

    return packages;
  }
}
