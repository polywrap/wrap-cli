import { SimpleStorageContainer } from "./dapp/SimpleStorage";

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import {
  UriRedirect,
  Uri,
  initTestEnvironment,
  buildAndDeployApi,
} from "@web3api/client-js";

jest.setTimeout(30000);

describe("Web3Api Wrapper", () => {
  let redirects: UriRedirect[];
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
  });

  it("Deploys, read and write on Smart Contract ", async () => {
    const ensUri = new Uri(`ens/${api.ensDomain}`);

    render(<SimpleStorageContainer redirects={redirects} ensUri={ensUri} />);

    fireEvent.click(screen.getByText("Deploy"));
    await waitFor(() => screen.getByText(/0x/));
    expect(screen.getByText(/0x/)).toBeTruthy();

    // check storage is 0
    fireEvent.click(screen.getByText("Check storage"));
    await waitFor(() => screen.getByText("0"));
    expect(screen.getByText("0")).toBeTruthy();

    // update storage to five
    // check storage is 5
  });

  // it("Should update storage data to five ", () => {});

  // it("Storage should be equal to five (5)", () => {});
});
