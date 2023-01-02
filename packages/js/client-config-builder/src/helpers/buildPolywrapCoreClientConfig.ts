import {
  PolywrapClientConfig,
  PolywrapCoreClientConfig,
  BuilderConfig,
  ClientConfig,
} from "../types";
import { UriResolverLike } from "../types/configs/types";
import { ClientConfigBuilder } from "../ClientConfigBuilder";
import { sanitizeUri } from "./sanitizeUri";

import { CoreClientConfig, Uri } from "@polywrap/core-js";
import { UriResolverLike as SanitizedUriResolverLike } from "@polywrap/uri-resolvers-js";

export function sanitizeConfig<TUri extends Uri | string = string>(
  config:
    | Partial<PolywrapClientConfig<TUri>>
    | PolywrapCoreClientConfig<TUri>
    | Partial<ClientConfig>
    | CoreClientConfig
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
  if ("resolver" in config && config.resolver) {
    builderConfig.resolvers.push(config.resolver);
  }
  if ("resolvers" in config && config.resolvers) {
    builderConfig.resolvers.push(
      sanitizeResolverLike<TUri | Uri>(config.resolvers)
    );
  }

  return builderConfig;
}

export function sanitizeResolverLike<TUri extends Uri | string = string>(
  resolverLike: UriResolverLike<TUri> | SanitizedUriResolverLike
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
    if (config && "wrapperCache" in config) {
      builder = new ClientConfigBuilder(config.wrapperCache);
    } else {
      builder = new ClientConfigBuilder();
    }
  }

  if (!noDefaults) {
    builder.addDefaults();
  }

  if (config) {
    console.log(config);
    console.log(sanitizeConfig(config));
    builder.add(sanitizeConfig(config));
  }

  const sanitizedConfig = builder.buildCoreConfig();

  return sanitizedConfig;
}
