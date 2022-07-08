import { ClientConfigBuilder } from "../types/ClientConfigBuilder";
import { Uri } from "../.";
import { PluginModule } from "../types";

describe("Client config builder", () => {
  const testPlugins = [
    {
      uri: new Uri("wrap://ens/test1.polywrap.eth"),
      plugin: {
        factory: () => ({} as PluginModule<{}>),
        manifest: {
          schema: "",
          implements: [],
        },
      },
    },
    {
      uri: new Uri("wrap://ens/test2.polywrap.eth"),
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
    const clientConfig = new ClientConfigBuilder<Uri>()
      .add({
        plugins: testPlugins,
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.plugins).toStrictEqual(testPlugins);
  });

  it("should succesfully add plugins with two separate add calls and build", () => {
    const clientConfig = new ClientConfigBuilder<Uri>()
      .add({
        plugins: [testPlugins[0]],
      })
      .add({
        plugins: [testPlugins[1]],
      })
      .build();

    expect(clientConfig).toBeTruthy();
    expect(clientConfig.plugins).toStrictEqual(testPlugins);
  });
});