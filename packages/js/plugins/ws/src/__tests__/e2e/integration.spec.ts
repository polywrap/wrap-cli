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
    let t1: ReturnType<typeof setTimeout>
    let t2: ReturnType<typeof setTimeout>
    let t3: ReturnType<typeof setTimeout>

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
      t1 = setTimeout(() => {
        server.send("hi")
      }, 100)
      t2 = setTimeout(() => {
        server.send("hi2")
      }, 200)
      t3 = setTimeout(() => {
        server.send("hi3")
      }, 300)
    });

    afterEach(() => {
      WS.clean();
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    });

    it("send", async () => {

      await client.invoke<boolean>({
        uri,
        method: "send",
        args: {
          url: "ws://localhost:1234",
          message: "hello"
        }
      })

      await expect(server).toReceiveMessage("hello");
      expect(server).toHaveReceivedMessages(["hello"]);
    });

    it("subscribe", async () => {
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
      
      await new Promise(async (resolve) => {setTimeout(() => resolve(), 250)})

      expect(msgs).toEqual(["hi","hi2"])
    });

    it("receive", async () => {

      const response = await client.invoke<boolean>({
        uri,
        method: "get",
        args: {
          url: "ws://localhost:1234",
          message: "hello"
        }
      });

      await new Promise(async (resolve) => {setTimeout(() => resolve(), 300)})

      expect(response.data).toEqual(["hi","hi2"])

    });
  });
});
