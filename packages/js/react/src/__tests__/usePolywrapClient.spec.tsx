import { UsePolywrapClientProps } from '../client';
import {
  PolywrapProvider,
  createPolywrapProvider,
  usePolywrapClient
} from "..";
import { createPlugins, createEnvs } from "./config";

import {
  ensAddresses,
  providers,
  initTestEnvironment,
  stopTestEnvironment
} from "@polywrap/test-env-js";

import {
  renderHook,
  RenderHookOptions,
  cleanup
} from "@testing-library/react-hooks";
import { PolywrapClientConfig } from "@polywrap/client-js";

jest.setTimeout(360000);

describe("usePolywrapClient hook", () => {
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    await initTestEnvironment();

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

  function getClient(
    options?: UsePolywrapClientProps
  ) {
    const hook = () => usePolywrapClient(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should return client with plugins", async () => {
    const client = getClient();

    expect(client).toBeTruthy();
    expect(client.getPlugins().length).toBeGreaterThan(0);
  });

  it("Should throw error because there's no provider with expected key ", async () => {
    const props: UsePolywrapClientProps = {
      provider: "Non existent Polywrap Provider",
    };

    const hook = () => usePolywrapClient(props);

    const { result } = renderHook(hook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /You are trying to use usePolywrapClient with provider \"Non existent Polywrap Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createPolywrapProvider("other");

    const props: UsePolywrapClientProps = {
      provider: "other"
    };
   
    const hook = () => usePolywrapClient(props);

    const { result } = renderHook(hook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested PolywrapProvider \"other\" was not found within the DOM hierarchy/
    );
  });
});
