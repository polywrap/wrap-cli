import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { Web3ApiClient } from "@web3api/client-js";
import path from "path";
import { providers } from "ethers";
import { getPlugins } from "./utils";

jest.setTimeout(300000);

describe("Mutations", () => {
  let client: Web3ApiClient;
  let ensUri: string;
  let ethersProvider: providers.JsonRpcProvider;
  let ensAddress: string;
  beforeAll(async () => {
    const {
      ensAddress: ensRegistryAddress,
      ipfs,
      ethereum,
    } = await initTestEnvironment();
    // get client
    const plugins = getPlugins(ethereum, ipfs, ensRegistryAddress);
    client = new Web3ApiClient({ plugins });

    // deploy api
    const apiPath: string = path.resolve(__dirname + "/../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensRegistryAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;
    // set up ethers provider
    ethersProvider = providers.getDefaultProvider(
      "http://localhost:8546"
    ) as providers.JsonRpcProvider;
    console.log({ ethersProvider });
    ensAddress = ensRegistryAddress;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Deploy FIFS Registrar", async () => {
    const { data: fifsRegistrarData } = await client.query({
      uri: ensUri,
      query: `
        mutation {
          deployFIFSRegistrar(
            registryAddress: $registryAddress
            tld: $tld
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: {
        registryAddress: ensAddress,
        tld: "eth",
        network: "testnet",
      },
    });

    const deployFIFSRegistrar = fifsRegistrarData?.deployFIFSRegistrar;

    const variables = {
      domain: "web3api.eth",
      newOwner: deployFIFSRegistrar,
      registryAddress: ensAddress,
      network: "testnet",
      txOverrides: {
        gasLimit: 60000
      }
    };
    console.log({ variables });
    const setOwner = await client.query<{
      setOwner: string;
    }>({
      uri: ensUri,
      query: `mutation {
        setOwner(
          domain: $domain
          newOwner: $newOwner
          registryAddress: $registryAddress
          connection: {
            networkNameOrChainId: $network
          }
        )
      }`,
      variables,
    });

    console.log(setOwner);
    expect(setOwner.data?.setOwner).toBeTruthy();
  });
});
