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
  let reverseRegistryAddress: string;
  let owner: string;

  const domain: string = "doe.eth";
  const subdomain: string = "john." + domain;
  const anotherSubdomain: string = "bob." + domain;
  const network: string = "testnet";

  beforeAll(async () => {
    const {
      ensAddress: ensRegistryAddress,
      registrarAddress: ensRegistrarAddress,
      resolverAddress: ensResolverAddress,
      reverseAddress: ensReverseAddress,
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
    reverseRegistryAddress = ensReverseAddress;
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
      registry: ensAddress,
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
            registryAddress: $registry
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

  it("should set owner to subdomain and fetch it", async () => {
    const setSubdomainOwnerVariables = {
      subdomain,
      owner,
      registry: ensAddress,
      network,
    };

    const {
      data: setSubdomainOwnerData,
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
      variables: setSubdomainOwnerVariables,
    });

    expect(setSubdomainOwnerData?.setSubdomainOwner).toBeDefined();
    expect(setSubdomainErrors).toBeUndefined();

    const getOwnerVariables = {
      domain: subdomain,
      registry: ensAddress,
      network,
    };

    const { data: getOwnerData, errors: getOwnerErrors } = await client.query({
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
      variables: getOwnerVariables,
    });

    expect(getOwnerData?.getOwner).toBeDefined();
    expect(getOwnerErrors).toBeUndefined();
  });

  it("should set subdomain owner, resolver and ttl", async () => {
    const setSubdomainRecordVariables = {
      domain,
      owner,
      registry: ensAddress,
      resolver: resolverAddress,
      ttl: "0",
      label: "bob",
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
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: setSubdomainRecordVariables,
    });

    expect(setSubdomainRecordData?.setSubdomainRecord).toBeDefined();
    expect(setSubdomainRecordErrors).toBeUndefined();

    const getOwnerVariables = {
      domain: anotherSubdomain,
      registry: ensAddress,
      network,
    };

    const { data: getOwnerData, errors: getOwnerErrors } = await client.query({
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
      variables: getOwnerVariables,
    });
    expect(getOwnerData?.getOwner).toEqual(owner);
    expect(getOwnerErrors).toBeUndefined();
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

    await client.query({
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
      variables: {
        domain: subdomain,
        resolver: resolverAddress,
        registry: ensAddress,
        owner,
        network,
      },
    });

    const getContentHashFromDomainVariables = {
      domain: subdomain,
      registry: ensAddress,
      network,
    };

    const {
      data: getContentHashFromDomainData,
      errors: getContentHashFromDomainErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getContentHashFromDomain(
            domain: $domain
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getContentHashFromDomainVariables,
    });

    expect(getContentHashFromDomainData?.getContentHashFromDomain).toEqual(cid);
    expect(getContentHashFromDomainErrors).toBeUndefined();
  });

  it("should set address and fetch it", async () => {
    const setAddressVariables = {
      domain: anotherSubdomain,
      address: AddressOne,
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
      domain: anotherSubdomain,
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

    expect(getAddressData?.getAddress).toEqual(AddressOne);
    expect(getAddressErrors).toBeUndefined();

    const getAddressFromDomainVariables = {
      domain: anotherSubdomain,
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

    expect(getAddressFromDomainData?.getAddressFromDomain).toEqual(AddressOne);
    expect(getAddressFromDomainErrors).toBeUndefined();
  });

  it("should set reverse registry", async () => {
    const serReverseRegistryVariables = {
      domain: subdomain,
      owner,
      reverseRegistry: reverseRegistryAddress,
      network,
    };

    const {
      data: reverseRegistryData,
      errors: reverseRegistryErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        mutation {
          reverseRegisterDomain(
            domain: $domain
            reverseRegistryAddress: $reverseRegistry
            owner: $owner
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: serReverseRegistryVariables,
    });

    expect(reverseRegistryData?.reverseRegisterDomain).toBeDefined();
    expect(reverseRegistryErrors).toBeUndefined();
  });

  it("should fetch name based on address from registry and resolver", async () => {
    const getNameFromAddressVariables = {
      address: owner,
      registry: ensAddress,
      network,
    };

    const {
      data: getNameFromAddressData,
      errors: getNameFromAddressErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getNameFromAddress(
            address: $address
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getNameFromAddressVariables,
    });

    expect(getNameFromAddressData?.getNameFromAddress).toEqual(subdomain);
    expect(getNameFromAddressErrors).toBeUndefined();

    const getNameFromReverseResolverVariables = {
      address: owner,
      resolver: resolverAddress,
      network,
    };

    const {
      data: getNameFromReverseResolverData,
      errors: getNameFromReverseResolverErrors,
    } = await client.query({
      uri: ensUri,
      query: `
        query {
          getNameFromReverseResolver(
            address: $address
            resolverAddress: $resolver
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getNameFromReverseResolverVariables,
    });

    expect(getNameFromReverseResolverData?.getNameFromReverseResolver).toEqual(
      subdomain
    );
    expect(getNameFromReverseResolverErrors).toBeUndefined();
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
});
