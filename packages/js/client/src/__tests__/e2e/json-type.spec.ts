import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(200000);

describe("json-type", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  let ensUri: string;
  let ipfsUri: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens, resolverAddress, registrarAddress } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;

    const api = await buildAndDeployApi({
      apiAbsPath: `${GetPathToTestApis()}/json-type`,
      ipfsProvider,
      ensRegistryAddress: ensAddress,
      ethereumProvider: ethProvider,
      ensRegistrarAddress,
      ensResolverAddress,
    });

    ensUri = `ens/testnet/${api.ensDomain}`;
    ipfsUri = `ipfs/${api.ipfsCid}`;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient(
      {
        ethereum: {
          networks: {
            testnet: {
              provider: ethProvider,
            },
          },
        },
        ipfs: { provider: ipfsProvider },
        ens: {
          query: {
           addresses: {
              testnet: ensAddress,
            },
          },
        },
      },
      config
    );
  };

  it("parse", async () => {
    type Json = string;
    const client = await getClient();

    const value = { foo: "bar", bar: "baz" };
    const parseResponse = await client.query<{
      parse: Json;
    }>({
      uri: ensUri,
      query: `query {
        parse(value: $value)
      }`,
      variables: {
        value: JSON.stringify(value),
      },
    });

    expect(parseResponse.data?.parse).toEqual(JSON.stringify(value));
  });

  it("stringify array of objects", async () => {
    type Json = string;
    const client = await getClient();

    const values = [
      JSON.stringify({ bar: "foo" }),
      JSON.stringify({ baz: "fuz" }),
    ];
    const stringifyResponse = await client.query<{
      stringify: Json;
    }>({
      uri: ensUri,
      query: `query {
        stringify(
          values: $values
        )
      }`,
      variables: {
        values,
      },
    });

    expect(stringifyResponse.data?.stringify).toEqual(values.join(""));
  });

  it("stringify object of objects", async () => {
    type Json = string;
    const client = await getClient();

    const object = {
      jsonA: JSON.stringify({ foo: "bar" }),
      jsonB: JSON.stringify({ fuz: "baz" }),
    };
    const stringifyObjectResponse = await client.query<{
      stringifyObject: Json;
    }>({
      uri: ensUri,
      query: `query {
        stringifyObject(
          object: $object
        )
      }`,
      variables: {
        object,
      },
    });

    expect(stringifyObjectResponse.data?.stringifyObject).toEqual(
      object.jsonA + object.jsonB
    );
  });

  it("methodJSON", async () => {
    type Json = string;
    const client = await getClient();

    const methodJSONResponse = await client.query<{
      methodJSON: Json;
    }>({
      uri: ensUri,
      query: `query {
        methodJSON(valueA: 5, valueB: "foo", valueC: true)
      }`,
    });

    const methodJSONResult = JSON.stringify({
      valueA: 5,
      valueB: "foo",
      valueC: true,
    });
    expect(methodJSONResponse.data?.methodJSON).toEqual(methodJSONResult);
  });
});