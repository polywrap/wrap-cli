import {
  usePolywrapInvoke,
  PolywrapProvider,
  createPolywrapProvider,
} from "..";
import { UsePolywrapInvokeProps } from "../invoke";
import { createPlugins, createEnvs } from "./config";

import {
  initTestEnvironment,
  stopTestEnvironment,
  ensAddresses,
  providers, buildWrapper,
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

import {
  renderHook,
  act,
  RenderHookOptions,
  cleanup
} from "@testing-library/react-hooks";
import { PolywrapClientConfig } from "@polywrap/client-js";

jest.setTimeout(360000);

describe("usePolywrapInvoke hook", () => {
  let uri: string;
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    await initTestEnvironment();

    const simpleStoragePath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;
    await buildWrapper(simpleStoragePath);
    uri = `fs/${simpleStoragePath}/build`

    const simpleEnvPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`;
    await buildWrapper(simpleEnvPath);

    const config: Partial<PolywrapClientConfig> = {
      envs: createEnvs(providers.ipfs),
      plugins: createPlugins(ensAddresses.ensAddress, providers.ethereum),
    }
    WrapperProvider = {
      wrapper: PolywrapProvider,
      initialProps: { config },
    };
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  async function sendQuery<TData>(
    options: UsePolywrapInvokeProps
  ) {
    const hook = () => usePolywrapInvoke<TData>(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute();
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  async function sendQueryWithExecVariables<TData>(
    options: UsePolywrapInvokeProps
  ) {
    const hook = () => usePolywrapInvoke<TData>({
      uri: options.uri,
      method: options.method,
      provider: options.provider
    });

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    await act(async () => {
      await hookResult.current.execute(options.args);
    });

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should update storage data to five", async () => {
    const deployInvoke: UsePolywrapInvokeProps = {
      uri,
      method: "deployContract",
      args: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: address } = await sendQuery<string>(deployInvoke);

    const setStorageInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "setData",
      args: {
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

    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "getData",
      args: {
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
    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      provider: "Non existent Polywrap Provider",
      uri,
      method: "getData",
      args: {
        address: "foo",
      },
    };

    const getDataStorageHook = () => usePolywrapInvoke(getStorageDataInvocation);
    const { result } = renderHook(getDataStorageHook);

    expect(result.error?.message).toMatch(
      /You are trying to use usePolywrapClient with provider \"Non existent Polywrap Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createPolywrapProvider("other");

    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      provider: "other",
      uri,
      method: "getData",
      args: {
        address: "foo",
      },
    };

    const getDataStorageHook = () => usePolywrapInvoke(getStorageDataInvocation);
    const { result } = renderHook(getDataStorageHook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested PolywrapProvider \"other\" was not found within the DOM hierarchy/
    );
  });

  it("Should update storage data to three by setting value through variables passed to exec", async () => {
    const deployInvoke: UsePolywrapInvokeProps = {
      uri,
      method: "deployContract",
      args: {
        connection: {
          networkNameOrChainId: "testnet",
        },
      },
    };

    const { data: address } = await sendQueryWithExecVariables<string>(deployInvoke);

    const setStorageInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "setData",
      args: {
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

    const getStorageDataInvocation: UsePolywrapInvokeProps = {
      uri,
      method: "getData",
      args: {
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
