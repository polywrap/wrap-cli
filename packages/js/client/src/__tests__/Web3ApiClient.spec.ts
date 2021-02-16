import { Web3ApiClient, Uri, UriRedirect } from "../";
import { buildAndDeployApi } from "./helpers";

import { EthereumPlugin } from "@web3api/ethereum-plugin-js";
import { IpfsPlugin } from "@web3api/ipfs-plugin-js";
import { EnsPlugin } from "@web3api/ens-plugin-js";
import axios from "axios";

jest.setTimeout(30000);

describe("Web3ApiClient", () => {
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

  it("simple-storage", async () => {
    const api = await buildAndDeployApi(
      `${__dirname}/apis/simple-storage`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = new Uri(`ens/${api.ensDomain}`);
    const ipfsUri = new Uri(`ipfs/${api.ipfsCid}`);

    const client = new Web3ApiClient({ redirects });

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
      query: `
        mutation {
          deployContract
        }
      `,
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
        value: 55,
      },
    });

    expect(set.errors).toBeFalsy();
    expect(set.data).toBeTruthy();
    expect(set.data?.setData.indexOf("0x")).toBeGreaterThan(-1);

    const get = await client.query<{
      getData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "${address}"
          )
        }
      `,
    });

    expect(get.errors).toBeFalsy();
    expect(get.data).toBeTruthy();
    expect(get.data?.getData).toBe(55);
  });

  it("object-types", async () => {
    const api = await buildAndDeployApi(
      `${__dirname}/apis/object-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = new Uri(`ens/${api.ensDomain}`);

    const client = new Web3ApiClient({ redirects });

    const method1a = await client.query<{
      method1: {
        prop: string,
        nested: {
          prop: string
        }
      }[]
    }>({
      uri: ensUri,
      query: `
        query {
          method1(
            arg1: {
              prop: "arg1 prop"
              nested: {
                prop: "arg1 nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method1a.errors).toBeFalsy();
    expect(method1a.data).toBeTruthy();
    expect(method1a.data).toMatchObject({
      method1: [
        {
          prop: "arg1 prop",
          nested: {
            prop: "arg1 nested prop"
          }
        },
        {
          prop: "",
          nested: {
            prop: ""
          }
        }
      ]
    });

    const method1b = await client.query<{
      method1: {
        prop: string,
        nested: {
          prop: string
        }
      }[]
    }>({
      uri: ensUri,
      query: `
        query {
          method1(
            arg1: {
              prop: "arg1 prop"
              nested: {
                prop: "arg1 nested prop"
              }
            }
            arg2: {
              prop: "arg2 prop"
              circular: {
                prop: "arg2 circular prop"
              }
            }
          )
        }
      `,
    });

    expect(method1b.errors).toBeFalsy();
    expect(method1b.data).toBeTruthy();
    expect(method1b.data).toMatchObject({
      method1: [
        {
          prop: "arg1 prop",
          nested: {
            prop: "arg1 nested prop"
          }
        },
        {
          prop: "arg2 prop",
          nested: {
            prop: "arg2 circular prop"
          }
        }
      ]
    });

    const method2a = await client.query<{
      method2: {
        prop: string,
        nested: {
          prop: string
        }
      } | null
    }>({
      uri: ensUri,
      query: `
        query {
          method2(
            arg: {
              prop: "arg prop"
              nested: {
                prop: "arg nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method2a.errors).toBeFalsy();
    expect(method2a.data).toBeTruthy();
    expect(method2a.data).toMatchObject({
      method2: {
        prop: "arg prop",
        nested: {
          prop: "arg nested prop"
        }
      }
    });

    const method2b = await client.query<{
      method2: {
        prop: string,
        nested: {
          prop: string
        }
      } | null
    }>({
      uri: ensUri,
      query: `
        query {
          method2(
            arg: {
              prop: "null"
              nested: {
                prop: "arg nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method2b.errors).toBeFalsy();
    expect(method2b.data).toBeTruthy();
    expect(method2b.data).toMatchObject({
      method2: null
    });


    const method3 = await client.query<{
      method3: ({
        prop: string,
        nested: {
          prop: string
        }
      } | null)[]
    }>({
      uri: ensUri,
      query: `
        query {
          method3(
            arg: {
              prop: "arg prop"
              nested: {
                prop: "arg nested prop"
              }
            }
          )
        }
      `,
    });

    expect(method3.errors).toBeFalsy();
    expect(method3.data).toBeTruthy();
    expect(method3.data).toMatchObject({
      method3: [
        null,
        {
          prop: "arg prop",
          nested: {
            prop: "arg nested prop"
          }
        }
      ]
    });

    const method4 = await client.query<{
      method4: ({
        prop: string,
        nested: {
          prop: string
        }
      } | null)[]
    }>({
      uri: ensUri,
      query: `
        query {
          method4(
            arg: {
              prop: {
                root: {
                  prop: {

                  }
                }
              }
            }
          )
        }
      `,
    });

    expect(method4.errors).toBeTruthy();
    if (method4.errors) {
      expect(method4.errors[0].message).toMatch(
        /__w3_abort: Missing required property: 'root: InfiniteRoot'/gm
      );
    }
  });
});
