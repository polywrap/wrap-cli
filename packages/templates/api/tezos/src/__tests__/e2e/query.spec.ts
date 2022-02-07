import path from "path"
import { Web3ApiClient } from "@web3api/client-js"
import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js"

import * as QuerySchema from "../../query/w3"
import { getPlugins } from "../testUtils"

jest.setTimeout(150000)

describe("TestCode", () => {
  let client: Web3ApiClient;
  let ensUri: string;

  beforeAll(async () => {
    const { ensAddress, ethereum, ipfs } = await initTestEnvironment();
    const apiPath = path.join(__dirname, "/../../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    client = new Web3ApiClient({
        plugins: getPlugins(ipfs, ensAddress, ethereum),
    })
  })

  afterAll(async () => {
    await stopTestEnvironment()
  })

  it("Test's Codes goes in here", async () => {
    const response =  await client.query<{ getBalanceOf: QuerySchema.GetBalanceResponse}>({
      uri: ensUri,
      query: `
        query {
          getBalanceOf(
            network: mainnet,
            sample_param: $sample_param, 
          )
        }
      `,
      variables: {
        sample_param: "",
      }
    })

    expect(response.errors).toBeUndefined()
    expect(response.data).toBeDefined()

  })

})