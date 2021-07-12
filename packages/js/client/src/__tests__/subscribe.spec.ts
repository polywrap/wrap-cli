import { buildAndDeployApi, initTestEnvironment, stopTestEnvironment } from "@web3api/test-env-js";
import { createWeb3ApiClient } from "../createWeb3ApiClient";
import { GetPathToTestApis } from "../../../../test-cases";
import { Subscription } from "@web3api/core-js";

jest.setTimeout(60000);

describe("Web3ApiClient: subscribe", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async () => {
    return createWeb3ApiClient({
      ethereum: {
        networks: {
          testnet: {
            provider: ethProvider
          },
        },
        defaultNetwork: "testnet"
      },
      ipfs: { provider: ipfsProvider },
      ens: {
        addresses: {
          testnet: ensAddress
        }
      }
    })
  }

  it("simple-storage: subscribe", async () => {
    // set up client and api
    const client = await getClient();
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const ipfsUri = `ipfs/${api.ipfsCid}`;

    // deploy simple-storage contract
    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
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

    // test subscription
    let results: number[] = [];
    let value = 0;

    const setter = setInterval(async() => {
      await client.query<{
        setData: string;
      }>({
        uri: ipfsUri,
        query: `
        mutation {
          setData(
            address: $address
            value: $value
          )
        }
      `,
        variables: {
          address: address,
          value: value++,
        },
      });
    }, 4500);

    const getSubscription: Subscription<{
      getData: number;
    }> = client.subscribe<{
      getData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: $address
          )
        }
      `,
      variables: {
        address
      },
      frequency: { ms: 5000 }
    });

    for await (let query of getSubscription) {
      expect(query.errors).toBeFalsy();
      const val = query.data?.getData;
      if (val !== undefined) {
        results.push(val);
        if (val >= 3) {
          break;
        }
      }
    }
    clearInterval(setter);

    expect(results).toStrictEqual([0, 1, 2, 3]);
  });

  it("simple-storage: subscription early stop", async () => {
    // set up client and api
    const client = await getClient();
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const ipfsUri = `ipfs/${api.ipfsCid}`;

    // deploy simple-storage contract
    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
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

    // test subscription
    let results: number[] = [];
    let value = 0;

    const setter = setInterval(async() => {
      await client.query<{
        setData: string;
      }>({
        uri: ipfsUri,
        query: `
          mutation {
            setData(
              address: $address
              value: $value
            )
          }
        `,
        variables: {
          address: address,
          value: value++,
        },
      });
    }, 4500);

    const getSubscription: Subscription<{
      getData: number;
    }> = client.subscribe<{
      getData: number;
    }>({
      uri: ensUri,
      query: `
          query {
            getData(
              address: $address
            )
          }
        `,
      variables: {
        address
      },
      frequency: { ms: 5000 }
    });

    new Promise(async () => {
        for await (let query of getSubscription) {
          expect(query.errors).toBeFalsy();
          const val = query.data?.getData;
          if (val !== undefined) {
            results.push(val);
            if (val >= 3) {
              break;
            }
          }
        }
      }
    );
    await new Promise(r => setTimeout(r, 10000));
    getSubscription.stop();
    clearInterval(setter);

    expect(results).toContain(0);
    expect(results).not.toContain(3);
  });
});