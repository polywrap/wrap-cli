import { ClientConfigBuilder } from "../ClientConfigBuilder";
import {
  Client,
  Env,
  InterfaceImplementations,
  PluginModule,
  PluginRegistration,
  Uri,
  UriRedirect,
  IUriResolver,
  UriPackageOrWrapper,
  UriMap,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { getDefaultClientConfig } from "../bundles";
import { RecursiveResolver } from "@polywrap/uri-resolvers-js";

class NamedUriResolver implements IUriResolver {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }
  get name(): string {
    return this._name;
  }
  tryResolveUri(
    uri: Uri,
    client: Client
  ): Promise<Result<UriPackageOrWrapper>> {
    throw new Error("Method not implemented.");
  }
}

describe("Client config builder", () => {
  const testEnvs = new UriMap<Env>([
    [
      "wrap://ens/test.plugin.one",
      { uri: "wrap://ens/test.plugin.one", env: { test: "value" } },
    ],
    [
      "wrap://ens/test.plugin.two",
      { uri: "wrap://ens/test.plugin.two", env: { test: "value" } },
    ],
  ]);

  const testInterfaces = new UriMap<InterfaceImplementations>([
    [
      "wrap://ens/test-interface-1.polywrap.eth",
      {
        interface: "wrap://ens/test-interface-1.polywrap.eth",
        implementations: ["wrap://ens/test1.polywrap.eth"],
      },
    ],
    [
      "wrap://ens/test-interface-2.polywrap.eth",
      {
        interface: "wrap://ens/test-interface-2.polywrap.eth",
        implementations: ["wrap://ens/test2.polywrap.eth"],
      },
    ],
  ]);

  const testPlugins = new UriMap<PluginRegistration>([
    [
      "wrap://ens/test1.polywrap.eth",
      {
        uri: "wrap://ens/test1.polywrap.eth",
        plugin: {
          factory: () => ({} as PluginModule<{}>),
          manifest: {
            name: "test",
            abi: {},
            type: "plugin",
            version: "0.1",
          },
        },
      },
    ],
    [
      "wrap://ens/test2.polywrap.eth",
      {
        uri: "wrap://ens/test2.polywrap.eth",
        plugin: {
          factory: () => ({} as PluginModule<{}>),
          manifest: {
            name: "test",
            abi: {},
            type: "plugin",
            version: "0.1",
          },
        },
      },
    ],
  ]);

  const testUriRedirects = new UriMap<UriRedirect>([
    [
      "wrap://ens/test-one.polywrap.eth",
      {
        from: "wrap://ens/test-one.polywrap.eth",
        to: "wrap://ens/test1.polywrap.eth",
      },
    ],
    [
      "wrap://ens/test-two.polywrap.eth",
      {
        from: "wrap://ens/test-two.polywrap.eth",
        to: "wrap://ens/test2.polywrap.eth",
      },
    ],
  ]);

  const testUriResolver: IUriResolver = new NamedUriResolver("test1");

  it("should build an empty partial config", () => {
    const clientConfig = new ClientConfigBuilder().buildPartial();

    expect(clientConfig).toStrictEqual({
      envs: new UriMap(),
      interfaces: new UriMap(),
      plugins: new UriMap(),
      redirects: new UriMap(),
    });
  });

  it("should succaesfully add config object and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        envs: testEnvs,
        interfaces: testInterfaces,
        plugins: testPlugins,
        redirects: testUriRedirects,
        resolver: testUriResolver,
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect([...clientConfig.envs.values()]).toStrictEqual(
      [...testEnvs.values()].map((x) => ({
        uri: Uri.from(x.uri),
        env: x.env,
      }))
    );
    expect([...clientConfig.interfaces.values()]).toStrictEqual(
      [...testInterfaces.values()].map((x) => ({
        interface: Uri.from(x.interface),
        implementations: x.implementations.map(Uri.from),
      }))
    );
    expect([...clientConfig.plugins.values()]).toStrictEqual(
      [...testPlugins.values()].map((x) => ({
        uri: Uri.from(x.uri),
        plugin: x.plugin,
      }))
    );
    expect([...clientConfig.redirects.values()]).toStrictEqual(
      [...testUriRedirects.values()].map((x) => ({
        from: Uri.from(x.from),
        to: Uri.from(x.to),
      }))
    );
    expect(clientConfig.resolver).toStrictEqual(testUriResolver);
  });

  it("should succesfully add and merge two config objects and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        envs: new UriMap([[...testEnvs][0]]),
        interfaces: new UriMap([[...testInterfaces][0]]),
        plugins: new UriMap([[...testPlugins][0]]),
        redirects: new UriMap([[...testUriRedirects][0]]),
        resolver: testUriResolver,
      })
      .add({
        envs: new UriMap([[...testEnvs][1]]),
        interfaces: new UriMap([[...testInterfaces][1]]),
        plugins: new UriMap([[...testPlugins][1]]),
        redirects: new UriMap([[...testUriRedirects][1]]),
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect([...clientConfig.envs.values()]).toStrictEqual(
      [...testEnvs.values()].map((x) => ({
        uri: Uri.from(x.uri),
        env: x.env,
      }))
    );
    expect([...clientConfig.interfaces.values()]).toStrictEqual(
      [...testInterfaces.values()].map((x) => ({
        interface: Uri.from(x.interface),
        implementations: x.implementations.map(Uri.from),
      }))
    );
    expect([...clientConfig.plugins.values()]).toStrictEqual(
      [...testPlugins.values()].map((x) => ({
        uri: Uri.from(x.uri),
        plugin: x.plugin,
      }))
    );
    expect([...clientConfig.redirects.values()]).toStrictEqual(
      [...testUriRedirects.values()].map((x) => ({
        from: Uri.from(x.from),
        to: Uri.from(x.to),
      }))
    );
    expect(clientConfig.resolver).toStrictEqual(testUriResolver);
  });

  it("should successfully add the default config", () => {
    const clientConfig = new ClientConfigBuilder().addDefaults().build();

    const expectedConfig = getDefaultClientConfig();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.envs).toStrictEqual(expectedConfig.envs);
    expect(clientConfig.interfaces).toStrictEqual(expectedConfig.interfaces);
    expect(clientConfig.plugins.size).toEqual(expectedConfig.plugins.size);
    expect(
      [...clientConfig.plugins.values()].map((x) => ({
        uri: x.uri,
        manifest: x.plugin.manifest,
      }))
    ).toStrictEqual(
      [...expectedConfig.plugins.values()].map((x) => ({
        uri: x.uri,
        manifest: x.plugin.manifest,
      }))
    );
    expect(clientConfig.redirects).toStrictEqual(expectedConfig.redirects);
    expect(clientConfig.resolver instanceof RecursiveResolver).toBe(true);
  });

  it("should successfully add a plugin", () => {
    const plugins = [...testPlugins.values()];
    const pluginUri = "wrap://ens/some-plugin.polywrap.eth";
    const pluginPackage = plugins[0].plugin;

    const config = new ClientConfigBuilder()
      .addPlugin(pluginUri, pluginPackage)
      .buildPartial();

    if (!config.plugins || config.plugins.size !== 1) {
      fail(["Expected 1 plugin, received:", config.plugins]);
    }
    const configPlugins = [...config.plugins.values()];

    expect(configPlugins[0].uri).toStrictEqual(Uri.from(pluginUri));
    expect(configPlugins[0].plugin).toStrictEqual(pluginPackage);
  });

  it("should successfully add multiple plugins", () => {
    const plugins = [...testPlugins.values()];

    const config = new ClientConfigBuilder()
      .addPlugin(plugins[0].uri, plugins[0].plugin)
      .addPlugin(plugins[1].uri, plugins[1].plugin)
      .buildPartial();

    if (!config.plugins || config.plugins.size !== 2) {
      fail(["Expected 2 plugins, received:", config.plugins]);
    }
    const configPlugins = [...config.plugins.values()];
    expect(configPlugins).toContainEqual({
      uri: Uri.from(plugins[0].uri),
      plugin: plugins[0].plugin,
    });
    expect(configPlugins).toContainEqual({
      uri: Uri.from(plugins[1].uri),
      plugin: plugins[1].plugin,
    });
  });

  it("should succesfully overwrite a plugin", () => {
    const plugins = [...testPlugins.values()];

    const pluginUri = "wrap://ens/some-plugin.polywrap.eth";
    const pluginPackage1 = plugins[0].plugin;
    const pluginPackage2 = plugins[1].plugin;

    const config = new ClientConfigBuilder()
      .addPlugin(pluginUri, pluginPackage1)
      .addPlugin(pluginUri, pluginPackage2)
      .buildPartial();

    if (!config.plugins || config.plugins.size !== 1) {
      fail(["Expected 1 plugin, received:", config.plugins]);
    }
    const configPlugins = [...config.plugins.values()];

    expect(configPlugins[0].uri).toStrictEqual(Uri.from(pluginUri));
    expect(configPlugins[0].plugin).not.toStrictEqual(pluginPackage1);
    expect(configPlugins[0].plugin).toStrictEqual(pluginPackage2);
  });

  it("should remove a plugin", () => {
    const plugins = [...testPlugins.values()];

    const config = new ClientConfigBuilder()
      .addPlugin(plugins[0].uri, plugins[0].plugin)
      .addPlugin(plugins[1].uri, plugins[1].plugin)
      .removePlugin(plugins[0].uri)
      .buildPartial();

    if (!config.plugins || config.plugins.size !== 1) {
      fail(["Expected 1 plugin, received:", config.plugins]);
    }

    const remainingPlugin = [...config.plugins.values()][0];

    expect(remainingPlugin.uri).toStrictEqual(Uri.from(plugins[1].uri));
    expect(remainingPlugin.plugin).toStrictEqual(plugins[1].plugin);
  });

  it("should successfully add an env", () => {
    const envUri = "wrap://ens/some-plugin.polywrap.eth";
    const env = {
      foo: "bar",
      baz: {
        biz: "buz",
      },
    };

    const config = new ClientConfigBuilder().addEnv(envUri, env).buildPartial();

    if (!config.envs || config.envs.size !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    const configEnvs = [...config.envs.values()];

    expect(configEnvs[0].uri).toStrictEqual(Uri.from(envUri));
    expect(configEnvs[0].env).toStrictEqual(env);
  });

  it("should successfully add to an existing env", () => {
    const envUri = "wrap://ens/some-plugin.polywrap.eth";
    const env1 = {
      foo: "bar",
    };
    const env2 = {
      baz: {
        biz: "buz",
      },
    };

    const config = new ClientConfigBuilder()
      .addEnv(envUri, env1)
      .addEnv(envUri, env2)
      .buildPartial();

    const expectedEnv = { ...env1, ...env2 };

    if (!config.envs || config.envs.size !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    const configEnvs = [...config.envs.values()];

    expect(configEnvs[0].uri).toStrictEqual(Uri.from(envUri));
    expect(configEnvs[0].env).toStrictEqual(expectedEnv);
  });

  it("should succesfully add two separate envs", () => {
    const envs = [...testEnvs.values()];

    const config = new ClientConfigBuilder()
      .addEnv(envs[0].uri, envs[0].env)
      .addEnv(envs[1].uri, envs[1].env)
      .buildPartial();

    if (!config.envs || config.envs.size !== 2) {
      fail(["Expected 2 envs, received:", config.envs]);
    }

    const configEnvs = [...config.envs.values()];

    expect(configEnvs).toContainEqual({
      uri: Uri.from(envs[0].uri),
      env: envs[0].env,
    });
    expect(configEnvs).toContainEqual({
      uri: Uri.from(envs[1].uri),
      env: envs[1].env,
    });
  });

  it("should remove an env", () => {
    const envs = [...testEnvs.values()];

    const config = new ClientConfigBuilder()
      .addEnv(envs[0].uri, envs[0].env)
      .addEnv(envs[1].uri, envs[1].env)
      .removeEnv(envs[0].uri)
      .buildPartial();

    if (!config.envs || config.envs.size !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect([...config.envs.values()]).toContainEqual({
      uri: Uri.from(envs[1].uri),
      env: envs[1].env,
    });
  });

  it("should set an env", () => {
    const envUri = "wrap://ens/some.plugin.eth";

    const env = {
      foo: "bar",
    };

    const config = new ClientConfigBuilder().setEnv(envUri, env).buildPartial();

    if (!config.envs || config.envs.size !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect([...config.envs.values()][0]).toEqual({
      uri: Uri.from(envUri),
      env: env,
    });
  });

  it("should set an env over an existing env", () => {
    const envUri = "wrap://ens/some.plugin.eth";

    const env1 = {
      foo: "bar",
    };
    const env2 = {
      bar: "baz",
    };

    const config = new ClientConfigBuilder()
      .addEnv(envUri, env1)
      .setEnv(envUri, env2)
      .buildPartial();

    if (!config.envs || config.envs.size !== 1) {
      fail(["Expected 1 env, received:", config.envs]);
    }

    expect([...config.envs.values()][0]).toEqual({
      uri: Uri.from(envUri),
      env: env2,
    });
  });

  it("should add an interface implementation for a non-existent interface", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri = "wrap://ens/interface.impl.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri, implUri)
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    expect([...config.interfaces.values()][0]).toStrictEqual({
      interface: Uri.from(interfaceUri),
      implementations: [Uri.from(implUri)],
    });
  });

  it("should add an interface implementation for an interface that already exists", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri, implUri1)
      .addInterfaceImplementation(interfaceUri, implUri2)
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }
    const expectedInterface = [...config.interfaces.values()][0];

    expect(expectedInterface.interface).toStrictEqual(Uri.from(interfaceUri));
    expect(expectedInterface.implementations).toContainEqual(
      Uri.from(implUri1)
    );
    expect(expectedInterface.implementations).toContainEqual(
      Uri.from(implUri2)
    );
  });

  it("should add different implementations for different interfaces", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";
    const implUri3 = "wrap://ens/interface.impl3.eth";
    const implUri4 = "wrap://ens/interface.impl4.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri1, implUri1)
      .addInterfaceImplementation(interfaceUri2, implUri2)
      .addInterfaceImplementation(interfaceUri1, implUri3)
      .addInterfaceImplementation(interfaceUri2, implUri4)
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 2) {
      fail(["Expected 2 interfaces, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.get(interfaceUri1);
    const interface2 = config.interfaces.get(interfaceUri2);

    expect(interface1).toBeDefined();
    expect(interface1?.implementations).toHaveLength(2);
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri3));

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(2);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri4));
  });

  it("should add multiple implementations for a non-existent interface", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri, [implUri1, implUri2])
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    const expectedInterface = [...config.interfaces.values()][0];

    expect(expectedInterface.interface).toStrictEqual(Uri.from(interfaceUri));
    expect(expectedInterface.implementations).toHaveLength(2);
    expect(expectedInterface.implementations).toContainEqual(
      Uri.from(implUri1)
    );
    expect(expectedInterface.implementations).toContainEqual(
      Uri.from(implUri2)
    );
  });

  it("should add multiple implementations for an existing interface", () => {
    const interfaceUri = "wrap://ens/some.interface.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";
    const implUri3 = "wrap://ens/interface.impl3.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri, [implUri1])
      .addInterfaceImplementations(interfaceUri, [implUri2, implUri3])
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    const expectedInterface = [...config.interfaces.values()][0];

    expect(expectedInterface.interface).toStrictEqual(Uri.from(interfaceUri));
    expect(expectedInterface.implementations).toHaveLength(3);
    expect(expectedInterface.implementations).toContainEqual(
      Uri.from(implUri1)
    );
    expect(expectedInterface.implementations).toContainEqual(
      Uri.from(implUri2)
    );
    expect(expectedInterface.implementations).toContainEqual(
      Uri.from(implUri3)
    );
  });

  it("should add multiple different implementations for different interfaces", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";
    const implUri3 = "wrap://ens/interface.impl3.eth";
    const implUri4 = "wrap://ens/interface.impl4.eth";
    const implUri5 = "wrap://ens/interface.impl5.eth";
    const implUri6 = "wrap://ens/interface.impl6.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementation(interfaceUri1, implUri1)
      .addInterfaceImplementation(interfaceUri2, implUri2)
      .addInterfaceImplementations(interfaceUri1, [implUri3, implUri5])
      .addInterfaceImplementations(interfaceUri2, [implUri4, implUri6])
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 2) {
      fail(["Expected 2 interfaces, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.get(interfaceUri1);
    const interface2 = config.interfaces.get(interfaceUri2);

    expect(interface1).toBeDefined();
    expect(interface1?.implementations).toHaveLength(3);
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri3));
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri5));

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(3);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri4));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri6));
  });

  it("should remove an interface implementation", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri1, [implUri1, implUri2])
      .addInterfaceImplementations(interfaceUri2, [implUri1, implUri2])
      .removeInterfaceImplementation(interfaceUri1, implUri2)
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 2) {
      fail(["Expected 2 interfaces, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.get(interfaceUri1);
    const interface2 = config.interfaces.get(interfaceUri2);

    expect(interface1).toBeDefined();
    expect(interface1?.implementations).toHaveLength(1);
    expect(interface1?.implementations).toContainEqual(Uri.from(implUri1));

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(2);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
  });

  it("should completely remove an interface if there are no implementations left", () => {
    const interfaceUri1 = "wrap://ens/some.interface1.eth";
    const interfaceUri2 = "wrap://ens/some.interface2.eth";
    const implUri1 = "wrap://ens/interface.impl1.eth";
    const implUri2 = "wrap://ens/interface.impl2.eth";

    const config = new ClientConfigBuilder()
      .addInterfaceImplementations(interfaceUri1, [implUri1, implUri2])
      .addInterfaceImplementations(interfaceUri2, [implUri1, implUri2])
      .removeInterfaceImplementation(interfaceUri1, implUri1)
      .removeInterfaceImplementation(interfaceUri1, implUri2)
      .buildPartial();

    if (!config.interfaces || config.interfaces.size !== 1) {
      fail(["Expected 1 interface, received:", config.interfaces]);
    }

    const interface1 = config.interfaces.get(interfaceUri1);
    const interface2 = config.interfaces.get(interfaceUri2);

    expect(interface1).toBeUndefined();

    expect(interface2).toBeDefined();
    expect(interface2?.implementations).toHaveLength(2);
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri1));
    expect(interface2?.implementations).toContainEqual(Uri.from(implUri2));
  });

  it("should add an uri redirect", () => {
    const from = "wrap://ens/from.this.ens";
    const to = "wrap://ens/to.that.ens";

    const config = new ClientConfigBuilder()
      .addUriRedirect(from, to)
      .buildPartial();

    if (!config.redirects || config.redirects.size !== 1) {
      fail(["Expected 1 redirect, received:", config.redirects]);
    }

    expect([...config.redirects.values()]).toContainEqual({
      from: Uri.from(from),
      to: Uri.from(to),
    });
  });

  it("should add two uri redirects with different from uris", () => {
    const from1 = "wrap://ens/from.this1.ens";
    const to1 = "wrap://ens/to.that1.ens";

    const from2 = "wrap://ens/from.this2.ens";
    const to2 = "wrap://ens/to.that2.ens";

    const config = new ClientConfigBuilder()
      .addUriRedirect(from1, to1)
      .addUriRedirect(from2, to2)
      .buildPartial();

    if (!config.redirects || config.redirects.size !== 2) {
      fail(["Expected 2 redirects, received:", config.redirects]);
    }

    const configRedirects = [...config.redirects.values()];

    expect(configRedirects).toContainEqual({
      from: Uri.from(from1),
      to: Uri.from(to1),
    });
    expect(configRedirects).toContainEqual({
      from: Uri.from(from2),
      to: Uri.from(to2),
    });
  });

  it("should overwrite an existing uri redirect if from matches on add", () => {
    const from1 = "wrap://ens/from1.this.ens";
    const from2 = "wrap://ens/from2.this.ens";
    const to1 = "wrap://ens/to.that1.ens";
    const to2 = "wrap://ens/to.that2.ens";

    const config = new ClientConfigBuilder()
      .addUriRedirect(from1, to1)
      .addUriRedirect(from2, to1)
      .addUriRedirect(from1, to2)
      .buildPartial();

    if (!config.redirects || config.redirects.size !== 2) {
      fail(["Expected 2 redirects, received:", config.redirects]);
    }

    const configRedirects = [...config.redirects.values()];

    expect(configRedirects).toContainEqual({
      from: Uri.from(from1),
      to: Uri.from(to2),
    });
    expect(configRedirects).toContainEqual({
      from: Uri.from(from2),
      to: Uri.from(to1),
    });
  });

  it("should remove an uri redirect", () => {
    const from1 = "wrap://ens/from.this1.ens";
    const to1 = "wrap://ens/to.that1.ens";

    const from2 = "wrap://ens/from.this2.ens";
    const to2 = "wrap://ens/to.that2.ens";

    const config = new ClientConfigBuilder()
      .addUriRedirect(from1, to1)
      .addUriRedirect(from2, to2)
      .removeUriRedirect(from1)
      .buildPartial();

    if (!config.redirects || config.redirects.size !== 1) {
      fail(["Expected 1 redirect, received:", config.redirects]);
    }

    expect([...config.redirects.values()]).toContainEqual({
      from: Uri.from(from2),
      to: Uri.from(to2),
    });
  });

  it("should set uri resolver", () => {
    const uriResolver = new NamedUriResolver("ResolverName");

    const config = new ClientConfigBuilder().setResolver(uriResolver).build();

    expect(((config.resolver as unknown) as NamedUriResolver).name).toBe(
      "ResolverName"
    );
  });

  it("should overwrite uri resolver on set when it already exists", () => {
    const uriResolver1 = new NamedUriResolver("first");
    const uriResolver2 = new NamedUriResolver("second");

    const config = new ClientConfigBuilder()
      .setResolver(uriResolver1)
      .setResolver(uriResolver2)
      .build();

    expect(((config.resolver as unknown) as NamedUriResolver).name).toBe(
      "second"
    );
  });
});
