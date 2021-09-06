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

describe("ENS Wrapper", () => {
  // We will have two clients because we need two
  // different signers in order to test ENS functions
  let ownerClient: Web3ApiClient;
  let anotherOwnerClient: Web3ApiClient;

  let ensUri: string;
  let ethersProvider: providers.JsonRpcProvider;
  let ensAddress: string;
  let registrarAddress: string;
  let resolverAddress: string;
  let reverseRegistryAddress: string;
  let customFifsRegistrarAddress: string;

  let owner: string;
  let anotherOwner: string;

  const customTld: string = "doe.eth";
  const openSubdomain: string = "open." + customTld;
  const customSubdomain: string = "john." + customTld;

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

    // deploy api
    const apiPath: string = path.resolve(__dirname + "/../../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensRegistryAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;

    // set up ethers provider
    ethersProvider = providers.getDefaultProvider(
      "http://localhost:8546"
    ) as providers.JsonRpcProvider;
    owner = await ethersProvider.getSigner(0).getAddress();
    anotherOwner = await ethersProvider.getSigner(1).getAddress();
    ensAddress = ensRegistryAddress;
    registrarAddress = ensRegistrarAddress;
    resolverAddress = ensResolverAddress;
    reverseRegistryAddress = ensReverseAddress;

    // get client
    const plugins = getPlugins(ethereum, ipfs, ensRegistryAddress);
    ownerClient = new Web3ApiClient({ plugins });

    const anotherOwnerRedirects = getPlugins(
      ethereum,
      ipfs,
      ensRegistryAddress,
      anotherOwner
    );
    anotherOwnerClient = new Web3ApiClient({ plugins: anotherOwnerRedirects });
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("should register domain", async () => {
    const variables = {
      domain: customTld,
      owner,
      registryAddress: ensAddress,
      registrarAddress: registrarAddress,
      network,
    };

    const {
      data: registerData,
      errors: registerErrors,
    } = await ownerClient.query<{
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
      domain: customTld,
      owner,
      registry: ensAddress,
      resolver: resolverAddress,
      network,
    };
    const {
      data: setResolverData,
      errors: setResolverErrors,
    } = await ownerClient.query({
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
      domain: customTld,
      registry: ensAddress,
      network,
    };

    const {
      data: getResolverData,
      errors: getResolverErrors,
    } = await ownerClient.query({
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

  it("should set owner of subdomain and fetch it", async () => {
    const subdomain = "bob." + customTld;
    const setSubdomainOwnerVariables = {
      subdomain,
      owner,
      registry: ensAddress,
      network,
    };

    const {
      data: setSubdomainOwnerData,
      errors: setSubdomainErrors,
    } = await ownerClient.query({
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

    const {
      data: getOwnerData,
      errors: getOwnerErrors,
    } = await ownerClient.query({
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
      domain: customTld,
      owner: anotherOwner,
      registry: ensAddress,
      resolver: resolverAddress,
      ttl: "0",
      label: "john",
      network,
    };

    const {
      data: setSubdomainRecordData,
      errors: setSubdomainRecordErrors,
    } = await ownerClient.query({
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
      domain: customSubdomain,
      registry: ensAddress,
      network,
    };

    const {
      data: getOwnerData,
      errors: getOwnerErrors,
    } = await ownerClient.query({
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
    expect(getOwnerData?.getOwner).toEqual(anotherOwner);
    expect(getOwnerErrors).toBeUndefined();
  });

  it("should update and fetch owner", async () => {
    const getOldOwnerVariables = {
      domain: customSubdomain,
      registry: ensAddress,
      network,
    };

    const {
      data: getOldOwnerData,
      errors: getOldOwnerErrors,
    } = await anotherOwnerClient.query({
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

    expect(getOldOwnerData?.getOwner).toEqual(anotherOwner);
    expect(getOldOwnerErrors).toBeUndefined();

    const setOwnerVariables = {
      domain: customSubdomain,
      newOwner: owner,
      registry: ensAddress,
      network,
    };

    const {
      data: setOwnerData,
      errors: setOwnerErrors,
    } = await anotherOwnerClient.query({
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
      domain: customSubdomain,
      registry: ensAddress,
      network,
    };

    const {
      data: getNewOwnerData,
      errors: getNewOwnerErrors,
    } = await ownerClient.query({
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

    expect(getNewOwnerData?.getOwner).toEqual(owner);
    expect(getNewOwnerErrors).toBeUndefined();
  });

  it("should set content hash and fetch it", async () => {
    const cid = "0x64EC88CA00B268E5BA1A35678A1B5316D212F4F366B2477232534A8AECA37F3C".toLowerCase();
    const setContentHashVariables = {
      domain: customSubdomain,
      cid,
      resolver: resolverAddress,
      network,
    };

    const {
      data: setContentHashData,
      errors: setContentHashErrors,
    } = await ownerClient.query({
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
      domain: customSubdomain,
      resolver: resolverAddress,
      network,
    };

    const {
      data: getContentHashData,
      errors: getContentHashErrors,
    } = await ownerClient.query({
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

    const getContentHashFromDomainVariables = {
      domain: customSubdomain,
      registry: ensAddress,
      network,
    };

    const {
      data: getContentHashFromDomainData,
      errors: getContentHashFromDomainErrors,
    } = await ownerClient.query({
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
      domain: customTld,
      address: anotherOwner,
      resolver: resolverAddress,
      network,
    };

    const {
      data: setAddressData,
      errors: setAddressErrors,
    } = await ownerClient.query({
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
      domain: customTld,
      resolver: resolverAddress,
      network,
    };

    const {
      data: getAddressData,
      errors: getAddressErrors,
    } = await ownerClient.query({
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

    expect(getAddressData?.getAddress).toEqual(anotherOwner);
    expect(getAddressErrors).toBeUndefined();

    const getAddressFromDomainVariables = {
      domain: customTld,
      registry: ensAddress,
      network,
    };

    const {
      data: getAddressFromDomainData,
      errors: getAddressFromDomainErrors,
    } = await ownerClient.query({
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

    expect(getAddressFromDomainData?.getAddressFromDomain).toEqual(
      anotherOwner
    );
    expect(getAddressFromDomainErrors).toBeUndefined();
  });

  it("should set reverse registry", async () => {
    const serReverseRegistryVariables = {
      domain: customTld,
      owner,
      reverseRegistry: reverseRegistryAddress,
      network,
    };

    const {
      data: reverseRegistryData,
      errors: reverseRegistryErrors,
    } = await ownerClient.query({
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
    } = await ownerClient.query({
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

    expect(getNameFromAddressData?.getNameFromAddress).toEqual(customTld);
    expect(getNameFromAddressErrors).toBeUndefined();

    const getNameFromReverseResolverVariables = {
      address: owner,
      resolver: resolverAddress,
      network,
    };

    const {
      data: getNameFromReverseResolverData,
      errors: getNameFromReverseResolverErrors,
    } = await ownerClient.query({
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
      customTld
    );
    expect(getNameFromReverseResolverErrors).toBeUndefined();
  });

  it("should set and get text record from subdomain", async () => {
    const key = "snapshot";
    const value = "QmHash";

    const setTextRecordVariables = {
      domain: customTld,
      resolver: resolverAddress,
      key,
      value,
      network,
    };

    const {
      data: setTextRecordData,
      errors: setTextRecordErrors,
    } = await ownerClient.query({
      uri: ensUri,
      query: `
        mutation {
          setTextRecord(
            domain: $domain
            resolverAddress: $resolver
            key: $key
            value: $value
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: setTextRecordVariables,
    });

    expect(setTextRecordData?.setTextRecord).toBeDefined();
    expect(setTextRecordErrors).toBeUndefined();

    const getTextRecordVariables = {
      domain: customTld,
      resolver: resolverAddress,
      key,
      network,
    };

    const {
      data: getTextRecordData,
      errors: getTextRecordErrors,
    } = await ownerClient.query({
      uri: ensUri,
      query: `
        query {
          getTextRecord(
            domain: $domain
            resolverAddress: $resolver
            key: $key
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: getTextRecordVariables,
    });

    expect(getTextRecordData?.getTextRecord).toEqual(value);
    expect(getTextRecordErrors).toBeUndefined();
  });

  it("should configure open domain", async () => {
    const configureOpenDomainVariables = {
      registry: ensAddress,
      resolver: resolverAddress,
      registrar: registrarAddress,
      tld: openSubdomain,
      owner,
      network,
    };

    const {
      data: configureOpenDomainData,
      errors: configureOpenDomainErrors,
    } = await ownerClient.query<{
      configureOpenDomain: {
        fifsRegistrarAddress: string;
        setOwnerTxReceipt: any;
      };
    }>({
      uri: ensUri,
      query: `
        mutation {
          configureOpenDomain(
            tld: $tld,
            owner: $owner,
            registryAddress: $registry
            resolverAddress: $resolver
            registrarAddress: $registrar
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: configureOpenDomainVariables,
    });

    expect(configureOpenDomainData?.configureOpenDomain).toBeDefined();
    expect(configureOpenDomainErrors).toBeUndefined();

    const { data: getOwnerData } = await ownerClient.query({
      uri: ensUri,
      query: `
        query {
          getOwner(
            domain: $tld,
            registryAddress: $registry
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: {
        tld: openSubdomain,
        registry: ensAddress,
        network,
      },
    });

    expect(getOwnerData?.getOwner).toEqual(
      configureOpenDomainData?.configureOpenDomain.fifsRegistrarAddress
    );

    customFifsRegistrarAddress = configureOpenDomainData?.configureOpenDomain
      .fifsRegistrarAddress!;
  });

  it("should create subdomain in open domain", async () => {
    const createSubdomainInOpenDomainVariables = {
      label: "label",
      domain: openSubdomain,
      fifsRegistrarAddress: customFifsRegistrarAddress,
      registry: ensAddress,
      owner: anotherOwner,
      resolver: resolverAddress,
      network,
    };

    const {
      data: createSubdomainInOpenDomainData,
      errors: createSubdomainInOpenDomainErrors,
    } = await anotherOwnerClient.query({
      uri: ensUri,
      query: `
        mutation {
          createSubdomainInOpenDomain(
            label: $label,
            domain: $domain,
            owner: $owner,
            fifsRegistrarAddress: $fifsRegistrarAddress,
            registryAddress: $registry
            resolverAddress: $resolver
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: createSubdomainInOpenDomainVariables,
    });

    expect(
      createSubdomainInOpenDomainData?.createSubdomainInOpenDomain
    ).toBeDefined();
    expect(createSubdomainInOpenDomainErrors).toBeUndefined();
  });

  it("should create subdomain in open domain and set content hash", async () => {
    const cid = "0x64EC88CA00B268E5BA1A35678A1B5316D212F4F366B2477232534A8AECA37F3C".toLowerCase();
    const createSubdomainInOpenDomainAndSetContentHashVariables = {
      label: "label2",
      cid,
      domain: openSubdomain,
      fifsRegistrarAddress: customFifsRegistrarAddress,
      registry: ensAddress,
      owner: anotherOwner,
      resolver: resolverAddress,
      network,
    };

    const {
      data: createSubdomainInOpenDomainAndSetContentHashData,
      errors: createSubdomainInOpenDomainAndSetContentHashErrors,
    } = await anotherOwnerClient.query({
      uri: ensUri,
      query: `
        mutation {
          createSubdomainInOpenDomainAndSetContentHash(
            cid: $cid,
            label: $label,
            domain: $domain,
            owner: $owner,
            fifsRegistrarAddress: $fifsRegistrarAddress,
            registryAddress: $registry
            resolverAddress: $resolver
            connection: {
              networkNameOrChainId: $network
            }
          )
        }
      `,
      variables: createSubdomainInOpenDomainAndSetContentHashVariables,
    });

    expect(
      createSubdomainInOpenDomainAndSetContentHashData?.createSubdomainInOpenDomainAndSetContentHash
    ).toBeDefined();
    expect(createSubdomainInOpenDomainAndSetContentHashErrors).toBeUndefined();

    const getContentHashFromDomainVariables = {
      domain: "label2." + openSubdomain,
      registry: ensAddress,
      network,
    };

    const {
      data: getContentHashFromDomainData,
      errors: getContentHashFromDomainErrors,
    } = await ownerClient.query({
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
});
