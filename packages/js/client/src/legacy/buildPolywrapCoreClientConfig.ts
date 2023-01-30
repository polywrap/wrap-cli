import {
  PolywrapClientConfig,
  PolywrapCoreClientConfig,
  ClientConfig,
  sanitizeUri,
} from ".";
import { GenericUriResolverLike } from "./types";

import {
  CoreClientConfig,
  Env,
  InterfaceImplementations,
  Uri,
} from "@polywrap/core-js";
import { UriResolverLike as SanitizedUriResolverLike } from "@polywrap/uri-resolvers-js";
import {
  BuilderConfig,
  ClientConfigBuilder,
} from "@polywrap/client-config-builder-js";

export function sanitizeConfig<TUri extends Uri | string = string>(
  config: Partial<PolywrapClientConfig<TUri>> | Partial<ClientConfig>
): BuilderConfig {
  const builderConfig: BuilderConfig = {
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  };

  if (config.envs) {
    for (const env of config.envs) {
      builderConfig.envs[sanitizeUri<TUri | Uri>(env.uri).uri] = env.env;
    }
  }
  if (config.interfaces) {
    for (const interfaceImplementation of config.interfaces) {
      const impls: Set<string> =
        builderConfig.interfaces[
          sanitizeUri<TUri | Uri>(interfaceImplementation.interface).uri
        ] || new Set<string>();
      for (const implementation of interfaceImplementation.implementations) {
        impls.add(sanitizeUri<TUri | Uri>(implementation).uri);
      }
      builderConfig.interfaces[
        sanitizeUri<TUri | Uri>(interfaceImplementation.interface).uri
      ] = impls;
    }
  }
  if ("redirects" in config && config.redirects) {
    for (const redirect of config.redirects) {
      builderConfig.redirects[
        sanitizeUri<TUri | Uri>(redirect.from).uri
      ] = sanitizeUri<TUri | Uri>(redirect.to).uri;
    }
  }
  if ("wrappers" in config && config.wrappers) {
    for (const wrapper of config.wrappers) {
      builderConfig.wrappers[sanitizeUri<TUri | Uri>(wrapper.uri).uri] =
        wrapper.wrapper;
    }
  }
  if ("packages" in config && config.packages) {
    for (const pkg of config.packages) {
      builderConfig.packages[sanitizeUri<TUri | Uri>(pkg.uri).uri] =
        pkg.package;
    }
  }
  if ("resolvers" in config && config.resolvers) {
    for (const resolver of config.resolvers) {
      builderConfig.resolvers.push(sanitizeResolverLike<TUri | Uri>(resolver));
    }
  }

  return builderConfig;
}

export function sanitizeResolverLike<TUri extends Uri | string = string>(
  resolverLike: GenericUriResolverLike<TUri> | SanitizedUriResolverLike
): SanitizedUriResolverLike {
  if (Array.isArray(resolverLike)) {
    const sanitizedResolvers: SanitizedUriResolverLike[] = [];
    for (const resolver of resolverLike) {
      sanitizedResolvers.push(sanitizeResolverLike(resolver));
    }
    return sanitizedResolvers;
  } else if ("tryResolveUri" in resolverLike) {
    return resolverLike;
  } else if ("uri" in resolverLike) {
    return {
      ...resolverLike,
      uri: sanitizeUri<TUri | Uri>(resolverLike.uri),
    };
  } else if ("from" in resolverLike) {
    return {
      from: sanitizeUri<TUri | Uri>(resolverLike.from),
      to: sanitizeUri<TUri | Uri>(resolverLike.to),
    };
  } else {
    throw new Error(
      `Invalid resolverLike: ${JSON.stringify(resolverLike, null, 2)}`
    );
  }
}

export function sanitizePolywrapCoreConfig<TUri extends Uri | string = string>(
  config: PolywrapCoreClientConfig<TUri> | CoreClientConfig
): CoreClientConfig {
  const sanitizedEnvs: Env[] = [];
  const sanitizedInterfaces: InterfaceImplementations[] = [];

  if (config.envs) {
    for (const env of config.envs) {
      sanitizedEnvs.push({
        uri: sanitizeUri<TUri | Uri>(env.uri),
        env: env.env,
      });
    }
  }
  if (config.interfaces) {
    for (const interfaceImpl of config.interfaces) {
      const sanitizedImpls: Uri[] = [];
      for (const impl of interfaceImpl.implementations) {
        sanitizedImpls.push(sanitizeUri<TUri | Uri>(impl));
      }

      sanitizedInterfaces.push({
        interface: sanitizeUri<TUri | Uri>(interfaceImpl.interface),
        implementations: sanitizedImpls,
      });
    }
  }

  return {
    envs: sanitizedEnvs,
    interfaces: sanitizedInterfaces,
    resolver: config.resolver,
  };
}

export function buildPolywrapCoreClientConfig<
  TUri extends Uri | string = string
>(
  config?:
    | Partial<PolywrapClientConfig<TUri>>
    | PolywrapCoreClientConfig<TUri>
    | Partial<ClientConfig>
    | CoreClientConfig
    | undefined,
  builder: ClientConfigBuilder | undefined = undefined,
  noDefaults = false
): CoreClientConfig {
  if (!builder) {
    builder = new ClientConfigBuilder();
  }

  if (!noDefaults) {
    builder.addDefaults();
  }

  if (config && "resolver" in config) {
    return sanitizePolywrapCoreConfig<TUri>(config);
  } else if (config) {
    builder.add(sanitizeConfig(config));
  }

  if (config && "wrapperCache" in config) {
    return builder.build(config.wrapperCache);
  }

  return builder.build();
}
