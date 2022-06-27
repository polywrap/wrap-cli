import { Client, PluginModule } from "@polywrap/core-js";
import { PolywrapClient } from "../..";

describe("plugin-subinvoke", () => {
  const mockPlugin = () => {
    class MockPlugin extends PluginModule<Record<string, unknown>> {
      public async call(
        args: { input: Uint8Array },
        client: Client
      ): Promise<ArrayBuffer> {
        const res = await client.invoke({
          uri: "ens/is-even.eth",
          method: "isEven",
          args: args.input,
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

  const isEvenPlugin = () => {
    class IsEvenPlugin extends PluginModule<Record<string, unknown>> {
      public isEven(args: {num: number}, client: Client): boolean {
        return (args.num & 1) ? false : true;
      }
    }

    return {
      factory: () => new IsEvenPlugin({}),
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
        {
          uri: "ens/is-even.eth",
          plugin: isEvenPlugin(),
        }
      ],
    });

    // msgpackEncode({num: 10000}) -> [129, 163, 110, 117, 109, 205, 39, 16]
    const input = Uint8Array.from([129, 163, 110, 117, 109, 205, 39, 16])

    const result = await client.invoke({
      uri: "ens/demo.eth",
      method: "call",
      args: {
        input,
      },
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
  });
});
