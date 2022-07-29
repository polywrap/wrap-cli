import { httpPlugin } from "../..";
import { Http_Response } from "../../wrap";

import { PolywrapClient } from "@polywrap/client-js"
import nock from "nock";

jest.setTimeout(360000)

const defaultReplyHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true'
}

describe("e2e tests for HttpPlugin", () => {
  let polywrapClient: PolywrapClient;

  beforeEach(() => {
    polywrapClient = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/http.polywrap.eth",
          plugin: httpPlugin({ }),
        },
      ]
    });
  });

  describe("get method", () => {

    test("succesfull request with response type as TEXT", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(200, '{data: "test-response"}')

      const response = await polywrapClient.query<{ get: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: TEXT
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.get.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      expect(response.data?.get.body).toBe('{data: "test-response"}')
      expect(response.data?.get.headers?.length).toEqual(2) // default reply headers
    });

    test("succesfull request with response type as BINARY", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(200, '{data: "test-response"}')

      const response = await polywrapClient.query<{ get: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: BINARY
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.get.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      expect(response.data?.get.body).toBe(Buffer.from('{data: "test-response"}').toString('base64'))
      expect(response.data?.get.headers?.length).toEqual(2) // default reply headers
    });

    test("succesfull request with query params and request headers", async () => {
      nock("http://www.example.com", { reqheaders: { 'X-Request-Header': "req-foo" } })
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

      const response = await polywrapClient.query<{ get: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: TEXT
                urlParams: [{key: "query", value: "foo"}]
                headers: [{key: "X-Request-Header", value: "req-foo"}]
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.get.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      expect(response.data?.get.body).toBe('{data: "test-response"}')
      expect(response.data?.get.headers).toEqual([
        { key: "x-response-header", value: "resp-foo" },
        { key: "access-control-allow-origin", value: "*" },
        { key: "access-control-allow-credentials", value: "true" }
      ])
    });

    test("failed request", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(404)

      const response = await polywrapClient.query<{ get: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: TEXT
              }
            )
          }
        `
      })

      expect(response.data?.get).toBeUndefined()
      expect(response.errors).toBeDefined()
    });

  });

  describe("post method", () => {

    test("succesfull request with request type as application/json", async () => {
      const reqPayload = {
        data: "test-request",
      };
      const reqPayloadStringified = JSON.stringify(reqPayload);
      
      const resPayload = {
        data: "test-response"
      };
      const resPayloadStringfified = JSON.stringify(resPayload);

      nock("http://www.example.com")
          .defaultReplyHeaders(defaultReplyHeaders)
          .post("/api", reqPayloadStringified)
          .reply(200, resPayloadStringfified)

      const response = await polywrapClient.query<{ post: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                headers: [
                  { key: "Content-Type", value: "application/json" },
                ],
                responseType: TEXT
                body: "{\\"data\\":\\"test-request\\"}"
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.post.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      expect(response.data?.post.body).toBe(resPayloadStringfified)
      expect(response.data?.post.headers?.length).toEqual(2) // default reply headers
    });

    test("succesfull request with response type as TEXT", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .reply(200, '{data: "test-response"}')

      const response = await polywrapClient.query<{ post: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: TEXT
                body: "{data: 'test-request'}"
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.post.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      expect(response.data?.post.body).toBe('{data: "test-response"}')
      expect(response.data?.post.headers?.length).toEqual(2) // default reply headers
    });

    test("succesfull request with response type as BINARY", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .reply(200, '{data: "test-response"}')

      const response = await polywrapClient.query<{ post: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: BINARY
                body: "{data: 'test-request'}"
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.post.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      expect(response.data?.post.body).toBe(Buffer.from('{data: "test-response"}').toString('base64'))
      expect(response.data?.post.headers?.length).toEqual(2) // default reply headers
    });

    test("succesfull request with query params and request headers", async () => {
      nock("http://www.example.com", { reqheaders: { 'X-Request-Header': "req-foo" } })
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

      const response = await polywrapClient.query<{ post: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: TEXT
                body: "{data: 'test-request'}"
                urlParams: [{key: "query", value: "foo"}]
                headers: [{key: "X-Request-Header", value: "req-foo"}]
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.post.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      expect(response.data?.post.body).toBe('{data: "test-response"}')
      expect(response.data?.post.headers).toEqual([
        { key: "x-response-header", value: "resp-foo" },
        { key: "access-control-allow-origin", value: "*" },
        { key: "access-control-allow-credentials", value: "true" }
      ])
    });

    test("failed request", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api")
        .reply(404)

      const response = await polywrapClient.query<{ get: Http_Response }>({
        uri: "wrap://ens/http.polywrap.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: TEXT
              }
            )
          }
        `
      })

      expect(response.data?.get).toBeUndefined()
      expect(response.errors).toBeDefined()
    });

  });
});
