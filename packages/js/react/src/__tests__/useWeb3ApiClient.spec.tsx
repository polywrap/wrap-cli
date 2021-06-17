import { UseWeb3ApiClientProps } from '../client';
import {
  Web3ApiProvider,
  createWeb3ApiProvider,
  useWeb3ApiClient
} from "..";
import { createRedirects } from "./redirects";

import { UriRedirect } from "@web3api/core-js";
import {
  initTestEnvironment,
  stopTestEnvironment
} from "@web3api/test-env-js";

import {
  renderHook,
  RenderHookOptions,
  cleanup
} from "@testing-library/react-hooks";

jest.setTimeout(360000);

describe("useWeb3ApiClient hook", () => {
  let redirects: UriRedirect<string>[];
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    const {
      ethereum,
      ipfs,
      ensAddress
    } = await initTestEnvironment();

    redirects = createRedirects(ensAddress, ethereum, ipfs);

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

  function getClient(
    options?: UseWeb3ApiClientProps
  ) {
    const hook = () => useWeb3ApiClient(options);

    const { result: hookResult } = renderHook(hook, WrapperProvider);

    const result = hookResult.current;
    cleanup();
    return result;
  }

  it("Should return client with redirects", async () => {
    const client = getClient();

    expect(client).toBeTruthy();
    expect(client.redirects().length).toBeGreaterThan(0);
  });

  it("Should throw error because there's no provider with expected key ", async () => {
    const props: UseWeb3ApiClientProps = {
      provider: "Non existent Web3API Provider",
    };

    const hook = () => useWeb3ApiClient(props);

    const { result } = renderHook(hook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /You are trying to use useWeb3ApiClient with provider \"Non existent Web3API Provider\"/
    );
  });

  it("Should throw error if provider is not within the DOM hierarchy", async () => {
    createWeb3ApiProvider("other");

    const props: UseWeb3ApiClientProps = {
      provider: "other"
    };
   
    const hook = () => useWeb3ApiClient(props);

    const { result } = renderHook(hook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested Web3APIProvider \"other\" was not found within the DOM hierarchy/
    );
  });
});
