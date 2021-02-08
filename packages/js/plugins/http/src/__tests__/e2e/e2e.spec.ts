import { Web3ApiClient } from "@web3api/client-js"
import { Uri } from "@web3api/core-js"
import { HttpPlugin } from "../..";
import { Response } from "../../types";
import nock from "nock"

const defaultReplyHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true'
}

describe("e2e tests for HttpPlugin", () => {

  describe("get method", () => {

    test("succesfull request with response type as TEXT", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(200, '{data: "test-response"}')


      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
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
      expect(response.data?.get.headers.length).toEqual(2) // default reply headers
    });

    test("succesfull request with response type as BINARY", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(200, '{data: "test-response"}')


      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
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
      expect(response.data?.get.headers.length).toEqual(2) // default reply headers
    });

    test("succesfull request with query params and request headers", async () => {
      nock("http://www.example.com", { reqheaders: { 'X-Request-Header': "req-foo" } })
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
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


      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
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

    test("succesfull request with response type as TEXT", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .reply(200, '{data: "test-response"}')


      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
        query: `
          mutation {
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
      expect(response.data?.post.headers.length).toEqual(2) // default reply headers
    });

    test("succesfull request with response type as BINARY", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .reply(200, '{data: "test-response"}')


      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
        query: `
          mutation {
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
      expect(response.data?.post.headers.length).toEqual(2) // default reply headers
    });

    test("succesfull request with query params and request headers", async () => {
      nock("http://www.example.com", { reqheaders: { 'X-Request-Header': "req-foo" } })
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
        query: `
          mutation {
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


      const web3ApiClient = new Web3ApiClient({
        redirects: [
          {
            from: new Uri("w3://ens/http.web3api.eth"),
            to: {
              factory: () => new HttpPlugin(),
              manifest: HttpPlugin.manifest(),
            },
          },
        ]
      })

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: new Uri("w3://ens/http.web3api.eth"),
        query: `
          mutation {
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

  })

});
