import { Client, msgpackEncode, PluginModule } from "@polywrap/core-js";
import { PolywrapClient } from "../..";

describe("plugin-subinvoke", () => {
  const mockPlugin = () => {
    class MockPlugin extends PluginModule<Record<string, unknown>> {
      public async call(
        input: { input: Uint8Array },
        client: Client
      ): Promise<ArrayBuffer> {
        const res = await client.invoke({
          uri: "ens/http.polywrap.eth",
          method: "get",
          input: input.input,
          noDecode: true,
        });
        return res.data as ArrayBuffer;
      }
    }

    return {
      factory: () => new MockPlugin({}),
      manifest: {
        schema: ``,
        implements: [],
      },
    };
  };

  test("call", async () => {
    const client = new PolywrapClient({
      plugins: [
        {
          uri: "ens/demo.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const input = new Uint8Array(
      msgpackEncode({
        url: "https://jsonplaceholder.typicode.com/posts",
        request: {
          headers: [],
          urlParams: [],
          responseType: 0,
          body: "",
        },
      })
    );

    const result = await client.invoke({
      uri: "ens/demo.eth",
      method: "call",
      input: {
        input,
      },
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
  });
});
