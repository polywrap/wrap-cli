import { httpPlugin } from "../..";
import { Http_Response } from "../../wrap";

import { PolywrapClient } from "@polywrap/client-js";
import { UriResolver } from "@polywrap/uri-resolvers-js";

import nock from "nock";
import { WrapError } from "@polywrap/core-js";
import { initTestEnvironment, stopTestEnvironment, providers } from "@polywrap/test-env-js";

jest.setTimeout(360000);

const defaultReplyHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-credentials": "true",
};

describe("e2e tests for HttpPlugin", () => {
  let polywrapClient: PolywrapClient;

  beforeAll(async () => {
    await initTestEnvironment();
  });

  beforeEach(() => {
    polywrapClient = new PolywrapClient(
      {
        resolver: UriResolver.from({
          uri: "wrap://ens/http.polywrap.eth",
          package: httpPlugin({}),
        }),
      },
      { noDefaults: true }
    );
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("get method", () => {
    test("successful request with response type as TEXT", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(200, '{data: "test-response"}');

      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "get",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "TEXT",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe('{data: "test-response"}');
      expect(response.value?.headers?.size).toEqual(2); // default reply headers
    });

    test("successful request with response type as BINARY", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(200, '{data: "test-response"}');

      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "get",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "BINARY",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe(
        Buffer.from('{data: "test-response"}').toString("base64")
      );
      expect(response.value?.headers?.size).toEqual(2); // default reply headers
    });

    test("successful request with query params and request headers", async () => {
      nock("http://www.example.com", {
        reqheaders: { "X-Request-Header": "req-foo" },
      })
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', {
          "X-Response-Header": "resp-foo",
        });

      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
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

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe('{data: "test-response"}');
      expect(response.value?.headers).toEqual(
        new Map([
          ["x-response-header", "resp-foo"],
          ["access-control-allow-origin", "*"],
          ["access-control-allow-credentials", "true"],
        ])
      );
    });

    test("failed request", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(404);

      let response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "get",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "TEXT",
          },
        },
      });

      response = response as { ok: false; error: WrapError | undefined };
      expect(response.error).toBeDefined();
      expect(response.ok).toBeFalsy();
    });
  });

  describe("post method", () => {
    test("successful request with request type as application/json", async () => {
      const reqPayload = {
        data: "test-request",
      };
      const reqPayloadStringified = JSON.stringify(reqPayload);

      const resPayload = {
        data: "test-response",
      };
      const resPayloadStringfified = JSON.stringify(resPayload);

      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", reqPayloadStringified)
        .reply(200, resPayloadStringfified);

      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "post",
        args: {
          url: "http://www.example.com/api",
          request: {
            headers: new Map([["Content-Type", "application/json"]]),
            responseType: "TEXT",
            body: `{\"data\":\"test-request\"}`,
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe(resPayloadStringfified);
      expect(response.value?.headers?.size).toEqual(2); // default reply headers
    });

    test("successful request with response type as TEXT", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .reply(200, '{data: "test-response"}');

      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "post",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "TEXT",
            body: "{data: 'test-request'}",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe('{data: "test-response"}');
      expect(response.value?.headers?.size).toEqual(2); // default reply headers
    });

    test("successful request with response type as BINARY", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .reply(200, '{data: "test-response"}');

      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "post",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "BINARY",
            body: "{data: 'test-request'}",
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe(
        Buffer.from('{data: "test-response"}').toString("base64")
      );
      expect(response.value?.headers?.size).toEqual(2); // default reply headers
    });

    test("successful request with query params and request headers", async () => {
      nock("http://www.example.com", {
        reqheaders: { "X-Request-Header": "req-foo" },
      })
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', {
          "X-Response-Header": "resp-foo",
        });

      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "post",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "TEXT",
            body: "{data: 'test-request'}",
            urlParams: new Map([["query", "foo"]]),
            headers: new Map([["X-Request-Header", "req-foo"]]),
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe('{data: "test-response"}');
      expect(response.value?.headers).toEqual(
        new Map([
          ["x-response-header", "resp-foo"],
          ["access-control-allow-origin", "*"],
          ["access-control-allow-credentials", "true"],
        ])
      );
    });

    test("failed request", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api")
        .reply(404);

      let response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "post",
        args: {
          url: "http://www.example.com/api",
          request: {
            responseType: "TEXT",
          },
        },
      });

      response = response as { ok: false; error: WrapError | undefined };
      expect(response.error).toBeDefined();
      expect(response.ok).toBeFalsy();
    });

    test("successful request with form-data (simple)", async () => {
      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "post",
        args: {
          url: `${providers.ipfs}/api/v0/add`,
          request: {
            responseType: "TEXT",
            formData:[{
              name:"test.txt",
              value:"QSBuZXcgc2FtcGxlIGZpbGU=",
              fileName:"test.txt",
              type:"application/octet-stream"
            }],
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);
      expect(response.value?.body).toBe(JSON.stringify({
        Name: "test.txt",
        Hash: "Qmawvzw32Jq7RbMw2K8axEbzfNK74NPynBoq4tJnWvkYqP",
        Size: "25"
      }));
    });

    test("successful request with form-data (complex)", async () => {
      const response = await polywrapClient.invoke<Http_Response>({
        uri: "wrap://ens/http.polywrap.eth",
        method: "post",
        args: {
          url: `${providers.ipfs}/api/v0/add`,
          request: {
            responseType: "TEXT",
            formData:[
              { name: "file_0.txt", value: "ZmlsZV8w", fileName: "file_0.txt", type: "application/octet-stream" },
              { name: "file_1.txt", value: "ZmlsZV8x",fileName: "file_1.txt", type: "application/octet-stream" },
              { name: "directory_A", value: null, fileName: "directory_A", type: "application/x-directory" },
              { name: "directory_A/file_A_0.txt", value: "ZmlsZV9BXzA=", fileName: "directory_A%2Ffile_A_0.txt", type: "application/octet-stream" },
              { name: "directory_A/file_A_1.txt", value: "ZmlsZV9BXzE=", fileName: "directory_A%2Ffile_A_1.txt", type: "application/octet-stream" }
            ],
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeDefined();
      expect(response.value?.status).toBe(200);

      const results = response.value?.body?.trim()
        .split("\n")
        .map((v) => JSON.parse(v));

      expect(results).toStrictEqual([
        {
          Name: "file_0.txt",
          Hash: "QmV3uDt3KhEYchouUzEbfz7FBA2c2LvNo76dxLLwJW76b1",
          Size: "14"
        },
        {
          Name: "file_1.txt",
          Hash: "QmYwMByE4ibjuMu2nRYRfBweJGJErjmMXfZ92srKhYfq5f",
          Size: "14"
        },
        {
          Name: "directory_A/file_A_0.txt",
          Hash: "QmeYp73qnn8EdogE4d6BhQCHtep7dkRC8FgdE3Qbo4nY9c",
          Size: "16"
        },
        {
          Name: "directory_A/file_A_1.txt",
          Hash: "QmWetZjwHWuGsDyxX6ae5wGS68mFTXC5x61H1TUNxqBXzn",
          Size: "16"
        },
        {
          Name: "directory_A",
          Hash: "Qmb5XsySizDeTn1kvNbyiiNy9eyg3Lb6EwGjQt7iiKBxoL",
          Size: "144"
        },
      ]);
    });
  });
});
