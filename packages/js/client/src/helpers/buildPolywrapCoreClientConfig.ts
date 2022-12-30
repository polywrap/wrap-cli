// TODO: can move this to client-config-builder-js
// TODO: buildPolywrapCoreClientConfig can take clientConfigBuilder as an argument

import { PolywrapClientConfig } from "../PolywrapClientConfig";
import { PolywrapCoreClientConfig } from "../PolywrapCoreClientConfig";
import { sanitizeUri } from "./sanitizeUri";
import { UriResolverLike } from "../types";

import { CoreClientConfig, Uri } from "@polywrap/core-js";
import {
  BuilderConfig,
  ClientConfigBuilder,
} from "@polywrap/client-config-builder-js";
import { UriResolverLike as SanitizedUriResolverLike } from "@polywrap/uri-resolvers-js";

export function sanitizeConfig<TUri extends Uri | string = string>(
  config: Partial<PolywrapClientConfig<TUri>> | PolywrapCoreClientConfig<TUri>
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
      builderConfig.envs[sanitizeUri<TUri>(env.uri).uri] = env.env;
    }
  }
  if (config.interfaces) {
    for (const interfaceImplementation of config.interfaces) {
      builderConfig.interfaces[
        sanitizeUri<TUri>(interfaceImplementation.interface).uri
      ] = new Set(
        interfaceImplementation.implementations.map(
          (uri: TUri) => sanitizeUri<TUri>(uri).uri
        )
      );
    }
  }
  if ("redirects" in config && config.redirects) {
    for (const redirect of config.redirects) {
      builderConfig.redirects[
        sanitizeUri<TUri>(redirect.from).uri
      ] = sanitizeUri<TUri>(redirect.to).uri;
    }
  }
  if ("wrappers" in config && config.wrappers) {
    for (const wrapper of config.wrappers) {
      builderConfig.wrappers[sanitizeUri<TUri>(wrapper.uri).uri] =
        wrapper.wrapper;
    }
  }
  if ("packages" in config && config.packages) {
    for (const pkg of config.packages) {
      builderConfig.packages[sanitizeUri<TUri>(pkg.uri).uri] = pkg.package;
    }
  }
  if ("resolver" in config && config.resolver) {
    builderConfig.resolvers.push(config.resolver);
  }
  if ("resolvers" in config && config.resolvers) {
    builderConfig.resolvers.push(sanitizeResolverLike<TUri>(config.resolvers));
  }

  return builderConfig;
}

export function sanitizeResolverLike<TUri extends Uri | string = string>(
  resolverLike: UriResolverLike<TUri>
): SanitizedUriResolverLike {
  if (Array.isArray(resolverLike)) {
    return resolverLike.map((resolver) => sanitizeResolverLike(resolver));
  } else if ("tryResolveUri" in resolverLike) {
    return resolverLike;
  } else if ("uri" in resolverLike) {
    return {
      ...resolverLike,
      uri: sanitizeUri<TUri>(resolverLike.uri),
    };
  } else if ("from" in resolverLike) {
    return {
      from: sanitizeUri<TUri>(resolverLike.from),
      to: sanitizeUri<TUri>(resolverLike.to),
    };
  } else {
    throw new Error(
      `Invalid resolverLike: ${JSON.stringify(resolverLike, null, 2)}`
    );
  }
}

export const buildPolywrapCoreClientConfig = (
  config?: Partial<PolywrapClientConfig> | PolywrapCoreClientConfig | undefined,
  noDefaults = false
): CoreClientConfig => {
  const builder = new ClientConfigBuilder(config?.wrapperCache);

  if (!noDefaults) {
    builder.addDefaults();
  }

  if (config) {
    builder.add(sanitizeConfig(config));
  }

  const sanitizedConfig = builder.buildCoreConfig();

  return sanitizedConfig;
};
