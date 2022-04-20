import {
  useWeb3ApiQuery,
  Web3ApiProvider,
  createWeb3ApiProvider
} from "..";
import {
  UseWeb3ApiQueryProps
} from "../query"
import { createPlugins } from "./plugins";

import { PluginRegistration } from "@web3api/core-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

import {
  renderHook,
  act,
  RenderHookOptions,
  cleanup
} from "@testing-library/react-hooks";

jest.setTimeout(360000);

describe("useWeb3ApiQuery hook", () => {
  let uri: string;
  let plugins: PluginRegistration<string>[];
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
      ensAddress
    } = await initTestEnvironment();

    const { ensDomain } = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfs,
      ensAddress
    );

    uri = `ens/testnet/${ensDomain}`;
    plugins = createPlugins(ensAddress, ethereum, ipfs);
    WrapperProvider = {
      wrapper: Web3ApiProvider,
      initialProps: {
        plugins,
      },
    };
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  async function sendQuery<TData extends Record<string, unknown>>(
    options: UseWeb3ApiQueryProps
  ) {
    const hook = () => useWeb3ApiQuery<TData>(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute();
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  async function sendQueryWithExecVariables<TData extends Record<string, unknown>>(
    options: UseWeb3ApiQueryProps
  ) {
    const hook = () => useWeb3ApiQuery<TData>({ uri: options.uri, query: options.query, provider: options.provider});

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute(options.variables);
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should update storage data to five with hard coded value", async () => {
    const deployQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `mutation {
        deployContract (
          connection: {
            networkNameOrChainId: "testnet"
          }
        )
      }`,
    };

    const { data } = await sendQuery<{
      deployContract: string
    }>(deployQuery);

    const setStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        mutation {
          setData(
            address: "${data?.deployContract}"
            value: 5
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    };

    const result = await sendQuery(setStorageDataQuery);
    expect(result.errors).toBeFalsy();
    expect(result.data?.setData).toMatch(/0x/);

    const getStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        query {
          getData(
            address: "${data?.deployContract}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    };

    const { data: getDataData } = await sendQuery<{
      getData: number
    }>(getStorageDataQuery);
    expect(getDataData?.getData).toBe(5);
  });

  it("Should update storage data to five by setting value through variables", async () => {
    const deployQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `mutation {
        deployContract(
          connection: {
            networkNameOrChainId: "testnet"
          }
        )
      }`,
    };

    const { data } = await sendQuery<{
      deployContract: string
    }>(deployQuery);

    const setStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        mutation {
          setData(
            address: "${data?.deployContract}"
            value: $value
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        value: 5,
      },
    };

    const result = await sendQuery(setStorageDataQuery);
    expect(result.errors).toBeFalsy();
    expect(result.data?.setData).toMatch(/0x/);

    const getStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        query {
          getData(
            address: "${data?.deployContract}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    };

    const { data: getDataData } = await sendQuery(getStorageDataQuery);
    expect(getDataData?.getData).toBe(5);
  });

  it("Should throw error because there's no provider with expected key ", async () => {
    const getStorageDataQuery: UseWeb3ApiQueryProps = {
      provider: "Non existent Web3API Provider",
      uri,
      query: `query {
        getData(
          address: "foo"
        )
      }`,
    };

    const getDataStorageHook = () => useWeb3ApiQuery(getStorageDataQuery);
    const { result } = renderHook(getDataStorageHook);

    expect(result.error?.message).toMatch(
      /You are trying to use useWeb3ApiClient with provider \"Non existent Web3API Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createWeb3ApiProvider("other");

    const getStorageDataQuery: UseWeb3ApiQueryProps = {
      provider: "other",
      uri,
      query: `query {
        getData(
          address: "foo"
        )
      }`,
    };

    const getDataStorageHook = () => useWeb3ApiQuery(getStorageDataQuery);
    const { result } = renderHook(getDataStorageHook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested Web3APIProvider \"other\" was not found within the DOM hierarchy/
    );
  });

  it("Should update storage data to three by setting value through variables passed to exec", async () => {
    const deployQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `mutation {
        deployContract(
          connection: {
            networkNameOrChainId: "testnet"
          }
        )
      }`,
    };

    const { data } = await sendQueryWithExecVariables<{
      deployContract: string
    }>(deployQuery);

    const setStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        mutation {
          setData(
            address: "${data?.deployContract}"
            value: $value
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
      variables: {
        value: 3,
      },
    };

    const result = await sendQueryWithExecVariables(setStorageDataQuery);
    expect(result.errors).toBeFalsy();
    expect(result.data?.setData).toMatch(/0x/);

    const getStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        query {
          getData(
            address: "${data?.deployContract}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    };

    const { data: getDataData } = await sendQueryWithExecVariables(getStorageDataQuery);
    expect(getDataData?.getData).toBe(3);
  });
});