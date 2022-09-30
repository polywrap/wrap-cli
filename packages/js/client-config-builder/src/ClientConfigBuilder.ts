import { getDefaultConfig } from "./bundles";
import { CustomClientConfig } from "./CustomClientConfig";

import {
  ClientConfig,
  Uri,
  IUriResolver,
  IUriPackage,
  IUriWrapper,
  Env,
} from "@polywrap/core-js";
import {
  IWrapperCache,
  LegacyRedirectsResolver,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  StaticResolver,
  UriResolverLike,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

export class ClientConfigBuilder {
  private _config: CustomClientConfig<Uri> = {
    envs: [],
    interfaces: [],
    redirects: [],
    wrappers: [],
    packages: [],
    resolvers: [],
  };

  getConfig(): CustomClientConfig<Uri> {
    return this._config;
  }

  add(config: Partial<CustomClientConfig<Uri | string>>): ClientConfigBuilder {
    if (config.envs) {
      this.addEnvs(config.envs);
    }

    if (config.interfaces) {
      for (const interfaceImpl of config.interfaces) {
        this.addInterfaceImplementations(
          interfaceImpl.interface,
          interfaceImpl.implementations
        );
      }
    }

    if (config.redirects) {
      for (const redirect of config.redirects) {
        this.addUriRedirect(redirect.from, redirect.to);
      }
    }

    if (config.wrappers) {
      for (const uriWrapper of config.wrappers) {
        this.addWrapper(uriWrapper);
      }
    }

    if (config.packages) {
      for (const uriPackage of config.packages) {
        this.addPackage(uriPackage);
      }
    }

    if (config.redirects) {
      for (const redirect of config.redirects) {
        this.addUriRedirect(redirect.from, redirect.to);
      }
    }

    if (config.resolvers) {
      this.addResolvers(config.resolvers);
    }

    return this;
  }

  addDefaults(): ClientConfigBuilder {
    return this.add(getDefaultConfig());
  }

  addWrapper(uriWrapper: IUriWrapper<Uri | string>): ClientConfigBuilder {
    const wrapperUri = Uri.from(uriWrapper.uri);

    const existingRegistration = this._config.wrappers.find((x) =>
      Uri.equals(x.uri, wrapperUri)
    );

    if (existingRegistration) {
      existingRegistration.wrapper = uriWrapper.wrapper;
    } else {
      this._config.wrappers.push({
        uri: wrapperUri,
        wrapper: uriWrapper.wrapper,
      });
    }

    return this;
  }

  addWrappers(uriWrappers: IUriWrapper<Uri | string>[]): ClientConfigBuilder {
    for (const uriWrapper of uriWrappers) {
      this.addWrapper(uriWrapper);
    }

    return this;
  }

  removeWrapper(uri: Uri | string): ClientConfigBuilder {
    const wrapperUri = Uri.from(uri);

    const idx = this._config.wrappers.findIndex((x) =>
      Uri.equals(x.uri, wrapperUri)
    );

    if (idx > -1) {
      this._config.wrappers.splice(idx, 1);
    }

    return this;
  }

  addPackage(uriPackage: IUriPackage<Uri | string>): ClientConfigBuilder {
    const packageUri = Uri.from(uriPackage.uri);

    const existingRegistration = this._config.packages.find((x) =>
      Uri.equals(x.uri, packageUri)
    );

    if (existingRegistration) {
      existingRegistration.package = uriPackage.package;
    } else {
      this._config.packages.push({
        uri: packageUri,
        package: uriPackage.package,
      });
    }

    return this;
  }

  addPackages(uriPackages: IUriPackage<Uri | string>[]): ClientConfigBuilder {
    for (const uriPackage of uriPackages) {
      this.addPackage(uriPackage);
    }

    return this;
  }

  removePackage(uri: Uri | string): ClientConfigBuilder {
    const packageUri = Uri.from(uri);

    const idx = this._config.packages.findIndex((x) =>
      Uri.equals(x.uri, packageUri)
    );

    if (idx > -1) {
      this._config.packages.splice(idx, 1);
    }

    return this;
  }

  addEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = Uri.from(uri);

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

  addEnvs(envs: Env<Uri | string>[]): ClientConfigBuilder {
    for (const env of envs) {
      this.addEnv(env.uri, env.env);
    }

    return this;
  }

  removeEnv(uri: Uri | string): ClientConfigBuilder {
    const envUri = Uri.from(uri);

    const idx = this._config.envs.findIndex((x) => Uri.equals(x.uri, envUri));

    if (idx > -1) {
      this._config.envs.splice(idx, 1);
    }

    return this;
  }

  setEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = Uri.from(uri);

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
    const interfaceUriSanitized = Uri.from(interfaceUri);
    const implementationUriSanitized = Uri.from(implementationUri);

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
    const interfaceUriSanitized = Uri.from(interfaceUri);
    const implementationUrisSanitized = implementationUris.map(Uri.from);

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
    const interfaceUriSanitized = Uri.from(interfaceUri);
    const implementationUriSanitized = Uri.from(implementationUri);

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
    const fromSanitized = Uri.from(from);
    const toSanitized = Uri.from(to);

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
    const fromSanitized = Uri.from(from);

    const idx = this._config.redirects.findIndex((x) =>
      Uri.equals(x.from, fromSanitized)
    );

    if (idx > -1) {
      this._config.redirects.splice(idx, 1);
    }

    return this;
  }

  addResolver(resolver: UriResolverLike): ClientConfigBuilder {
    this._config.resolvers.push(resolver);

    return this;
  }

  addResolvers(resolvers: UriResolverLike[]): ClientConfigBuilder {
    for (const resolver of resolvers) {
      this.addResolver(resolver);
    }

    return this;
  }

  buildDefault(
    wrapperCache?: IWrapperCache,
    resolver?: IUriResolver<unknown>
  ): ClientConfig<Uri> {
    return {
      envs: this._config.envs,
      interfaces: this._config.interfaces,
      redirects: this._config.redirects,
      resolver:
        resolver ??
        new RecursiveResolver(
          PackageToWrapperCacheResolver.from(
            [
              new LegacyRedirectsResolver(),
              StaticResolver.from([
                ...this._config.wrappers,
                ...this._config.packages,
              ]),
              ...this._config.resolvers,
              new ExtendableUriResolver(),
            ],
            wrapperCache ?? new WrapperCache()
          )
        ),
    };
  }
}
