import { UsePolywrapClientProps } from '../client';
import {
  PolywrapProvider,
  createPolywrapProvider,
  usePolywrapClient
} from "..";
import { createPlugins, createEnvs } from "./config";

import { Env, IUriPackage, Uri } from "@polywrap/core-js";
import {
  ensAddresses,
  providers,
  initTestEnvironment,
  stopTestEnvironment,
} from "@polywrap/test-env-js";

import { renderHook, RenderHookOptions } from "@testing-library/react-hooks";

jest.setTimeout(360000);

describe("usePolywrapClient hook", () => {
  let envs: Env[];
  let packages: IUriPackage<Uri | string>[];
  let WrapperProvider: RenderHookOptions<unknown>;

  beforeAll(async () => {
    await initTestEnvironment();

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
      provider: "other",
    };

    const hook = () => usePolywrapClient(props);

    const { result } = renderHook(hook, WrapperProvider);

    expect(result.error?.message).toMatch(
      /The requested PolywrapProvider \"other\" was not found within the DOM hierarchy/
    );
  });
});
