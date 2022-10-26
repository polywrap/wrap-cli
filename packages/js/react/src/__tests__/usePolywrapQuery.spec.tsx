import {
  usePolywrapQuery,
  PolywrapProvider,
  createPolywrapProvider
} from "..";
import {
  UsePolywrapQueryProps
} from "../query"
import { createPlugins, createEnvs } from "./config";

import { Env, IUriPackage, Uri } from "@polywrap/core-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  ensAddresses,
  providers,
  buildWrapper,
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

import {
  renderHook,
  act,
  RenderHookOptions,
  cleanup,
} from "@testing-library/react-hooks";

jest.setTimeout(360000);

describe("usePolywrapQuery hook", () => {
  let uri: string;
  let envs: Env[];
  let packages: IUriPackage<Uri | string>[];
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    await initTestEnvironment();

    const simpleStoragePath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;
    await buildWrapper(simpleStoragePath);
    uri = `fs/${simpleStoragePath}/build`;

    const simpleEnvPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`;
    await buildWrapper(simpleEnvPath);

    envs = createEnvs(providers.ipfs);
    packages = createPlugins(ensAddresses.ensAddress, providers.ethereum);
    WrapperProvider = {
      wrapper: PolywrapProvider,
      initialProps: {
        envs,
        packages,
      },
    };
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  async function sendQuery<TData extends Record<string, unknown>>(
    options: UsePolywrapQueryProps
  ) {
    const hook = () => usePolywrapQuery<TData>(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute();
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  async function sendQueryWithExecVariables<
    TData extends Record<string, unknown>
  >(options: UsePolywrapQueryProps) {
    const hook = () =>
      usePolywrapQuery<TData>({
        uri: options.uri,
        query: options.query,
        provider: options.provider,
      });

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute(options.variables);
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should update storage data to five with hard coded value", async () => {
    const deployQuery: UsePolywrapQueryProps = {
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
      deployContract: string;
    }>(deployQuery);

    const setStorageDataQuery: UsePolywrapQueryProps = {
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

    const getStorageDataQuery: UsePolywrapQueryProps = {
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
      getData: number;
    }>(getStorageDataQuery);
    expect(getDataData?.getData).toBe(5);
  });

  it("Should update storage data to five by setting value through variables", async () => {
    const deployQuery: UsePolywrapQueryProps = {
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
      deployContract: string;
    }>(deployQuery);

    const setStorageDataQuery: UsePolywrapQueryProps = {
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

    const getStorageDataQuery: UsePolywrapQueryProps = {
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
    const getStorageDataQuery: UsePolywrapQueryProps = {
      provider: "Non existent Polywrap Provider",
      uri,
      query: `query {
        getData(
          address: "foo"
        )
      }`,
    };

    const getDataStorageHook = () => usePolywrapQuery(getStorageDataQuery);
    const { result } = renderHook(getDataStorageHook);

    expect(result.error?.message).toMatch(
      /You are trying to use usePolywrapClient with provider \"Non existent Polywrap Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createPolywrapProvider("other");

    const getStorageDataQuery: UsePolywrapQueryProps = {
      provider: "other",
      uri,
      query: `query {
        getData(
          address: "foo"
        )
      }`,
    };

    const getDataStorageHook = () => usePolywrapQuery(getStorageDataQuery);
    const { result } = renderHook(getDataStorageHook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested PolywrapProvider \"other\" was not found within the DOM hierarchy/
    );
  });

  it("Should update storage data to three by setting value through variables passed to exec", async () => {
    const deployQuery: UsePolywrapQueryProps = {
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
      deployContract: string;
    }>(deployQuery);

    const setStorageDataQuery: UsePolywrapQueryProps = {
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

    const getStorageDataQuery: UsePolywrapQueryProps = {
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

    const { data: getDataData } = await sendQueryWithExecVariables(
      getStorageDataQuery
    );
    expect(getDataData?.getData).toBe(3);
  });
});