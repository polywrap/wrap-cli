import { Web3ApiClient } from "@web3api/client-js";
import {
  buildApi,
  initTestEnvironment,
  stopTestEnvironment,
  providers,
  ensAddresses
} from "@web3api/test-env-js";
import * as App from "../types/w3";
import path from "path";

import { getPlugins } from "../utils";

jest.setTimeout(500000);

describe("SimpleStorage", () => {
  const CONNECTION = { networkNameOrChainId: "testnet" };

  let client: Web3ApiClient;

  const apiPath: string = path.join(
    path.resolve(__dirname),
    "..",
    "..",
    ".."
  );
  const apiUri = `fs/${apiPath}/build`;

  beforeAll(async () => {
    await initTestEnvironment();

    const config = getPlugins(providers.ethereum, providers.ipfs, ensAddresses.ensAddress);
    client = new Web3ApiClient(config);

    await buildApi(apiPath);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getData = async (contractAddr: string): Promise<number> => {
    const response = await App.SimpleStorage_Query.getData(
      {
        address: contractAddr,
        connection: CONNECTION,
      },
      client,
      apiUri
    );

    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
    expect(response.data).not.toBeNull();

    return response.data as number;
  }

  const setData = async (contractAddr: string, value: number): Promise<string> => {
    const response = await App.SimpleStorage_Mutation.setData(
      {
        address: contractAddr,
        connection: CONNECTION,
        value: value,
      },
      client,
      apiUri
    );

    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
    expect(response.data).not.toBeNull();

    return response.data as string;
  }

  it("sanity", async () => {
    // Deploy contract
    const deployContractResponse = await App.SimpleStorage_Mutation.deployContract(
      { connection: CONNECTION },
      client,
      apiUri
    );
    expect(deployContractResponse).toBeTruthy();
    expect(deployContractResponse.error).toBeFalsy();
    expect(deployContractResponse.data).toBeTruthy();

    const contractAddress = deployContractResponse.data as string;

    // Get data
    let data = await getData(contractAddress);
    expect(data).toBe(0);

    // Set data
    const tx = await setData(contractAddress, 10);
    expect(tx).toBeTruthy();

    // Get data
    data = await getData(contractAddress);
    expect(data).toBe(10);
  });
});
