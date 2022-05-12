import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("asyncify", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  let ensUri: string;
  let ipfsUri: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens, resolverAddress, registrarAddress } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/asyncify`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    ensUri = `ens/testnet/${api.ensDomain}`;
    ipfsUri = `ipfs/${api.ipfsCid}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient(
      {
        ethereum: {
          networks: {
            testnet: {
              provider: ethProvider,
            },
          },
        },
        ipfs: { provider: ipfsProvider },
        ens: {
          query: {
           addresses: {
              testnet: ensAddress,
            },
          },
        },
      },
      config
    );
  };

  it("sanity", async () => {
    const client = await getClient();
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

    const subsequentInvokes = await client.query<{
      subsequentInvokes: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          subsequentInvokes(
            address: "${address}"
            numberOfTimes: 40
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    const expected = Array.from(new Array(40), (_, index) => index.toString());

    expect(subsequentInvokes.errors).toBeFalsy();
    expect(subsequentInvokes.data).toBeTruthy();
    expect(subsequentInvokes.data?.subsequentInvokes).toEqual(expected);

    const localVarMethod = await client.query<{
      localVarMethod: boolean;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          localVarMethod(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(localVarMethod.errors).toBeFalsy();
    expect(localVarMethod.data).toBeTruthy();
    expect(localVarMethod.data?.localVarMethod).toEqual(true);

    const globalVarMethod = await client.query<{
      globalVarMethod: boolean;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          globalVarMethod(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(globalVarMethod.errors).toBeFalsy();
    expect(globalVarMethod.data).toBeTruthy();
    expect(globalVarMethod.data?.globalVarMethod).toEqual(true);

    const largeStr = new Array(10000).join("web3api ");

    const setDataWithLargeArgs = await client.query<{
      setDataWithLargeArgs: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setDataWithLargeArgs(
            address: "${address}"
            value: $largeStr
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        largeStr,
      },
    });

    expect(setDataWithLargeArgs.errors).toBeFalsy();
    expect(setDataWithLargeArgs.data).toBeTruthy();
    expect(setDataWithLargeArgs.data?.setDataWithLargeArgs).toEqual(largeStr);

    const setDataWithManyArgs = await client.query<{
      setDataWithManyArgs: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setDataWithManyArgs(
            address: "${address}"
            valueA: $valueA
            valueB: $valueB
            valueC: $valueC
            valueD: $valueD
            valueE: $valueE
            valueF: $valueF
            valueG: $valueG
            valueH: $valueH
            valueI: $valueI
            valueJ: $valueJ
            valueK: $valueK
            valueL: $valueL
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        valueA: "web3api a",
        valueB: "web3api b",
        valueC: "web3api c",
        valueD: "web3api d",
        valueE: "web3api e",
        valueF: "web3api f",
        valueG: "web3api g",
        valueH: "web3api h",
        valueI: "web3api i",
        valueJ: "web3api j",
        valueK: "web3api k",
        valueL: "web3api l",
      },
    });

    expect(setDataWithManyArgs.errors).toBeFalsy();
    expect(setDataWithManyArgs.data).toBeTruthy();
    expect(setDataWithManyArgs.data?.setDataWithManyArgs).toEqual(
      "web3api aweb3api bweb3api cweb3api dweb3api eweb3api fweb3api gweb3api hweb3api iweb3api jweb3api kweb3api l"
    );

    const createObj = (i: number) => {
      return {
        propA: `a-${i}`,
        propB: `b-${i}`,
        propC: `c-${i}`,
        propD: `d-${i}`,
        propE: `e-${i}`,
        propF: `f-${i}`,
        propG: `g-${i}`,
        propH: `h-${i}`,
        propI: `i-${i}`,
        propJ: `j-${i}`,
        propK: `k-${i}`,
        propL: `l-${i}`,
      };
    };

    const setDataWithManyStructuredArgs = await client.query<{
      setDataWithManyStructuredArgs: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setDataWithManyStructuredArgs(
            address: "${address}"
            valueA: $valueA
            valueB: $valueB
            valueC: $valueC
            valueD: $valueD
            valueE: $valueE
            valueF: $valueF
            valueG: $valueG
            valueH: $valueH
            valueI: $valueI
            valueJ: $valueJ
            valueK: $valueK
            valueL: $valueL
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        valueA: createObj(1),
        valueB: createObj(2),
        valueC: createObj(3),
        valueD: createObj(4),
        valueE: createObj(5),
        valueF: createObj(6),
        valueG: createObj(7),
        valueH: createObj(8),
        valueI: createObj(9),
        valueJ: createObj(10),
        valueK: createObj(11),
        valueL: createObj(12),
      },
    });

    expect(setDataWithManyStructuredArgs.errors).toBeFalsy();
    expect(setDataWithManyStructuredArgs.data).toBeTruthy();
    expect(
      setDataWithManyStructuredArgs.data?.setDataWithManyStructuredArgs
    ).toBe(true);
  });
});