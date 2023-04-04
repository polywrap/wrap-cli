import { DefaultBundle } from "./bundles";
import { BaseClientConfigBuilder } from "./BaseClientConfigBuilder";
import { BuildOptions, IClientConfigBuilder, BuilderConfig } from "./types";

import {
  CoreClientConfig,
  IUriPackage,
  IUriRedirect,
  IUriWrapper,
  Uri,
  WrapperEnv,
  ReadonlyUriMap,
  UriMap,
} from "@polywrap/core-js";
import {
  RecursiveResolver,
  StaticResolver,
  WrapperCache,
  WrapperCacheResolver,
  PackageToWrapperResolver,
  RequestSynchronizerResolver,
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
    return this.add(DefaultBundle.getConfig());
  }

  build(options?: BuildOptions): CoreClientConfig {
    const resolver =
      options && "resolver" in options ? options.resolver : undefined;
    const wrapperCache =
      options && "wrapperCache" in options ? options.wrapperCache : undefined;
    return {
      envs: this.buildEnvs(),
      interfaces: this.buildInterfaces(),
      resolver:
        resolver ??
        RecursiveResolver.from(
          RequestSynchronizerResolver.from(
            WrapperCacheResolver.from(
              PackageToWrapperResolver.from([
                StaticResolver.from([
                  ...this.buildRedirects(),
                  ...this.buildWrappers(),
                  ...this.buildPackages(),
                ]),
                ...this._config.resolvers,
                new ExtendableUriResolver(),
              ]),
              wrapperCache ?? new WrapperCache()
            )
          )
        ),
    };
  }

  get config(): BuilderConfig {
    return this._config;
  }

  private buildEnvs(): ReadonlyUriMap<WrapperEnv> {
    const envs = new UriMap<WrapperEnv>();

    for (const uri in this._config.envs) {
      envs.set(Uri.from(uri), this._config.envs[uri]);
    }

    return envs;
  }

  private buildInterfaces(): ReadonlyUriMap<readonly Uri[]> {
    const interfaceImplementations = new UriMap<readonly Uri[]>();

    for (const uri in this._config.interfaces) {
      const uriImpls = [...this._config.interfaces[uri]].map((x) =>
        Uri.from(x)
      );
      interfaceImplementations.set(Uri.from(uri), uriImpls);
    }

    return interfaceImplementations;
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
