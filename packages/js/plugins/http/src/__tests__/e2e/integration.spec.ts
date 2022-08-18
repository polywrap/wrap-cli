import { httpPlugin } from "../..";
import { Response } from "../../wrap-man";

import { PolywrapClient } from "@polywrap/client-js";
import { buildWrapper } from "@polywrap/test-env-js";
import nock from "nock";

jest.setTimeout(360000);

const defaultReplyHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-credentials": "true",
};

describe("e2e tests for HttpPlugin", () => {
  describe("integration", () => {
    let client: PolywrapClient;

    const wrapperPath = `${__dirname}/integration`;
    const uri = `fs/${wrapperPath}/build`;

    beforeAll(async () => {
      client = new PolywrapClient({
        plugins: [
          {
            uri: "wrap://ens/http.polywrap.eth",
            plugin: httpPlugin({}),
          },
        ],
      });

      await buildWrapper(wrapperPath);
    });

    it("get", async () => {
      nock("http://www.example.com", {
        reqheaders: { "X-Request-Header": "req-foo" },
      })
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', {
          "X-Response-Header": "resp-foo",
        });

      const response = await client.invoke<Response>({
        uri,
        method: "get",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "TEXT",
            urlParams: new Map([["query", "foo"]]),
            headers: new Map([["X-Request-Header", "req-foo"]]),
          },
        },
      });

      expect(response.error).toBeUndefined();
      expect(response.data).toBeDefined();
      expect(response.data?.status).toBe(200);
    });

    it("post", async () => {
      nock("http://www.example.com", {
        reqheaders: { "X-Request-Header": "req-foo" },
      })
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', {
          "X-Response-Header": "resp-foo",
        });

      const response = await client.invoke<Response>({
        uri,
        method: "post",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "TEXT",
            body: "{data: 'test-request'}",
            urlParams: { query: "foo" },
            headers: new Map([["X-Request-Header", "req-foo"]]),
          },
        },
      });

      expect(response.error).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data?.status).toBe(200);
      expect(response.data?.body).toBeTruthy();
    });
  });
});
