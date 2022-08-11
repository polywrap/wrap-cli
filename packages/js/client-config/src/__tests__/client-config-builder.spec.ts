import { ClientConfigBuilder } from "../ClientConfigBuilder";
import {
  CacheResolver,
  Env,
  InterfaceImplementations,
  PluginModule,
  PluginRegistration,
  RedirectsResolver,
  UriRedirect,
  UriResolver,
} from "@polywrap/core-js";
import {
  sanitizeEnvs,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  sanitizeUriRedirects,
} from "../utils/sanitize";
import { toUri } from "../utils/toUri";

describe("Client config builder", () => {
  const testEnvs: Env[] = [
    { uri: "wrap://ens/test.plugin.one", env: { test: "value" } },
    { uri: "wrap://ens/test.plugin.two", env: { test: "value" } },
  ];

  const testInterfaces: InterfaceImplementations[] = [
    {
      interface: "wrap://ens/test-interface-1.polywrap.eth",
      implementations: ["wrap://ens/test1.polywrap.eth"],
    },
    {
      interface: "wrap://ens/test-interface-2.polywrap.eth",
      implementations: ["wrap://ens/test2.polywrap.eth"],
    },
  ];

  const testPlugins: PluginRegistration[] = [
    {
      uri: "wrap://ens/test1.polywrap.eth",
      plugin: {
        factory: () => ({} as PluginModule<{}>),
        manifest: {
          schema: "",
          implements: [],
        },
      },
    },
    {
      uri: "wrap://ens/test2.polywrap.eth",
      plugin: {
        factory: () => ({} as PluginModule<{}>),
        manifest: {
          schema: "",
          implements: [],
        },
      },
    },
  ];

  const testUriRedirects: UriRedirect[] = [
    {
      from: "wrap://ens/test-one.polywrap.eth",
      to: "wrap://ens/test1.polywrap.eth",
    },
    {
      from: "wrap://ens/test-two.polywrap.eth",
      to: "wrap://ens/test2.polywrap.eth",
    },
  ];

  const testUriResolvers: UriResolver[] = [
    new RedirectsResolver(),
    new CacheResolver(),
  ];

  it("should build an empty config", () => {
    const clientConfig = new ClientConfigBuilder().build();

    expect(clientConfig).toStrictEqual({
      envs: [],
      interfaces: [],
      plugins: [],
      redirects: [],
      uriResolvers: [],
    });
  });

  it("should succesfully add config object and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        envs: testEnvs,
        interfaces: testInterfaces,
        plugins: testPlugins,
        redirects: testUriRedirects,
        uriResolvers: testUriResolvers,
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.envs).toStrictEqual(sanitizeEnvs(testEnvs));
    expect(clientConfig.interfaces).toStrictEqual(
      sanitizeInterfaceImplementations(testInterfaces)
    );
    expect(clientConfig.plugins).toStrictEqual(
      sanitizePluginRegistrations(testPlugins)
    );
    expect(clientConfig.redirects).toStrictEqual(
      sanitizeUriRedirects(testUriRedirects)
    );
    expect(clientConfig.uriResolvers).toStrictEqual(testUriResolvers);
  });

  it("should succesfully add and merge two config objects and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        envs: [testEnvs[0]],
        interfaces: [testInterfaces[0]],
        plugins: [testPlugins[0]],
        redirects: [testUriRedirects[0]],
        uriResolvers: [testUriResolvers[0]],
      })
      .add({
        envs: [testEnvs[1]],
        interfaces: [testInterfaces[1]],
        plugins: [testPlugins[1]],
        redirects: [testUriRedirects[1]],
        uriResolvers: [testUriResolvers[1]],
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.envs).toStrictEqual(sanitizeEnvs(testEnvs));
    expect(clientConfig.interfaces).toStrictEqual(
      sanitizeInterfaceImplementations(testInterfaces)
    );
    expect(clientConfig.plugins).toStrictEqual(
      sanitizePluginRegistrations(testPlugins)
    );
    expect(clientConfig.redirects).toStrictEqual(
      sanitizeUriRedirects(testUriRedirects)
    );
    expect(clientConfig.uriResolvers).toStrictEqual(testUriResolvers);
  });

  it("should successfully add a default config", () => {
    const clientConfig = new ClientConfigBuilder().addDefaults().build();

    expect(clientConfig).toBeTruthy();
  });

  it("should successfully add a plugin", () => {
    const pluginUri = "wrap://ens/some-plugin.polywrap.eth";
    const pluginPackage = testPlugins[0].plugin;

    const config = new ClientConfigBuilder()
      .addPlugin(pluginUri, pluginPackage)
      .build();

    expect(config.plugins).toHaveLength(1);
    expect(config.plugins[0].uri).toStrictEqual(toUri(pluginUri));
    expect(config.plugins[0].plugin).toStrictEqual(pluginPackage);
  });

  it("should successfully add multiple plugins", () => {
    const config = new ClientConfigBuilder()
      .addPlugin(testPlugins[0].uri, testPlugins[0].plugin)
      .addPlugin(testPlugins[1].uri, testPlugins[1].plugin)
      .build();

    expect(config.plugins).toHaveLength(2);
    expect(config.plugins).toContainEqual({
      uri: toUri(testPlugins[0].uri),
      plugin: testPlugins[0].plugin,
    });
    expect(config.plugins).toContainEqual({
      uri: toUri(testPlugins[1].uri),
      plugin: testPlugins[1].plugin,
    });
  });

  it("should succesfully overwrite a plugin", () => {
    const pluginUri = "wrap://ens/some-plugin.polywrap.eth";
    const pluginPackage1 = testPlugins[0].plugin;
    const pluginPackage2 = testPlugins[1].plugin;

    const config = new ClientConfigBuilder()
      .addPlugin(pluginUri, pluginPackage1)
      .addPlugin(pluginUri, pluginPackage2)
      .build();

    expect(config.plugins).toHaveLength(1);
    expect(config.plugins[0].uri).toStrictEqual(toUri(pluginUri));
    expect(config.plugins[0].plugin).not.toStrictEqual(pluginPackage1);
    expect(config.plugins[0].plugin).toStrictEqual(pluginPackage2);
  });

  it("should remove a plugin", () => {
    const config = new ClientConfigBuilder()
      .addPlugin(testPlugins[0].uri, testPlugins[0].plugin)
      .addPlugin(testPlugins[1].uri, testPlugins[1].plugin)
      .removePlugin(testPlugins[0].uri)
      .build();

    expect(config.plugins).toHaveLength(1);

    const remainingPlugin = config.plugins[0];

    expect(remainingPlugin.uri).toStrictEqual(toUri(testPlugins[1].uri));
    expect(remainingPlugin.plugin).toStrictEqual(testPlugins[1].plugin);
  });

  it("should successfully add an env", () => {
    const envUri = "wrap://ens/some-plugin.polywrap.eth";
    const env = {
      foo: "bar",
      baz: {
        biz: "buz",
      },
    };

    const config = new ClientConfigBuilder().addEnv(envUri, env).build();

    expect(config.envs).toHaveLength(1);
    expect(config.envs[0].uri).toStrictEqual(toUri(envUri));
    expect(config.envs[0].env).toStrictEqual(env);
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
      .build();

    const expectedEnv = { ...env1, ...env2 };

    expect(config.envs).toHaveLength(1);
    expect(config.envs[0].uri).toStrictEqual(toUri(envUri));
    expect(config.envs[0].env).toStrictEqual(expectedEnv);
  });

  it("should succesfully add two separate envs", () => {
    const config = new ClientConfigBuilder()
      .addEnv(testEnvs[0].uri, testEnvs[0].env)
      .addEnv(testEnvs[1].uri, testEnvs[1].env)
      .build();

    expect(config.envs).toHaveLength(2);
    expect(config.envs).toContainEqual({
      uri: toUri(testEnvs[0].uri),
      env: testEnvs[0].env,
    });
    expect(config.envs).toContainEqual({
      uri: toUri(testEnvs[1].uri),
      env: testEnvs[1].env,
    });
  });

  it("should remove an env", () => {
    const config = new ClientConfigBuilder()
      .addEnv(testEnvs[0].uri, testEnvs[0].env)
      .addEnv(testEnvs[1].uri, testEnvs[1].env)
      .removeEnv(testEnvs[0].uri)
      .build();

    expect(config.envs).toHaveLength(1);
    expect(config.envs).toContainEqual({
      uri: toUri(testEnvs[1].uri),
      env: testEnvs[1].env,
    });
  });
});
