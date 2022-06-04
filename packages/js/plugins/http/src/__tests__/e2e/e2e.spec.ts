import { httpPlugin } from "../..";
import { Response } from "../../query/w3";
import {
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";

import { Web3ApiClient } from "@web3api/client-js"
import nock from "nock";

jest.setTimeout(360000)

const defaultReplyHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true'
}

describe("e2e tests for HttpPlugin", () => {
  let web3ApiClient: Web3ApiClient;

  beforeAll(async () => {
    await initTestEnvironment();

    web3ApiClient = new Web3ApiClient({
      plugins: [
        {
          uri: "w3://ens/http.web3api.eth",
          plugin: httpPlugin({ query: {} }),
        },
      ]
    });
  })

  afterAll(async () => {
    await stopTestEnvironment();
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

      const response = await web3ApiClient.query<{ post: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

      const response = await web3ApiClient.query<{ get: Response }>({
        uri: "w3://ens/http.web3api.eth",
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

  it.only("queries simple-storage api on local drive", async () => {
    const apiUrl = `https://dawn-leaf-2772.on.fleek.co`
    const apiUri = `http/${apiUrl}`;

    // query api from filesystem
    const deploy = await web3ApiClient.query<{
      deployContract: string;
    }>({
      uri: apiUri,
      query: `
        mutation {
          deployContract(
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(deploy.errors).toBeFalsy();
    expect(deploy.data).toBeTruthy();
    expect(deploy.data?.deployContract.indexOf("0x")).toBeGreaterThan(-1);

    // // get the schema
    // const schema = await web3ApiClient.getSchema(apiUri);
    // const expectedSchema = await fs.promises.readFile(`${fsPath}/schema.graphql`, "utf-8");

    // expect(schema).toBe(expectedSchema);

    // // get the manifest
    // const manifest = await web3ApiClient.getManifest(apiUri, { type: "web3api" });

    // expect(manifest).toBeTruthy();
    // expect(manifest.language).toBe("wasm/assemblyscript");

    // // get a file
    // const file = await web3ApiClient.getFile(apiUri, { path: "web3api.json", encoding: "utf-8" });
    // const expectedFile = await fs.promises.readFile(`${fsPath}/web3api.json`, "utf-8");

    // expect(file).toBe(expectedFile);
  });
});
