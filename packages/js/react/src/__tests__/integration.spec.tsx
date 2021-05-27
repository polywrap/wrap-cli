import { createWeb3ApiProvider } from "..";
import { SimpleStorageContainer } from "./dapp/SimpleStorage";

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import {
  UriRedirect
} from "@web3api/client-js";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(60000);

describe("Web3API React Integration", () => {
  let redirects: UriRedirect[];
  let ensUri: string;
  let api: {
    ensDomain: string;
    ipfsCid: string;
  };

  beforeAll(async () => {
    const {
      ipfs,
      ensAddress,
      redirects: testRedirects,
    } = await initTestEnvironment();

    redirects = testRedirects;
    api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfs,
      ensAddress
    );
    ensUri = `ens/testnet/${api.ensDomain}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Deploys, read and write on Smart Contract ", async () => {
    render(<SimpleStorageContainer redirects={redirects} ensUri={ensUri} />);

    fireEvent.click(screen.getByText("Deploy"));
    await waitFor(() => screen.getByText(/0x/));
    expect(screen.getByText(/0x/)).toBeTruthy();

    // check storage is 0
    fireEvent.click(screen.getByText("Check storage"));
    await waitFor(() => screen.getByText("0"));
    expect(screen.getByText("0")).toBeTruthy();

    // update storage to five and check it
    fireEvent.click(screen.getByText("Set the storage to 5!"));
    await waitFor(() => screen.getByText("5"));
    expect(screen.getByText("5")).toBeTruthy();

    // check for provider redirects
    expect(screen.getByText("Provider Redirects are correct")).toBeTruthy();
  });

  it("Should throw error because two providers with same key has been rendered ", () => {
    // @ts-ignore
    const CustomWeb3ApiProvider = createWeb3ApiProvider("test");

    expect(() => createWeb3ApiProvider("test")).toThrowError(
      /A Web3Api provider already exists with the name \"test\"/
    );
  });
});
