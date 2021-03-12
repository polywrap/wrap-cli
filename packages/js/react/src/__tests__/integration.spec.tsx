import { createWeb3ApiProvider } from "..";
import { SimpleStorageContainer } from "./dapp/SimpleStorage";

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import {
  UriRedirect,
  Uri
} from "@web3api/client-js";
import {
  initTestEnvironment,
  buildAndDeployApi
} from "@web3api/test-env-js";

jest.setTimeout(30000);

describe("Web3API React Integration", () => {
  let redirects: UriRedirect[];
  let ensUri: Uri;
  let api: {
    ensDomain: string;
    ipfsCid: string;
  };

  beforeAll(async () => {
    const {
      ipfs,
      data,
      redirects: testRedirects,
    } = await initTestEnvironment();

    redirects = testRedirects;
    api = await buildAndDeployApi(
      `${__dirname}/simple-storage-api`,
      ipfs,
      data.ensAddress
    );
    ensUri = new Uri(`ens/${api.ensDomain}`);
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
  });

  it("Should throw error because two providers with same key has been rendered ", () => {
    const CustomWeb3ApiProvider = createWeb3ApiProvider("test");
    expect(() => createWeb3ApiProvider("test")).toThrowError(
      /A Web3Api provider already exists with the name \"test\"/
    );
  });
});
