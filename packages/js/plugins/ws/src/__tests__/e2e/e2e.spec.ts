import { wsPlugin } from "../..";
import { Message } from "../../wrap";

import WS from "jest-websocket-mock";
import { PolywrapClient } from "@polywrap/client-js"
import { Client } from "@polywrap/core-js";
import { buildUriResolver } from "@polywrap/uri-resolvers-js";
import { PluginPackage } from "@polywrap/plugin-js";

describe("WebSocket plugin", () => {
  let polywrapClient: PolywrapClient;
  let server: WS;
  let t1: ReturnType<typeof setTimeout>;
  let t2: ReturnType<typeof setTimeout>;
  let t3: ReturnType<typeof setTimeout>;

  const setup = () => {
    polywrapClient = new PolywrapClient({
      resolver: buildUriResolver([
        {
          uri: "wrap://ens/ws.polywrap.eth",
          package: wsPlugin({}),
        },
      ]),
    });
    server = new WS("ws://localhost:1234");
    t1 = setTimeout(() => {
      server.send("1");
    }, 100);
    t2 = setTimeout(() => {
      server.send("2");
    }, 200);
    t3 = setTimeout(() => {
      server.send("3");
    }, 300);
  };

  const teardown = () => {
    WS.clean();
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
  };

  describe("init", () => {
    beforeEach(() => {
      setup();
    });

    afterEach(() => {
      teardown();
    });

    it("should open a websocket connection", async () => {
      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await server.connected;
    });

    it("should return after timeout if connection can't be opened", async () => {
      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1235",
          timeout: 50,
        },
      });
    });

    it("should close a websocket connection", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "close",
        args: {
          id,
        },
      });

      await server.closed;
    });
  });

  describe("send", () => {
    beforeEach(() => {
      setup();
    });

    afterEach(() => {
      teardown();
    });

    it("should send a message to the server", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "send",
        args: {
          id,
          message: "test",
        },
      });

      await expect(server).toReceiveMessage("test");
      expect(server).toHaveReceivedMessages(["test"]);
    });
  });

  describe("callback", () => {
    let msgs: string[] = [];

    beforeEach(() => {
      setup();

      const callbackPlugin = PluginPackage.from(() => ({
        callback(args: { data: string }, _client: Client): void {
          msgs.push(args.data);
        }
      }));

      polywrapClient = new PolywrapClient({
        resolver: buildUriResolver([
          {
            uri: "wrap://ens/ws.polywrap.eth",
            package: wsPlugin({}),
          },
          {
            uri: "wrap://ens/stub.polywrap.eth",
            package: callbackPlugin,
          },
        ]),
      });
    });

    afterEach(() => {
      teardown();
      msgs = [];
    });

    it("should pass messages to a callback", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCallback",
        args: {
          id,
          callback: {
            uri: "wrap://ens/stub.polywrap.eth",
            method: "callback",
          },
        },
      });

      await new Promise<void>(async (resolve) => {
        setTimeout(() => resolve(), 250);
      });

      expect(msgs).toEqual(["1", "2"]);
    });

    it("should remove callback", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCallback",
        args: {
          id,
          callback: {
            uri: "wrap://ens/stub.polywrap.eth",
            method: "callback",
          },
        },
      });

      await new Promise(async (resolve) => {
        setTimeout(async () => {
          await polywrapClient.invoke({
            uri: "wrap://ens/ws.polywrap.eth",
            method: "removeCallback",
            args: {
              id,
              callback: {
                uri: "wrap://ens/stub.polywrap.eth",
                method: "callback",
              },
            },
          });
          resolve();
        }, 250);
      });

      await new Promise(async (resolve) => {
        setTimeout(() => resolve(), 250);
      });

      expect(msgs).toEqual(["1", "2"]);
    });
  });

  describe("cache", () => {
    beforeEach(() => {
      setup();
    });

    afterEach(() => {
      teardown();
    });

    it("should receive a message", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCache",
        args: {
          id,
        },
      });

      await new Promise(async (resolve) => {
        setTimeout(() => resolve(), 250);
      });

      const response = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
        },
      });

      let data = response?.data?.map((msg) => msg.data);
      expect(data).toEqual(["1", "2"]);
    });

    it("should remove cache callback", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCache",
        args: {
          id,
        },
      });

      await new Promise(async (resolve) => {
        setTimeout(async () => {
          await polywrapClient.invoke({
            uri: "wrap://ens/ws.polywrap.eth",
            method: "removeCache",
            args: {
              id,
            },
          });
          resolve();
        }, 200);
      });

      await new Promise(async (resolve) => {
        setTimeout(() => resolve(), 250);
      });

      const response = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
        },
      });

      let data = response?.data?.map((msg) => msg.data);
      expect(data).toEqual(["1", "2"]);
    });

    it("should receive messages when a timeout is reached", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCache",
        args: {
          id,
        },
      });

      const response = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
          timeout: 250,
        },
      });

      let data = response?.data?.map((msg) => msg.data);
      expect(data).toEqual(["1", "2"]);
    });

    it("should receive messages when min is reached", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCache",
        args: {
          id,
        },
      });

      const response = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
          min: 2,
        },
      });

      let data = response?.data?.map((msg) => msg.data);
      expect(data).toEqual(["1", "2"]);
    });

    it("should reach timeout before min", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCache",
        args: {
          id,
        },
      });

      const response = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
          timeout: 110,
          min: 2,
        },
      });

      let data = response?.data?.map((msg) => msg.data);
      expect(data).toEqual(["1"]);
    });

    it("should reach min before timeout", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCache",
        args: {
          id,
        },
      });

      const response = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
          timeout: 300,
          min: 1,
        },
      });

      let data = response?.data?.map((msg) => msg.data);
      expect(data).toEqual(["1"]);
    });

    it("should receive messages in batches", async () => {
      const { data: id } = await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "open",
        args: {
          url: "ws://localhost:1234",
        },
      });

      await polywrapClient.invoke({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "addCache",
        args: {
          id,
        },
      });

      await new Promise(async (resolve) => {
        setTimeout(() => resolve(), 250);
      });

      const response1 = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
        },
      });

      await new Promise(async (resolve) => {
        setTimeout(() => resolve(), 100);
      });

      const response2 = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
        },
      });

      await new Promise(async (resolve) => {
        setTimeout(() => resolve(), 100);
      });

      const response3 = await polywrapClient.invoke<Message[]>({
        uri: "wrap://ens/ws.polywrap.eth",
        method: "receive",
        args: {
          id,
        },
      });

      let data1 = response1?.data?.map((msg) => msg.data);
      expect(data1).toEqual(["1", "2"]);

      let data2 = response2?.data?.map((msg) => msg.data);
      expect(data2).toEqual(["3"]);

      let data3 = response3?.data?.map((msg) => msg.data);
      expect(data3).toEqual([]);
    });
  });
});
