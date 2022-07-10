import { ClientConfigBuilder } from "../ClientConfigBuilder";
import { PluginModule, sanitizePluginRegistrations } from "@polywrap/core-js";

describe("Client config builder", () => {
  const testPlugins = [
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

  it("should build an empty config when just building", () => {
    const clientConfig = new ClientConfigBuilder().build();

    expect(clientConfig).toStrictEqual({
      envs: [],
      interfaces: [],
      plugins: [],
      redirects: [],
      uriResolvers: [],
    });
  });

  it("should succesfully add plugins and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        plugins: testPlugins,
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.plugins).toStrictEqual(sanitizePluginRegistrations(testPlugins));
  });

  it("should succesfully add plugins with two separate add calls and build", () => {
    const clientConfig = new ClientConfigBuilder()
      .add({
        plugins: [testPlugins[0]],
      })
      .add({
        plugins: [testPlugins[1]],
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.plugins).toStrictEqual(sanitizePluginRegistrations(testPlugins));
  });

  it("should successfully add a default config", () => {
    const clientConfig = new ClientConfigBuilder().addDefaults().build();

    console.log(clientConfig);
    expect(clientConfig).toBeTruthy();
  });
});
