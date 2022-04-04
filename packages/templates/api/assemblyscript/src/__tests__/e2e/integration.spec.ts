import { Web3ApiClient } from "@web3api/client-js";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
  runCLI,
} from "@web3api/test-env-js";
import path from "path";

import { getPlugins } from "../utils";

jest.setTimeout(500000);

describe("SimpleStorage", () => {
  const CONNECTION = { node: "http://localhost:8545" };

  let client: Web3ApiClient;
  let ensUri: string;
  let app: any;

  beforeAll(async () => {
    const {
      ethereum: testEnvEtherem,
      ensAddress,
      ipfs,
    } = await initTestEnvironment();
    // deploy api
    const apiPath: string = path.join(
      path.resolve(__dirname),
      "..",
      "..",
      ".."
    );
    const api = await buildAndDeployApi(apiPath, ipfs, ensAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;

    //generate types
    const typesPath = path.join(path.resolve(__dirname), "..", "types");
    await runCLI({
      args: ["app", "codegen", "-c", "./w3"],
      cwd: typesPath,
    });
    // Note: module doesn't exist at compile time
    app = await import("../types/w3");

    // get client
    const config = getPlugins(testEnvEtherem, ipfs, ensAddress);
    client = new Web3ApiClient(config);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getData = async (contractAddr: string): Promise<number> => {
    const response = await app.SimpleStorage_Query.getData(
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
    const response = await app.SimpleStorage_Mutation.setData(
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
    const deployContractResponse = await app.SimpleStorage_Mutation.deployContract({connection: CONNECTION}, client, ensUri);
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
