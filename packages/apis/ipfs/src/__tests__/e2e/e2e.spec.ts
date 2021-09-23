/*
TODO:
- catFile
- catFileToString
- resolve
- uri-resolver methods
*/

import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment
} from "@web3api/test-env-js";
import {
  Web3ApiClient,
  createWeb3ApiClient
} from "@web3api/client-js";
import path from "path";
import fs from "fs";

jest.setTimeout(360000);

describe("e2e", () => {

  let client: Web3ApiClient;
  let ensUri: string;
  let ipfsUri: string;

  beforeAll(async () => {
    // Create Client
    const { ipfs, ensAddress } = await initTestEnvironment();

    client = await createWeb3ApiClient({
      ipfs: {
        provider: ipfs
      },
      ens: {
        addresses: {
          testnet: ensAddress
        },
      },
    });

    // Deploy API
    const apiPath = path.join(__dirname, "/../../../");
    console.log("building");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);

    // Cache the API's URI
    console.log("set")
    ensUri = `/ens/testnet/${api.ensDomain}`;
    console.log(ensUri);
    ipfsUri = `/ipfs/${api.ipfsCid}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("Query", () => {
    it("catFile", async () => {
      const expected = fs.readFileSync(
        `${__dirname}/../../../build/schema.graphql`
      );

      console.log("querying", ensUri)
      const { data, errors } = await client.query<{
        catFile: Uint8Array
      }>({
        uri: ensUri,
        query: `
          query {
            catFile(
              cid: "${ipfsUri}/schema.graphql"
            )
          }
        `
      });

      expect(errors).toBeFalsy();
      expect(data).toBeTruthy();
      expect(data?.catFile?.toString()).toBe(expected.toString());
    });

    /*it("catFileToString", async () => {

    });

    it("uri-resolver interface", async () => {
      // TODO
    });*/
  });

  /*describe("Mutation", () => {
    it("addFile", async () => {
      
    });

    it("addFolder", async () => {

    });
  });*/
});
