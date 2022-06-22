import { Client, PluginModule } from "@polywrap/core-js";
import { PolywrapClient } from "../..";

describe("plugin-subinvoke", () => {
  const mockPlugin = () => {
    class MockPlugin extends PluginModule<Record<string, unknown>> {
      public async call(input: {input: Uint8Array}, client: Client): Promise<ArrayBuffer> {
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

    const result = await client.invoke({
      uri: "ens/demo.eth",
      method: "call",
      input: {
        input: Uint8Array.from([
          130, 163, 117, 114, 108, 217,  42, 104, 116, 116, 112, 115,
           58,  47,  47, 106, 115, 111, 110, 112, 108,  97,  99, 101,
          104, 111, 108, 100, 101, 114,  46, 116, 121, 112, 105,  99,
          111, 100, 101,  46,  99, 111, 109,  47, 112, 111, 115, 116,
          115, 167, 114, 101, 113, 117, 101, 115, 116, 132, 167, 104,
          101,  97, 100, 101, 114, 115, 144, 169, 117, 114, 108,  80,
           97, 114,  97, 109, 115, 144, 172, 114, 101, 115, 112, 111,
          110, 115, 101,  84, 121, 112, 101,   0, 164,  98, 111, 100,
          121, 160
        ])
      },
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
  });
});
