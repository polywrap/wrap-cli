import {
  useWeb3ApiQuery,
  Web3ApiProvider,
  UseWeb3ApiQueryProps,
  createWeb3ApiProvider
} from "..";

import {
  renderHook,
  act,
  RenderHookOptions,
  cleanup
} from "@testing-library/react-hooks";
import {
  Uri,
  UriRedirectDefinition
} from "@web3api/client-js";
import { QueryApiOptions } from "@web3api/core-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(30000);

describe("useWeb3ApiQuery hook", () => {
  let uri: Uri;
  let redirects: UriRedirectDefinition[];
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    const {
      ipfs,
      data,
      redirects: testRedirects,
    } = await initTestEnvironment();

    const { ensDomain } = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
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

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const sendQuery = async (
    options: QueryApiOptions
  ) => {
    const hook = () => useWeb3ApiQuery(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute();
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should update storage data to five with hard coded value", async () => {
    const deployQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `mutation { deployContract }`,
    };

    const { data } = await sendQuery(deployQuery);

    const setStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        mutation {
          setData(
            address: "${data.deployContract}"
            value: 5
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
            address: "${data.deployContract}"
          )
        }
      `,
    };

    const { data: { getData } } = await sendQuery(getStorageDataQuery);
    expect(getData).toBe(5);
  });

  it("Should update storage data to five by setting value through variables", async () => {
    const deployQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `mutation { deployContract }`,
    };

    const { data } = await sendQuery(deployQuery);

    const setStorageDataQuery: UseWeb3ApiQueryProps = {
      uri,
      query: `
        mutation {
          setData(
            address: "${data.deployContract}"
            value: $value
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
            address: "${data.deployContract}"
          )
        }
      `,
    };

    const { data: { getData } } = await sendQuery(getStorageDataQuery);
    expect(getData).toBe(5);
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
      /You are trying to use useWeb3ApiQuery with provider \"Non existent Web3API Provider\"/
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
});
