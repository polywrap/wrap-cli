import { CoreClient, Uri } from "@polywrap/core-js";
import { buildWrapper } from "@polywrap/test-env-js";
import WS from "jest-websocket-mock";
import { PluginPackage } from "@polywrap/plugin-js";
import { getClient } from "./helpers/getClient";
import { PolywrapClient } from "@polywrap/client-js";

jest.setTimeout(360000);

describe("e2e tests for WsPlugin", () => {
  describe("integration", () => {
    let client: PolywrapClient;
    let server: WS;

    const wrapperPath = `${__dirname}/integration`;
    const uri = `fs/${wrapperPath}/build`;

    beforeAll(async () => {
      client = getClient();

      await buildWrapper(wrapperPath, undefined, true);
    });

    beforeEach(() => {
      server = new WS("ws://localhost:1234");
    });

    afterEach(() => {
      WS.clean();
    });

    it("send", async () => {
      await client.invoke<boolean>({
        uri,
        method: "send",
        args: {
          url: "ws://localhost:1234",
          message: "test",
        },
      });

      await expect(server).toReceiveMessage("test");
      expect(server).toHaveReceivedMessages(["test"]);
    });

    it("callback to plugin", async () => {
      let msgs: string[] = [];

      const memoryPlugin = PluginPackage.from(() => ({
        callback(args: { data: string }, _client: CoreClient): void {
          msgs.push(args.data);
        },
      }));

      client = getClient([
        {
          uri: Uri.from("wrap://ens/memory.polywrap.eth"),
          package: memoryPlugin,
        },
      ]);

      await client.invoke<boolean>({
        uri,
        method: "subscribe",
        args: {
          url: "ws://localhost:1234",
          callback: {
            uri: "wrap://ens/memory.polywrap.eth",
            method: "callback",
          },
        },
      });

      server.send("1");
      server.send("2");

      // wait for callbacks to be called
      await new Promise<void>(async (resolve) => {
        setTimeout(() => resolve(), 1);
      });

      expect(msgs).toEqual(["1", "2"]);
    });

    it("callback to wrapper", async () => {
      let value: Record<string, string> = {};

      const memoryPlugin = PluginPackage.from(() => ({
        set(
          args: { key: string; value: string },
          _client: CoreClient
        ): boolean {
          value[args.key] = args.value;
          return true;
        },
        get(args: { key: string }, _client: CoreClient): string | null {
          return value[args.key] ?? null;
        },
      }));

      client = getClient([
        [
          {
            uri: Uri.from("wrap://ens/memory.polywrap.eth"),
            package: memoryPlugin,
          },
        ],
      ]);

      await client.invoke<boolean>({
        uri,
        method: "subscribeAndSend",
        args: {
          url: "ws://localhost:1234",
          callback: {
            uri,
            method: "callback",
          },
          message: "test",
        },
      });

      server.send("1");

      await expect(server).toReceiveMessage("test");
      expect(server).toHaveReceivedMessages(["test"]);
    });

    it("cache", async () => {
      let t1 = setTimeout(() => {
        server.send("1");
      }, 100);
      let t2 = setTimeout(() => {
        server.send("2");
      }, 200);
      let t3 = setTimeout(() => {
        server.send("3");
      }, 500);

      const response = await client.invoke<boolean>({
        uri,
        method: "get",
        args: {
          url: "ws://localhost:1234",
          timeout: 210,
        },
      });
      if (!response.ok) fail(response.error);

      expect(response.value).toEqual(["1", "2"]);

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    });
  });
});
