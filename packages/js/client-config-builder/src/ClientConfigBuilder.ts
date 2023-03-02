import { DefaultBundle } from "./bundles";
import { BaseClientConfigBuilder } from "./BaseClientConfigBuilder";
import { BuildOptions, IClientConfigBuilder, BuilderConfig } from "./types";

import {
  CoreClientConfig,
  Envs,
  IUriPackage,
  IUriRedirect,
  IUriWrapper,
  Uri,
  InterfaceImplementations,
} from "@polywrap/core-js";
import {
  RecursiveResolver,
  StaticResolver,
  WrapperCache,
  PackageToWrapperCacheResolver,
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
          )
        ),
    };
  }

  get config(): BuilderConfig {
    return this._config;
  }

  private buildEnvs(): Envs {
    return this._config.envs;
  }

  private buildInterfaces(): InterfaceImplementations {
    const interfaces: Record<string, string[]> = {};

    for (const iface in this._config.interfaces) {
      if (this._config.interfaces[iface].size > 0) {
        // Sanitize uri
        const uri = Uri.from(iface).uri;

        interfaces[uri] = [...this._config.interfaces[iface]];
      }
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
