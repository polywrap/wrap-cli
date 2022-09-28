import { wsPlugin } from "../..";

import { Client } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import WS from "jest-websocket-mock";
import { buildUriResolver } from "@polywrap/uri-resolvers-js";
import { PluginPackage } from "@polywrap/plugin-js";

jest.setTimeout(360000);

describe("e2e tests for WsPlugin", () => {
  describe("integration", () => {
    let client: PolywrapClient;
    let server: WS;

    const wrapperPath = `${__dirname}/integration`;
    const uri = `fs/${wrapperPath}/build`;

    beforeAll(async () => {
      client = new PolywrapClient({
        resolver: buildUriResolver([
          {
            uri: "wrap://ens/ws.polywrap.eth",
            package: wsPlugin({}),
          },
        ]),
      });

      await buildWrapper(wrapperPath);
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
        callback(args: { data: string }, _client: Client): void {
          msgs.push(args.data);
        },
      }));

      client = new PolywrapClient({
        resolver: buildUriResolver([
          {
            uri: "wrap://ens/memory.polywrap.eth",
            package: memoryPlugin,
          },
          {
            uri: "wrap://ens/ws.polywrap.eth",
            package: wsPlugin({}),
          },
        ]),
      });

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
        set(args: { key: string; value: string }, _client: Client): boolean {
          value[args.key] = args.value;
          return true;
        },
        get(args: { key: string }, _client: Client): string | null {
          return value[args.key] ?? null;
        },
      }));

      client = new PolywrapClient({
        resolver: buildUriResolver([
          {
            uri: "wrap://ens/memory.polywrap.eth",
            package: memoryPlugin,
          },
          {
            uri: "wrap://ens/ws.polywrap.eth",
            package: wsPlugin({}),
          },
        ]),
      });

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
      }, 10);
      let t2 = setTimeout(() => {
        server.send("2");
      }, 20);
      let t3 = setTimeout(() => {
        server.send("3");
      }, 30);

      const response = await client.invoke<boolean>({
        uri,
        method: "get",
        args: {
          url: "ws://localhost:1234",
          timeout: 20,
        },
      });
      if (!response.ok) fail(response.error);

      expect(response.value).toEqual(["1","2"])

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    });
  });
});
