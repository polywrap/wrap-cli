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

const AddressOne = "0x0000000000000000000000000000000000000001";

describe("ENS Wrapper", () => {
  let client: Web3ApiClient;
  let ensUri: string;
  let ethersProvider: providers.JsonRpcProvider;
  let ensAddress: string;
  let registrarAddress: string;
  let resolverAddress: string;
  let owner: string;

  const domain: string = "doe.eth";
  const subdomain: string = "john.doe.eth";
  const network: string = "testnet";

  beforeAll(async () => {
    const {
      ensAddress: ensRegistryAddress,
      registrarAddress: ensRegistrarAddress,
      resolverAddress: ensResolverAddress,
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
    owner = await ethersProvider.getSigner().getAddress();
    ensAddress = ensRegistryAddress;
    registrarAddress = ensRegistrarAddress;
    resolverAddress = ensResolverAddress;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("should deploy FIFS Registrar", async () => {
    const {
      data: fifsDeploymentData,
      errors: fifsDeploymentErrors,
    } = await client.query({
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
        network,
      },
    });

    expect(fifsDeploymentData?.deployFIFSRegistrar).toBeDefined();
    expect(fifsDeploymentErrors).toBeUndefined();

    const variables = {
      domain,
      owner,
      registryAddress: ensAddress,
      registrarAddress: registrarAddress,
      network,
    };

    const { data: registerData, errors: registerErrors } = await client.query<{
      registerDomain: string;
    }>({
      uri: ensUri,
      query: `mutation {
        registerDomain(
          domain: $domain
          owner: $owner
          registrarAddress: $registrarAddress
          registryAddress: $registryAddress
          connection: {
            networkNameOrChainId: $network
          }
        )
      }`,
      variables,
    });

    expect(registerData?.registerDomain).toBeDefined();
    expect(registerErrors).toBeUndefined();
  });

  it("should set and get resolver", async () => {
    const setResolverVariables = {
      domain,
      owner,
      registry: ensAddress,
      resolver: resolverAddress,
      network,
    };
    const {
      data: setResolverData,
      errors: setResolverErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        mutation {
          setResolver(
            domain: $domain
            resolverAddress: $resolver
            registryAddress: $registry
            owner: $owner
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: setResolverVariables,
    });

    expect(setResolverData?.setResolver).toBeDefined();
    expect(setResolverErrors).toBeUndefined();

    const getResolverVariables = {
      domain,
      registryAddress: ensAddress,
      network,
    };

    const {
      data: getResolverData,
      errors: getResolverErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getResolver(
            domain: $domain
            registryAddress: $registryAddress
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getResolverVariables,
    });

    expect(getResolverData?.getResolver).toEqual(resolverAddress);
    expect(getResolverErrors).toBeUndefined();
  });

  it("should set subdomain record and fetch it", async () => {
    const setSubdomainRecordVariables = {
      subdomain,
      owner,
      registry: ensAddress,
      network,
    };

    const {
      data: setSubdomainData,
      errors: setSubdomainErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        mutation {
          setSubdomainOwner(
            subdomain: $subdomain
            owner: $owner
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: setSubdomainRecordVariables,
    });

    expect(setSubdomainData?.setSubdomainOwner).toBeDefined();
    expect(setSubdomainErrors).toBeUndefined();

    const getSubdomainRecordVariables = {
      domain: subdomain,
      registry: ensAddress,
      network,
    };

    const {
      data: getSubdomainRecordData,
      errors: getSubdomainRecordErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getOwner(
            domain: $domain
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getSubdomainRecordVariables,
    });

    expect(getSubdomainRecordData?.getOwner).toBeDefined();
    expect(getSubdomainRecordErrors).toBeUndefined();
  });

  it("should update and fetch owner", async () => {
    const getOldOwnerVariables = {
      domain,
      registry: ensAddress,
      network,
    };

    const {
      data: getOldOwnerData,
      errors: getOldOwnerErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getOwner(
            domain: $domain
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getOldOwnerVariables,
    });

    expect(getOldOwnerData?.getOwner).toEqual(owner);
    expect(getOldOwnerErrors).toBeUndefined();

    const setOwnerVariables = {
      domain,
      newOwner: AddressOne,
      registry: ensAddress,
      network,
    };

    const { data: setOwnerData, errors: setOwnerErrors } = await client.query({
      uri: ensUri,
      query: `
        mutation {
          setOwner(
            domain: $domain
            newOwner: $newOwner
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: setOwnerVariables,
    });

    expect(setOwnerData?.setOwner).toBeDefined();
    expect(setOwnerErrors).toBeUndefined();

    const getNewOwnerVariables = {
      domain,
      registry: ensAddress,
      network,
    };

    const {
      data: getNewOwnerData,
      errors: getNewOwnerErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getOwner(
            domain: $domain
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getNewOwnerVariables,
    });

    expect(getNewOwnerData?.getOwner).toEqual(AddressOne);
    expect(getNewOwnerErrors).toBeUndefined();
  });

  it("should set content hash and fetch it", async () => {
    const cid = "0x64EC88CA00B268E5BA1A35678A1B5316D212F4F366B2477232534A8AECA37F3C".toLowerCase();
    const setContentHashVariables = {
      domain: subdomain,
      cid,
      resolver: resolverAddress,
      network: "testnet",
    };

    const {
      data: setContentHashData,
      errors: setContentHashErrors,
    } = await client.query({
      uri: ensUri,
      query: `
      mutation {
        setContentHash(
          domain: $domain
          cid: $cid
          resolverAddress: $resolver
          connection: {
            networkNameOrChainId: $network
          }
          )
        }
        `,
      variables: setContentHashVariables,
    });

    expect(setContentHashData?.setContentHash).toBeDefined();
    expect(setContentHashErrors).toBeUndefined();

    const getContentHashVariables = {
      domain: subdomain,
      resolver: resolverAddress,
      network,
    };

    const {
      data: getContentHashData,
      errors: getContentHashErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getContentHash(
            domain: $domain
            resolverAddress: $resolver
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getContentHashVariables,
    });

    expect(getContentHashData?.getContentHash).toEqual(cid);
    expect(getContentHashErrors).toBeUndefined();
  });

  it("should add subdomain record", async () => {
    const setSubdomainRecordVariables = {
      domain: subdomain,
      owner,
      registry: ensAddress,
      resolver: resolverAddress,
      ttl: "0",
      label: "label",
      network,
    };

    const {
      data: setSubdomainRecordData,
      errors: setSubdomainRecordErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        mutation {
          setSubdomainRecord(
            domain: $domain
            label: $label
            owner: $owner
            registryAddress: $registry
            resolverAddress: $resolver
            ttl: $ttl
            network: $network
          )
        }
      `,
      variables: setSubdomainRecordVariables,
    });

    console.log({ setSubdomainRecordErrors });
    expect(setSubdomainRecordData?.setSubdomainRecord).toBeDefined();
    expect(setSubdomainRecordErrors).toBeUndefined();
  });

  it.skip("should set address and fetch it", async () => {
    const setAddressVariables = {
      domain,
      address: owner,
      resolver: resolverAddress,
      network,
    };

    const {
      data: setAddressData,
      errors: setAddressErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        mutation {
          setAddress(
            domain: $domain
            address: $address
            resolverAddress: $resolver
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: setAddressVariables,
    });

    expect(setAddressData).toBeDefined();
    expect(setAddressErrors).toBeUndefined();

    const getAddressVariables = {
      domain,
      resolver: resolverAddress,
      network,
    };

    const {
      data: getAddressData,
      errors: getAddressErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getAddress(
            domain: $domain
            resolverAddress: $resolver
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getAddressVariables,
    });

    expect(getAddressData?.getAddress).toEqual(owner);
    expect(getAddressErrors).toBeUndefined();

    const getAddressFromDomainVariables = {
      domain,
      registry: ensAddress,
      network,
    };

    const {
      data: getAddressFromDomainData,
      errors: getAddressFromDomainErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getAddressFromDomain(
            domain: $domain
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getAddressFromDomainVariables,
    });

    expect(getAddressFromDomainData?.getAddressFromDomain).toEqual(owner);
    expect(getAddressFromDomainErrors).toBeUndefined();
  });
});
