import { Web3ApiClient } from "@web3api/client-js";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import * as App from "../types/w3";
import path from "path";

import { getPlugins } from "../utils";

jest.setTimeout(500000);

describe("SimpleStorage", () => {
  const CONNECTION = { node: "http://localhost:8545" };

  let client: Web3ApiClient;
  let ensUri: string;

  beforeAll(async () => {
    const {
      ethereum: testEnvEtherem,
      ensAddress,
      registrarAddress,
      resolverAddress,
      ipfs,
    } = await initTestEnvironment();
    // deploy api
    const apiPath: string = path.join(
      path.resolve(__dirname),
      "..",
      "..",
      ".."
    );

    // get client
    const config = getPlugins(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient(config);

    const api = await buildAndDeployApi({
      apiAbsPath: apiPath,
      ipfsProvider: ipfs,
      ensRegistryAddress: ensAddress,
      ensRegistrarAddress: registrarAddress,
      ensResolverAddress: resolverAddress,
      ethereumProvider: testEnvEtherem,
    });
    
    ensUri = `ens/testnet/${api.ensDomain}`;
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
      ensUri
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
      ensUri
    );

    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
    expect(response.data).not.toBeNull();

    return response.data as string;
  }

  test("sanity", async () => {
    // Deploy contract
    const deployContractResponse = await App.SimpleStorage_Mutation.deployContract({connection: CONNECTION}, client, ensUri);
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
