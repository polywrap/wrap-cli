import { Web3ApiClient } from "@web3api/client-js"
import { httpPlugin } from "../..";
import { Response } from "../../w3";
import nock from "nock"

const defaultReplyHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true'
}

describe("e2e tests for HttpPlugin", () => {
  let web3ApiClient: Web3ApiClient;

  beforeEach(() => {
    web3ApiClient = new Web3ApiClient({
      plugins: [
        {
          uri: "w3://ens/http.web3api.eth",
          plugin: httpPlugin(),
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: 0
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: 1
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: 0
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

    test("failed request because of timeout exided", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .delayConnection(5000)
        .reply(200, '{data: "test-response"}')

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: 0,
                timeout: 1000
              }
            )
          }
        `
      })

      console.log("TIMEOUT EXIDED");
      console.log(response.data);

      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();

      expect(response.data?.get.status).toBeUndefined();
      expect(response.data?.get.body).toBeUndefined();
      expect(response.data?.get.headers).toBeUndefined();

      expect(response.data?.get.error).toBeDefined();
      expect(response.data?.get.error?.errorCode).toBe("ECONNABORTED");
      expect(response.data?.get.error?.errorMessage).toBe("timeout of 1000ms exceeded");
      expect(response.data?.get.error?.timeoutExcided).toBeTruthy();
    });

    test("failed request with 500 status", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .reply(500)


      const web3ApiClient = new Web3ApiClient()

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: 0
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();

      console.log("FAILED WITH 500");
      console.log(response.data);

      expect(response.data?.get.status).toBe(500);
      expect(response.data?.get.body).toBe("");
      expect(response.data?.get.headers).toStrictEqual([
        {key: "access-control-allow-origin", value: "*"},
        {key: "access-control-allow-credentials", value: "true"},
      ]);

      expect(response.data?.get.error).toBeUndefined();
    });

    test("failed request with unknown error", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .replyWithError("Not found")


      const web3ApiClient = new Web3ApiClient()

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            get(
              url: "http://www.example.com/api"
              request: {
                responseType: 0
              }
            )
          }
        `
      })
      expect(response.data).toBeDefined();
      expect(response.errors).toBeUndefined();

      expect(response.data?.get.status).toBeUndefined();
      expect(response.data?.get.body).toBeUndefined();
      expect(response.data?.get.headers).toBeUndefined();

      expect(response.data?.get.error).toBeDefined();
      expect(response.data?.get.error?.errorCode).toBe("UNKNOWNERROR");
      expect(response.data?.get.error?.errorMessage).toBe("Not found");
      expect(response.data?.get.error?.timeoutExcided).toBeFalsy();
    });

  });

  describe("post method", () => {

    test("succesfull request with response type as TEXT", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .reply(200, '{data: "test-response"}')

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: 0
                body: {
                  stringBody: "{data: 'test-request'}",
                  formDataBody: {data: []}
                }
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

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: 1
                body: {
                  stringBody: "{data: 'test-request'}",
                  formDataBody: {data: []}
                }
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

    test("succesfull request with multipart form data", async () => {
      nock("http://www.example.com")
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", (body) => {
          return true
        })
        .reply(200)

      const web3ApiClient = new Web3ApiClient()

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: 1
                body: {
                  formDataBody: {
                    data: [{key: "testfile.txt", data: "Lorem ipsum"}]
                  }
                }
              }
            )
          }
        `
      })

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.post.status).toBe(200)
      // expect(response.data?.get.statusText).toBe("OK")
      // expect(response.data?.post.body).toBe(Buffer.from('{data: "test-response"}').toString('base64'))
      expect(response.data?.post.headers?.length).toEqual(2) // default reply headers
    });

    test("succesfull request with query params and request headers", async () => {
      nock("http://www.example.com", { reqheaders: { 'X-Request-Header': "req-foo" } })
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: 0
                body: {
                  stringBody: "{data: 'test-request'}",
                  formDataBody: {data: []}
                }
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
        query: `
          query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: 0
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
