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
          name: "test",
          abi: {},
          type: "plugin",
          version: "0.1"
        },
      },
    },
    {
      uri: "wrap://ens/test2.polywrap.eth",
      plugin: {
        factory: () => ({} as PluginModule<{}>),
        manifest: {
          name: "test",
          abi: {},
          type: "plugin",
          version: "0.1"
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
        uriResolvers: [testUriResolvers[1]],      })
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
});
