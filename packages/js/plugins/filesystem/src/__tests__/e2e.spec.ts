import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import {
  Web3ApiClient,
  ClientConfig,
} from "@web3api/client-js";
import { filesystemPlugin } from "../index";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import * as path from "path";

jest.setTimeout(360000);

describe("Filesystem plugin", () => {
  let client: Web3ApiClient;
  let ipfsProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ensAddress = ens;

    const config: ClientConfig = {
      redirects: [],
      plugins: [
        {
          uri: "w3://ens/fs.web3api.eth",
          plugin: filesystemPlugin(),
        },
        // IPFS is required for downloading Web3API packages
        {
          uri: "w3://ens/ipfs.web3api.eth",
          plugin: ipfsPlugin({
            provider: ipfs,
            fallbackProviders: [
              "https://ipfs.fleek.co",
              "https://ipfs.io",
              "https://ipfs.infura.io",
            ],
          }),
        },
        // ENS is required for resolving domain to IPFS hashes
        {
          uri: "w3://ens/ens.web3api.eth",
          plugin: ensPlugin({
            addresses: {
              testnet: ens,
            },
          }),
        },
        {
          uri: "w3://ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: {
              testnet: {
                provider: ethereum,
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
      `${__dirname}/../../../../../test-cases/cases/apis/simple-storage`
    );
    await buildAndDeployApi(apiPath, ipfsProvider, ensAddress);
    const fsUri = `fs/${apiPath}/build`;

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

    if (!deploy.data) {
      return;
    }

    const address = deploy.data.deployContract;
    const set = await client.query<{
      setData: string;
    }>({
      uri: fsUri,
      query: `
        mutation {
          setData(
            address: "${address}"
            value: $value
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        value: 55,
      },
    });

    expect(set.errors).toBeFalsy();
    expect(set.data).toBeTruthy();
    expect(set.data?.setData.indexOf("0x")).toBeGreaterThan(-1);

    const getWithStringType = await client.query<{
      getData: number;
      secondGetData: number;
      thirdGetData: number;
    }>({
      uri: fsUri,
      query: `
        query {
          getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          secondGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          thirdGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(getWithStringType.errors).toBeFalsy();
    expect(getWithStringType.data).toBeTruthy();
    expect(getWithStringType.data?.getData).toBe(55);
    expect(getWithStringType.data?.secondGetData).toBe(55);
    expect(getWithStringType.data?.thirdGetData).toBe(55);

    const getWithUriType = await client.query<{
      getData: number;
      secondGetData: number;
      thirdGetData: number;
    }>({
      uri: fsUri,
      query: `
        query {
          getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          secondGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          thirdGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(getWithUriType.errors).toBeFalsy();
    expect(getWithUriType.data).toBeTruthy();
    expect(getWithUriType.data?.getData).toBe(55);
    expect(getWithUriType.data?.secondGetData).toBe(55);
    expect(getWithUriType.data?.thirdGetData).toBe(55);
  });
});
