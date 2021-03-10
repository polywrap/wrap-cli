import { useWeb3ApiQuery, Web3ApiProvider, QueryExecutionParams } from "..";

import {
  renderHook,
  act,
  RenderHookOptions,
} from "@testing-library/react-hooks";
import {
  Uri,
  UriRedirect
} from "@web3api/client-js";
import {
  initTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";

jest.setTimeout(30000);

describe("useWeb3ApiQuery hook", () => {
  let uri: Uri;
  let redirects: UriRedirect[];
  let WrapperProvider: RenderHookOptions<unknown>;
  let contractAddress: string;

  beforeAll(async () => {
    const {
      ipfs,
      data,
      redirects: testRedirects,
    } = await initTestEnvironment();

    const { ensDomain } = await buildAndDeployApi(
      `${__dirname}/simple-storage-api`,
      ipfs,
      data.ensAddress
    );

    uri = new Uri(`ens/${ensDomain}`);
    redirects = testRedirects;
    WrapperProvider = {
      wrapper: Web3ApiProvider,
      initialProps: {
        redirects,
      },
    };
  });

  const assertMutationWorks = async (
    query: QueryExecutionParams,
    expectedResult: number
  ) => {
    const setDataStorageHook = () => useWeb3ApiQuery(query);

    const {
      result: seStorageData,
      waitForNextUpdate: waitForDataStorageUpdate,
    } = renderHook(setDataStorageHook, WrapperProvider);

    act(() => {
      seStorageData.current.execute();
    });

    await waitForDataStorageUpdate();

    const newResult = await queryStorageData(contractAddress, uri);
    expect(newResult).toBe(expectedResult);
  };

  const queryStorageData = async (contract: string, uri: Uri) => {
    const getStorageDataQuery = {
      uri,
      query: `query {
        getData(
          address: "${contract}"
        )
      }`,
    };

    const getDataStorageHook = () => useWeb3ApiQuery(getStorageDataQuery);

    const {
      result: storageData,
      waitForNextUpdate: waitForDataStorage,
    } = renderHook(getDataStorageHook, WrapperProvider);

    act(() => {
      storageData.current.execute();
    });

    await waitForDataStorage();
    return storageData.current.data?.getData;
  };

  it("Deployment should work", async () => {
    const deployQuery = {
      uri,
      query: `mutation { deployContract }`,
    };

    const deployContractHook = () => useWeb3ApiQuery(deployQuery);

    const {
      result: deployContractResult,
      waitForNextUpdate: waitForContractDeployment,
    } = renderHook(deployContractHook, WrapperProvider);

    // assert initial state
    expect(deployContractResult.current.data).toBe(undefined);
    expect(deployContractResult.current.errors).toBe(undefined);
    expect(deployContractResult.current.loading).toBe(false);

    // deploy contract
    act(() => {
      deployContractResult.current.execute();
    });

    await waitForContractDeployment();
    contractAddress = deployContractResult.current.data
      ?.deployContract as string;
    expect(deployContractResult.current.data?.deployContract).toMatch(/0x/);
  });

  it("Should retrieve initial storage data which is 0 ", async () => {
    const data = await queryStorageData(contractAddress, uri);
    expect(data).toBe(0);
  });

  it("Should update storage data to five with hard coded value", async () => {
    const setStorageDataQuery = {
      uri,
      query: `
        mutation {
          setData(
            address: "${contractAddress}"
            value: 5
          )
        }
      `,
    };

    await assertMutationWorks(setStorageDataQuery, 5);
  });

  it("Should update storage data to five by setting value through  ", async () => {
    const setStorageDataQuery = {
      uri,
      query: `
        mutation {
          setData(
            address: "${contractAddress}"
            value: $value
          )
        }
      `,
      variables: {
        value: 5,
      },
    };

    await assertMutationWorks(setStorageDataQuery, 5);
  });

  it("Should throw error because there's no provider with expected key ", async () => {
    const getStorageDataQuery = {
      key: "Non existent Web3API Provider",
      uri,
      query: `query {
        getData(
          address: "${contractAddress}"
        )
      }`,
    };

    const getDataStorageHook = () => useWeb3ApiQuery(getStorageDataQuery);
    expect(getDataStorageHook).toThrowError(
      /You are trying to use Web3ApiQuery hook with key: Non existent Web3API Provider and it doesn't exists/
    );
  });
});
