import { buildAndDeployApi } from "./helpers";

import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { UriRedirect, Uri } from "@web3api/client-js";
import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import { Web3ApiProvider, useWeb3ApiQuery } from "@web3api/react";
import axios from "axios";
import React from "react";

jest.setTimeout(30000);

describe("Web3Api Wrapper", () => {
  let ipfsProvider: string;
  let ensAddress: string;
  let redirects: UriRedirect[];

  beforeAll(async () => {
    // fetch providers from dev server
    const {
      data: { ipfs, ethereum },
    } = await axios.get("http://localhost:4040/providers");

    if (!ipfs) {
      throw Error("Dev server must be running at port 4040");
    }

    ipfsProvider = ipfs;

    // re-deploy ENS
    const { data } = await axios.get("http://localhost:4040/deploy-ens");

    ensAddress = data.ensAddress;
    console.log("Before redirect ENS Address ", ensAddress);
    // Test env redirects for ethereum, ipfs, and ENS.
    // Will be used to fetch APIs.
    redirects = [
      {
        from: new Uri("w3://ens/ethereum.web3api.eth"),
        to: {
          factory: () => new EthereumPlugin({ provider: ethereum }),
          manifest: EthereumPlugin.manifest(),
        },
      },
      {
        from: new Uri("w3://ens/ipfs.web3api.eth"),
        to: {
          factory: () => new IpfsPlugin({ provider: ipfs }),
          manifest: IpfsPlugin.manifest(),
        },
      },
      {
        from: new Uri("w3://ens/ens.web3api.eth"),
        to: {
          factory: () => new EnsPlugin({ address: ensAddress }),
          manifest: EnsPlugin.manifest(),
        },
      },
    ];
  });

  it("Deploys simple storage contract", async () => {
    const DeployComponent = ({ ensUri }: { ensUri: Uri }) => {
      const { execute: deployContract, data, errors } = useWeb3ApiQuery({
        uri: ensUri,
        query: `mutation { deployContract }`,
      });

      console.log("Error ", errors);

      return data && data.deployContract ? (
        <p>{data.deployContract as string}</p>
      ) : (
        <button onClick={deployContract}>Deploy</button>
      );
    };

    const Provider = ({ children }: { children: React.ReactNode }) => {
      return (
        <Web3ApiProvider redirects={redirects}>{children}</Web3ApiProvider>
      );
    };

    const api = await buildAndDeployApi(
      `${__dirname}/simple-storage-api`,
      ipfsProvider,
      ensAddress
    );
    console.log("after deployment");

    console.log(api);
    const ensUri = new Uri(`ens/${api.ensDomain}`);

    render(
      <Provider>
        <DeployComponent ensUri={ensUri} />
      </Provider>
    );

    fireEvent.click(screen.getByText("Deploy"));
    await waitFor(() => screen.getByText(/0x/));
    expect(screen.getByText(/0x/)).toBeTruthy();
  });

  // it("Storage should be equal zero (0)", () => {});

  // it("Should update storage data to five ", () => {});

  // it("Storage should be equal to five (5)", () => {});
});
