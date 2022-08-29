import { getDefaultClientConfig } from "./bundles";
import { toUri } from "./utils/toUri";

import {
  ClientConfig,
  Uri,
  PluginPackage,
  UriResolver,
  Env
} from "@polywrap/core-js";

interface ArrayModifiers<TArray> {
  set: (items: TArray) => void;
  add: (items: TArray) => void;
  merge?: (items: TArray) => void;
}

type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

type ConfigArrayPropss = PickByType<ClientConfig<Uri>, Array<unknown>>;

type ConfigArrayModifiers<T> = {
  [key in keyof T]: ArrayModifiers<
    T[key]
  >;
}

type ConfigArrayModifierss = ConfigArrayModifiers<ConfigArrayPropss>;

class ConfigArrays implements ConfigArrayModifierss {
  constructor(
    public config: ClientConfig<Uri>
  ) { }

  public envs = {
    set: (items: Env<Uri>[]): void => {
      this.config.envs = items;
    },
    add: (items: Env<Uri>[]): void => {
      // TODO
    },
    merge: (items: Env<Uri>[]): void => {
      // TODO
    }
  };

  public uriResolvers = {
    set: (items: UriResolver[]): void => {

    },
    add: (items: UriResolver[]): void => {

    }
  }
}

type ConfigArrayNames = keyof ConfigArrayModifiers;
type ConfigArrayMergable = KeysOfType<ConfigArrays, { merge: unknown }>;

const name: ConfigArrayNames = "envs";
const name2: ConfigArrayNames = "uriResolvers";
const mergeable: ConfigArrayMergable = "envs";

type ConfigArrayKeys = KeysOfType<ClientConfig<Uri>, Array<unknown>>;
type ConfigArrayProps = PickByType<ClientConfig<Uri>, Array<unknown>>;

/*
type ConfigArrays = {
  [P in keyof ConfigArrayKeys]: ConfigArray<ConfigArrayProps[P]>;
}

const configArrays: ConfigArrays = {
  envs: ()
}
*/
/*
// set = override the existing array = array = new
// add = append the new items to the array
// merge = append the new items, and merge with any existing duplicates


ClientConfig.from(client);
ClientConfig.from(config);


const builder = client.cloneConfig();

builder.set("uriResolvers", [...])
builder.add("uriResolvers", [...])
builder.merge("uriResolvers", [...])

builder.override("envs", [...])
builder.add("envs", [...])

setEnvs(envs) {
  this.envs = envs;
}

addEnvs(envs) {
  for (env of envs) {
    this.setEnv(env)
  }
}

appendEnvs(envs) {
  for (env of envs) {
    this.appendEnv(env)
  }
}

concatEnvs(envs) {

}

*/

export class ClientConfigBuilder {
  private _config: ClientConfig<Uri>;

  constructor() {
    this._config = {
      envs: [],
      interfaces: [],
      plugins: [],
      redirects: [],
      uriResolvers: [],
    };
  }

  add(config: Partial<ClientConfig<Uri | string>>): ClientConfigBuilder {
    if (config.envs) {
      for (const env of config.envs) {
        this.addEnv(env.uri, env.env);
      }
    }

    if (config.interfaces) {
      for (const interfaceImpl of config.interfaces) {
        this.addInterfaceImplementations(
          interfaceImpl.interface,
          interfaceImpl.implementations
        );
      }
    }

    if (config.plugins) {
      for (const plugin of config.plugins) {
        this.addPlugin(plugin.uri, plugin.plugin);
      }
    }

    if (config.redirects) {
      for (const redirect of config.redirects) {
        this.addUriRedirect(redirect.from, redirect.to);
      }
    }

    if (config.uriResolvers) {
      for (const resolver of config.uriResolvers) {
        this.addUriResolver(resolver);
      }
    }

    return this;
  }

  set(config: Partial<ClientConfig<Uri | string>>): ClientConfigBuilder {
    if (config.envs) {
      for (const env of config.envs) {
        this.setEnv(env.uri, env.env);
      }
    }

    if (config.interfaces) {
      for (const interfaceImpl of config.interfaces) {
        this.setInterfaceImplementations(
          interfaceImpl.interface,
          interfaceImpl.implementations
        );
      }
    }

    if (config.plugins) {
      for (const plugin of config.plugins) {
        this.setPlugin(plugin.uri, plugin.plugin);
      }
    }

    if (config.redirects) {
      for (const redirect of config.redirects) {
        this.setUriRedirect(redirect.from, redirect.to);
      }
    }

    if (config.uriResolvers) {
      this.setUriResolvers(config.uriResolvers);
    }

    return this;
  }

  addDefaults(): ClientConfigBuilder {
    return this.add(getDefaultClientConfig());
  }

  addPlugin<TPluginConfig>(
    uri: Uri | string,
    plugin: PluginPackage<TPluginConfig>
  ): ClientConfigBuilder {
    const pluginUri = toUri(uri);

    const existingRegistration = this._config.plugins.find((x) =>
      Uri.equals(x.uri, pluginUri)
    );

    if (existingRegistration) {
      existingRegistration.plugin = plugin;
    } else {
      this._config.plugins.push({
        uri: pluginUri,
        plugin: plugin,
      });
    }

    return this;
  }

  removePlugin(uri: Uri | string): ClientConfigBuilder {
    const pluginUri = toUri(uri);

    const idx = this._config.plugins.findIndex((x) =>
      Uri.equals(x.uri, pluginUri)
    );

    if (idx > -1) {
      this._config.plugins.splice(idx, 1);
    }

    return this;
  }

  setPlugin<TPluginConfig>(
    uri: Uri | string,
    plugin: PluginPackage<TPluginConfig>
  ): ClientConfigBuilder {
    // addPlugin ensures uniqueness, and overrides existing
    return this.addPlugin(uri, plugin);
  }

  addEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = toUri(uri);

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

  removeEnv(uri: Uri | string): ClientConfigBuilder {
    const envUri = toUri(uri);

    const idx = this._config.envs.findIndex((x) => Uri.equals(x.uri, envUri));

    if (idx > -1) {
      this._config.envs.splice(idx, 1);
    }

    return this;
  }

  setEnv(uri: Uri | string, env: Record<string, unknown>): ClientConfigBuilder {
    const envUri = toUri(uri);

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
    const interfaceUriSanitized = toUri(interfaceUri);
    const implementationUriSanitized = toUri(implementationUri);

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
    const interfaceUriSanitized = toUri(interfaceUri);
    const implementationUrisSanitized = implementationUris.map(toUri);

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
    const interfaceUriSanitized = toUri(interfaceUri);
    const implementationUriSanitized = toUri(implementationUri);

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

  setInterfaceImplementations(
    interfaceUri: Uri | string,
    implementationUris: Array<Uri | string>
  ): ClientConfigBuilder {
    const interfaceUriSanitized = toUri(interfaceUri);
    const implementationUrisSanitized = implementationUris.map(toUri);

    const existingInterface = this._config.interfaces.find((x) =>
      Uri.equals(x.interface, interfaceUriSanitized)
    );

    if (existingInterface) {
      existingInterface.implementations = implementationUrisSanitized;
    } else {
      this._config.interfaces.push({
        interface: interfaceUriSanitized,
        implementations: implementationUrisSanitized,
      });
    }

    return this;
  }

  addUriRedirect(from: Uri | string, to: Uri | string): ClientConfigBuilder {
    const fromSanitized = toUri(from);
    const toSanitized = toUri(to);

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
    const fromSanitized = toUri(from);

    const idx = this._config.redirects.findIndex((x) =>
      Uri.equals(x.from, fromSanitized)
    );

    if (idx > -1) {
      this._config.redirects.splice(idx, 1);
    }

    return this;
  }

  setUriRedirect(from: Uri | string, to: Uri | string): ClientConfigBuilder {
    // addUriRedirect ensures uniqueness, and overrides existing
    return this.addUriRedirect(from, to);
  }

  addUriResolver(resolver: UriResolver): ClientConfigBuilder {
    this._config.uriResolvers.push(resolver);

    return this;
  }

  setUriResolvers(resolvers: UriResolver[]): ClientConfigBuilder {
    this._config.uriResolvers = resolvers;

    return this;
  }

  build(): ClientConfig<Uri> {
    return this._config;
  }
}
