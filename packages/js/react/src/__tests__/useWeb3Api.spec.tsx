import { useWeb3ApiQuery, Web3ApiProvider } from "..";

import {
  renderHook,
  act,
  RenderHookOptions,
} from "@testing-library/react-hooks";
import {
  Uri,
  UriRedirect,
  initTestEnvironment,
  buildAndDeployApi,
} from "@web3api/client-js";

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
    const getStorageDataQuery = {
      uri,
      query: `query {
        getData(
          address: "${contractAddress}"
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
    expect(storageData.current.data?.getData).toBe(0);
  });
});
