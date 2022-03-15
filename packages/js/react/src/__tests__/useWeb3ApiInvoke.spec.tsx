import {
  useWeb3ApiInvoke,
  Web3ApiProvider,
  createWeb3ApiProvider,
} from "..";
import { UseWeb3ApiInvokeProps } from "../invoke";
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

describe("useWeb3ApiInvoke hook", () => {
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

  async function sendQuery<TData>(
    options: UseWeb3ApiInvokeProps
  ) {
    const hook = () => useWeb3ApiInvoke<TData>(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute();
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  async function sendQueryWithExecVariables<TData>(
    options: UseWeb3ApiInvokeProps
  ) {
    const hook = () => useWeb3ApiInvoke<TData>({
      uri: options.uri,
      module: options.module,
      method: options.method,
      provider: options.provider
    });

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute(options.input);
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should update storage data to five", async () => {
    const deployInvoke: UseWeb3ApiInvokeProps = {
      uri,
      module: "mutation",
      method: "deployContract",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: address } = await sendQuery<string>(deployInvoke);

    const setStorageInvocation: UseWeb3ApiInvokeProps = {
      uri,
      module: "mutation",
      method: "setData",
      input: {
        address: address,
        value: 5,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const result = await sendQuery(setStorageInvocation);
    expect(result.error).toBeFalsy();
    expect(result.data).toMatch(/0x/);

    const getStorageDataInvocation: UseWeb3ApiInvokeProps = {
      uri,
      module: "query",
      method: "getData",
      input: {
        address: address,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: getDataData } = await sendQuery<number>(getStorageDataInvocation);
    expect(getDataData).toBe(5);
  });

  it("Should throw error because there's no provider with expected key ", async () => {
    const getStorageDataInvocation: UseWeb3ApiInvokeProps = {
      provider: "Non existent Web3API Provider",
      uri,
      module: "query",
      method: "getData",
      input: {
        address: "foo",
      },
    };

    const getDataStorageHook = () => useWeb3ApiInvoke(getStorageDataInvocation);
    const { result } = renderHook(getDataStorageHook);

    expect(result.error?.message).toMatch(
      /You are trying to use useWeb3ApiClient with provider \"Non existent Web3API Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createWeb3ApiProvider("other");

    const getStorageDataInvocation: UseWeb3ApiInvokeProps = {
      provider: "other",
      uri,
      module: "query",
      method: "getData",
      input: {
        address: "foo",
      },
    };

    const getDataStorageHook = () => useWeb3ApiInvoke(getStorageDataInvocation);
    const { result } = renderHook(getDataStorageHook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested Web3APIProvider \"other\" was not found within the DOM hierarchy/
    );
  });

  it("Should update storage data to three by setting value through variables passed to exec", async () => {
    const deployInvoke: UseWeb3ApiInvokeProps = {
      uri,
      module: "mutation",
      method: "deployContract",
      input: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: address } = await sendQueryWithExecVariables<string>(deployInvoke);

    const setStorageInvocation: UseWeb3ApiInvokeProps = {
      uri,
      module: "mutation",
      method: "setData",
      input: {
        address: address,
        value: 3,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const result = await sendQueryWithExecVariables(setStorageInvocation);
    expect(result.error).toBeFalsy();
    expect(result.data).toMatch(/0x/);

    const getStorageDataInvocation: UseWeb3ApiInvokeProps = {
      uri,
      module: "query",
      method: "getData",
      input: {
        address: address,
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: getDataData } = await sendQueryWithExecVariables<number>(getStorageDataInvocation);
    expect(getDataData).toBe(3);
  });
});
