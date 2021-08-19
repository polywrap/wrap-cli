import {
  Client,
  Plugin,
  PluginModules,
  PluginPackageManifest,
  Uri,
} from "..";

const testPluginManifest: PluginPackageManifest = {
  schema: `
    type Query {
      testQuery: Number!
    }

    type Mutation {
      testMutation: Boolean!
    }
  `,
  implements: [new Uri("host2/path2")],
};

class TestPlugin extends Plugin {
  public getModules(_client: Client): PluginModules {
    return {
      query: {
        testQuery: (_input: unknown, _client: Client): number => {
          return 5;
        },
      },
      mutation: {
        testMutation: (_input: unknown, _client: Client): Promise<boolean> => {
          return Promise.resolve(true);
        },
      },
    };
  }
}

describe("Plugin", () => {
  const plugin = new TestPlugin();

  it("sanity", () => {
    const modules = plugin.getModules({} as Client);

    expect(testPluginManifest.implements.length).toBe(1);
    expect(modules.mutation).toBeTruthy();
    expect(modules.mutation?.testMutation).toBeTruthy();
  });
});
