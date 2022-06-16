import { PolywrapClient } from "@polywrap/client-js";
import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  providers,
  ensAddresses
} from "@polywrap/test-env-js";
import * as App from "../types/wrap";
import path from "path";

import { getPlugins } from "../utils";

jest.setTimeout(500000);

describe("SimpleStorage", () => {
  const CONNECTION = { networkNameOrChainId: "testnet" };

  let client: PolywrapClient;

  const wrapperPath: string = path.join(
    path.resolve(__dirname),
    "..",
    "..",
    ".."
  );
  const wrapperUri = `fs/${wrapperPath}/build`;

  beforeAll(async () => {
    await initTestEnvironment();

    const config = getPlugins(providers.ethereum, providers.ipfs, ensAddresses.ensAddress);
    client = new PolywrapClient(config);

    await buildWrapper(wrapperPath);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getData = async (contractAddr: string): Promise<number> => {
    const response = await App.SimpleStorage_Module.getData(
      {
        address: contractAddr,
        connection: CONNECTION,
      },
      client,
      wrapperUri
    );

    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
    expect(response.data).not.toBeNull();

    return response.data as number;
  }

  const setData = async (contractAddr: string, value: number): Promise<string> => {
    const response = await App.SimpleStorage_Module.setData(
      {
        address: contractAddr,
        connection: CONNECTION,
        value: value,
      },
      client,
      wrapperUri
    );

    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
    expect(response.data).not.toBeNull();

    return response.data as string;
  }

  it("sanity", async () => {
    // Deploy contract
    const deployContractResponse = await App.SimpleStorage_Module.deployContract(
      { connection: CONNECTION },
      client,
      wrapperUri
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
