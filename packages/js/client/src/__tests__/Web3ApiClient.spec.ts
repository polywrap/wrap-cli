import {
  Web3ApiClient,
  Uri,
  UriRedirect
} from "../";
import { buildAndDeployApi } from "./helpers";

import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import axios from "axios";

describe("Web3ApiClient", () => {
  let ipfsProvider: string;
  let ensAddress: string;
  let redirects: UriRedirect[];

  beforeAll(async () => {
    // fetch providers from dev server
    const { data: { ipfs, ethereum } } = await axios.get("http://localhost:4040/providers");

    if (!ipfs) {
      throw Error("Dev server must be running at port 4040");
    }

    ipfsProvider = ipfs;

    // re-deploy ENS
    const { data } = await axios.get("http://localhost:4040/deploy-ens");

    ensAddress = data.ensAddress;

    // Test env redirects for ethereum, ipfs, and ENS.
    // Will be used to fetch APIs.
    redirects = [
      {
        from: new Uri("w3://ens/ethereum.web3api.eth"),
        to: {
          factory: () => new EthereumPlugin({ provider: ethereum }),
          manifest: EthereumPlugin.manifest()
        }
      },
      {
        from: new Uri("w3://ens/ipfs.web3api.eth"),
        to: {
          factory: () => new IpfsPlugin({ provider: ipfs }),
          manifest: IpfsPlugin.manifest()
        }
      },
      {
        from: new Uri("w3://ens/ens.web3api.eth"),
        to: {
          factory: () => new EnsPlugin({ address: ensAddress }),
          manifest: EnsPlugin.manifest()
        }
      }
    ];
  });

  it("sanity", async () => {
    const api = await buildAndDeployApi(
      `${__dirname}/apis/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = new Uri(`ens/${api.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${api.ipfsCid}`);

    const client = new Web3ApiClient({ redirects });

    const deploy = await client.query<{
      deployContract: string
    }>({
      uri: ensUri,
      query: `
        mutation {
          deployContract
        }
      `
    });

    expect(deploy.errors).toBeFalsy();
    expect(deploy.data).toBeTruthy();
    expect(deploy.data?.deployContract.indexOf("0x")).toBeGreaterThan(-1);

    if (!deploy.data) {
      return;
    }

    const address = deploy.data.deployContract;
    const set = await client.query<{
      setData: string;
    }>({
      uri: ipfsUri,
      query: `
        mutation {
          setData(
            address: "${address}"
            value: $value
          )
        }
      `,
      variables: {
        value: 55
      }
    });

    expect(set.errors).toBeFalsy();
    expect(set.data).toBeTruthy();
    expect(set.data?.setData.indexOf("0x")).toBeGreaterThan(-1);

    const get = await client.query<{
      getData: number
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "${address}"
          )
        }
      `
    });

    expect(get.errors).toBeFalsy();
    expect(get.data).toBeTruthy();
    expect(get.data?.getData).toBe(55);
  });
});
