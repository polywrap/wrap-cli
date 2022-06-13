import { httpPlugin } from "../..";
import { Response } from "../../query/w3";

import { Web3ApiClient } from "@web3api/client-js"
import {
  buildApi
} from "@web3api/test-env-js";
import nock from "nock";

jest.setTimeout(360000)

const defaultReplyHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true'
}

describe("e2e tests for HttpPlugin", () => {

  describe("integration", () => {

    let client: Web3ApiClient;

    const apiPath = `${__dirname}/integration`
    const uri = `fs/${apiPath}/build`

    beforeAll(async () => {
      client = new Web3ApiClient({
        plugins: [
          {
            uri: "w3://ens/http.web3api.eth",
            plugin: httpPlugin({ }),
          },
        ],
      });

      await buildApi(apiPath);
    });

    it("get", async () => {
      nock("http://www.example.com", { reqheaders: { 'X-Request-Header': "req-foo" } })
        .defaultReplyHeaders(defaultReplyHeaders)
        .get("/api")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

      const response = await client.query<{ get: Response }>({
        uri,
        query: `query {
          get(
            url: "http://www.example.com/api"
            request: {
              responseType: TEXT
              urlParams: [{key: "query", value: "foo"}]
              headers: [{key: "X-Request-Header", value: "req-foo"}]
            }
          )
        }`
      });

      expect(response.data).toBeDefined()
      expect(response.errors).toBeUndefined()
      expect(response.data?.get.status).toBe(200)
    });

    it("post", async () => {
      nock("http://www.example.com", { reqheaders: { 'X-Request-Header': "req-foo" } })
        .defaultReplyHeaders(defaultReplyHeaders)
        .post("/api", "{data: 'test-request'}")
        .query({ query: "foo" })
        .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

        const response = await client.query<{ post: Response }>({
          uri,
          query: `query {
            post(
              url: "http://www.example.com/api"
              request: {
                responseType: TEXT
                body: "{data: 'test-request'}"
                urlParams: [{key: "query", value: "foo"}]
                headers: [{key: "X-Request-Header", value: "req-foo"}]
              }
            )
          }`
        });
  
        expect(response.data).toBeTruthy();
        expect(response.errors).toBeFalsy();
  
        expect(response.data?.post.status).toBe(200);
        expect(response.data?.post.body).toBeTruthy();
    });
  });
});
