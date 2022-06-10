import { filesystemPlugin } from "../index";
import {
  buildApi,
  ensAddresses,
  initTestEnvironment,
  stopTestEnvironment,
  providers
} from "@web3api/test-env-js";
import {
  Web3ApiClient,
  Web3ApiClientConfig,
  defaultIpfsProviders,
} from "@web3api/client-js";
import { GetPathToTestApis } from "@web3api/test-cases";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import fs from "fs";
import path from "path";

jest.setTimeout(360000);

describe("Filesystem plugin", () => {
  let client: Web3ApiClient;

  beforeAll(async () => {
    await initTestEnvironment();

    const config: Partial<Web3ApiClientConfig> = {
      plugins: [
        {
          uri: "w3://ens/fs.web3api.eth",
          plugin: filesystemPlugin({ query: {} }),
        },
        // IPFS is required for downloading Web3API packages
        {
          uri: "w3://ens/ipfs.web3api.eth",
          plugin: ipfsPlugin({
            provider: providers.ipfs,
            fallbackProviders: defaultIpfsProviders,
          }),
        },
        // ENS is required for resolving domain to IPFS hashes
        {
          uri: "w3://ens/ens.web3api.eth",
          plugin: ensPlugin({
            query: {
              addresses: {
                testnet: ensAddresses.ensAddress,
              },
            }
          }),
        },
        {
          uri: "w3://ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: {
              testnet: {
                provider: providers.ethereum,
              },
            },
            defaultNetwork: "testnet",
          }),
        },
      ],
    };
    client = new Web3ApiClient(config);
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("queries simple-storage api on local drive", async () => {
    const apiPath = path.resolve(
      `${GetPathToTestApis()}/wasm-as/simple-storage`
    );
    await buildApi(apiPath);

    const fsPath = `${apiPath}/build`;
    const fsUri = `fs/${fsPath}`;

    // query api from filesystem
    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: fsUri,
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

    // get the schema
    const schema = await client.getSchema(fsUri);
    const expectedSchema = await fs.promises.readFile(`${fsPath}/schema.graphql`, "utf-8");

    expect(schema).toBe(expectedSchema);

    // get the manifest
    const manifest = await client.getManifest(fsUri, { type: "web3api" });

    expect(manifest).toBeTruthy();
    expect(manifest.language).toBe("wasm/assemblyscript");

    // get a file
    const file = await client.getFile(fsUri, { path: "web3api.json", encoding: "utf-8" });
    const expectedFile = await fs.promises.readFile(`${fsPath}/web3api.json`, "utf-8");

    expect(file).toBe(expectedFile);
  });
});
