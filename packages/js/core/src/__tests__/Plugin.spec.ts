import {
  Client,
  PluginModule
} from "..";
import { ResultOk } from "@polywrap/result";

class TestPluginModule extends PluginModule<{}> {
  testMethod(args: { value: number }, _client: Client): number {
    return 5 + args.value;
  }
}

describe("Plugin", () => {
  const plugin = new TestPluginModule({});

  it("sanity", async () => {
    expect(plugin).toBeTruthy();
    expect (
      await plugin._wrap_invoke("testMethod", { value: 5 }, {} as Client)
    ).toStrictEqual(ResultOk(10));
  });
});
