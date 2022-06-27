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

class TestPluginModule extends PluginModule<{}> {
  testQuery(_args: unknown, _client: Client): number {
    return 5;
  }
  testMutation(_args: unknown, _client: Client): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe("Plugin", () => {
  const plugin = new TestPluginModule({});

  it("sanity", () => {
    expect(testPluginManifest.implements.length).toBe(1);
    expect(plugin).toBeTruthy();
    expect(plugin.getMethod("testMutation")).toBeTruthy();
  });
});
