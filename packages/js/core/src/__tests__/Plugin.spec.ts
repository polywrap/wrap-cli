import {
  Client,
  Plugin,
  PluginModules,
  PluginModule,
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

class TestPluginQuery extends PluginModule {
  testQuery(_input: unknown, _client: Client): number {
    return 5;
  }
}

class TestPluginMutation extends PluginModule {
  testMutation(_input: unknown, _client: Client): Promise<boolean> {
    return Promise.resolve(true);
  }
}

class TestPlugin implements Plugin {
  public getModules(_client: Client): PluginModules {
    return {
      query: new TestPluginQuery({}),
      mutation: new TestPluginMutation({}),
    };
  }
}

describe("Plugin", () => {
  const plugin = new TestPlugin();

  it("sanity", () => {
    const modules = plugin.getModules({} as Client);

    expect(testPluginManifest.implements.length).toBe(1);
    expect(modules.mutation).toBeTruthy();
    expect(modules.mutation?.getMethod("testMutation")).toBeTruthy();
  });
});
