import { httpPlugin } from "../..";
import { Response } from "../../w3";

import { Web3ApiClient } from "@web3api/client-js"
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";
import axios from "axios";
import nock from "nock";

jest.setTimeout(360000)

const defaultReplyHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-credentials': 'true'
}

describe("e2e tests for HttpPlugin", () => {

  describe("integration", () => {

    let client: Web3ApiClient;
    let uri: string;
    let ensAddress: string;

    beforeAll(async () => {
      const { ethereum, ipfs } = await initTestEnvironment();
      const { data } = await axios.get("http://localhost:4040/deploy-ens");

      ensAddress = data.ensAddress

      client = new Web3ApiClient({
        plugins: [
          {
            uri: "w3://ens/http.web3api.eth",
            plugin: httpPlugin(),
          },
          {
            uri: "w3://ens/ethereum.web3api.eth",
            plugin: ethereumPlugin({
              networks: {
                testnet: {
                  provider: ethereum
                }
              },
              defaultNetwork: "testnet"
            }),
          },
          {
            uri: "w3://ens/ipfs.web3api.eth",
            plugin: ipfsPlugin({
              provider: ipfs,
              fallbackProviders: ["https://ipfs.io"]
            })
          },
          {
            uri: "w3://ens/ens.web3api.eth",
            plugin: ensPlugin({
              addresses: {
                testnet: ensAddress
              }
            })
          }
        ],
      });

      const api = await buildAndDeployApi(
        `${__dirname}/integration`,
        ipfs,
        ensAddress
      );

      uri = `ens/testnet/${api.ensDomain}`;
    });

    afterAll(async () => {
      await stopTestEnvironment();
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
