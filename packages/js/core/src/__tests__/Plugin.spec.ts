import {
  Client,
  PluginModule,
} from "..";

class TestPluginModule extends PluginModule<{}> {
  testQuery(args: { value: number }, _client: Client): number {
    return 5 + args.value;
  }
  testMutation(_args: unknown, _client: Client): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe("Plugin", () => {
  const plugin = new TestPluginModule({});

  it("sanity", async () => {
    expect(plugin).toBeTruthy();
    expect(plugin.getMethod("testMutation")).toBeTruthy();
    expect (
      await plugin._wrap_invoke("testQuery", { value: 5 }, {} as Client)
    ).toBe(10);
  });
});
