import {
  usePolywrapInvoke,
  PolywrapProvider,
  createPolywrapProvider,
} from "..";
import { UsePolywrapInvokeProps } from "../invoke";
import { createPlugins } from "./plugins";

import { PluginRegistration } from "@polywrap/core-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployWrapper,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

import {
  renderHook,
  act,
  RenderHookOptions,
  cleanup
} from "@testing-library/react-hooks";

jest.setTimeout(360000);

describe("usePolywrapInvoke hook", () => {
  let uri: string;
  let envUri: string;
  let plugins: PluginRegistration<string>[];
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    await initTestEnvironment();

    const { ensDomain } = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/simple-storage`,
      ipfsProvider: providers.ipfs,
      ethereumProvider: providers.ethereum,
    });

    const { ensDomain: envEnsDomain } = await buildAndDeployWrapper({
      wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/simple-env-types`,
      ipfsProvider: providers.ipfs,
      ethereumProvider: providers.ethereum,
    });

    uri = `ens/testnet/${ensDomain}`;
    envUri = `ens/testnet/${envEnsDomain}`;
    plugins = createPlugins(ensAddresses.ensAddress, providers.ethereum, providers.ipfs);
    WrapperProvider = {
      wrapper: PolywrapProvider,
      initialProps: {
        plugins,
        envs: [{
          uri: envUri,
          env: {
            str: "Hello World!",
            requiredInt: 2,
          }
        }]
      },
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

  it("Should support passing env to client", async () => {
    const deployQuery: UsePolywrapInvokeProps = {
      uri: envUri,
      method: "getEnv",
      args: {
        arg: "Alice"
      }
    };

    const { data, error } = await sendQuery<{
      str: string;
      requiredInt: number;
    }>(deployQuery);

    expect(error).toBeFalsy();
    expect(data?.str).toBe("Hello World!");
    expect(data?.requiredInt).toBe(2);
  });

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
