import {
  Client,
  PluginModule,
  PluginPackageManifest,
  Uri,
} from "..";

const testPluginManifest: PluginPackageManifest = {
  schema: `
    type Module {
      testQuery: Number!
      testMutation: Boolean!
    }
  `,
  implements: [new Uri("host2/path2")],
};

class TestPluginModule extends PluginModule {
  testQuery(_input: unknown, _client: Client): number {
    return 5;
  }
  testMutation(_input: unknown, _client: Client): Promise<boolean> {
    return Promise.resolve(true);
  }
}

class TestPlugin implements Plugin {
  public getModule(): PluginModule {
    return new TestPluginModule({})
  }
}

describe("Plugin", () => {
  const plugin = new TestPlugin();

  it("sanity", () => {
    const module = plugin.getModule();

    expect(testPluginManifest.implements.length).toBe(1);
    expect(module).toBeTruthy();
    expect(module.getMethod("testMutation")).toBeTruthy();
  });
});
