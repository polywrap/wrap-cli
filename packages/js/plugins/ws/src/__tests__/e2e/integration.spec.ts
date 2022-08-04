import { wsPlugin } from "../..";

import { Client, PluginModule } from "@polywrap/core-js";
import { PolywrapClient } from "@polywrap/client-js"
import {
  buildWrapper
} from "@polywrap/test-env-js";
import WS from "jest-websocket-mock";

jest.setTimeout(360000)

describe("e2e tests for WsPlugin", () => {

  describe("integration", () => {

    let client: PolywrapClient;
    let server: WS;

    const wrapperPath = `${__dirname}/integration`
    const uri = `fs/${wrapperPath}/build`

    beforeAll(async () => {
      client = new PolywrapClient({
        plugins: [
          {
            uri: "wrap://ens/ws.polywrap.eth",
            plugin: wsPlugin({}),
          },
        ],
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
          message: "test"
        }
      })

      await expect(server).toReceiveMessage("test");
      expect(server).toHaveReceivedMessages(["test"]);
    });

    it("callback", async () => {
      let msgs: string[] = []
      class MemoryPlugin extends PluginModule<{}> {
        callback(args: { data: string }, _client: Client): void {
          msgs.push(args.data)
        }
      }
      let memoryPlugin = {
        factory: () => {
          return new MemoryPlugin({})
        },
        manifest: { schema: "", implements: [] },
      }
      client = new PolywrapClient({
        plugins: [
          {
            uri: "wrap://ens/memory.polywrap.eth",
            plugin: memoryPlugin
          },
          {
            uri: "wrap://ens/ws.polywrap.eth",
            plugin: wsPlugin({}),
          },
        ],
      });

      await client.invoke<boolean>({
        uri,
        method: "subscribe",
        args: {
          url: "ws://localhost:1234",
          callback: {
            uri: "wrap://ens/memory.polywrap.eth",
            method: "callback"
          }
        }
      });

      server.send("1")
      server.send("2")

      // wait for callbacks to be called
      await new Promise(async (resolve) => {setTimeout(() => resolve(), 1)})

      expect(msgs).toEqual(["1","2"])
    });

    it("cache", async () => {

      let t1 = setTimeout(() => {
        server.send("1")
      }, 10)
      let t2 = setTimeout(() => {
        server.send("2")
      }, 20)
      let t3 = setTimeout(() => {
        server.send("3")
      }, 30)
      
      const response = await client.invoke<boolean>({
        uri,
        method: "get",
        args: {
          url: "ws://localhost:1234",
          timeout: 20
        }
      });

      expect(response.data).toEqual(["1","2"])

      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    });
  });
});
