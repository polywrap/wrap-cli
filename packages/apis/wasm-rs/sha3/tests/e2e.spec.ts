import { Web3ApiClient } from "@web3api/client-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import {
  sha3_512,
  sha3_384,
  sha3_256,
  sha3_224,
  keccak512,
  keccak384,
  keccak256,
  keccak224,
  shake128,
  shake256,
} from "js-sha3";
import path from "path";

jest.setTimeout(300000);

const testMessage = "test message to hash"

describe("js-sha3 algorithms returned values match the wrapper's", () => {
  let client: Web3ApiClient;
  let ensUri: string;

  beforeAll(async () => {
    // Setup local test environment
    const {
      ensAddress: ensRegistryAddress,
      ipfs,
      ethereum,
    } = await initTestEnvironment();

    // deploy the SHA3 api
    const apiPath: string = path.resolve(__dirname + "/../");
    const api = await buildAndDeployApi(apiPath, ipfs, ensRegistryAddress);
    ensUri = `ens/testnet/${api.ensDomain}`;

    client = new Web3ApiClient({
      plugins: [
        {
          uri: "ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: {
              testnet: {
                provider: ethereum,
              },
            },
            defaultNetwork: "testnet",
          }),
        },
        {
          uri: "ens/ipfs.web3api.eth",
          plugin: ipfsPlugin({ provider: ipfs }),
        },
        {
          uri: "ens/ens.web3api.eth",
          plugin: ensPlugin({
            addresses: {
              testnet: ensRegistryAddress
            }
          }),
        },
      ]
    });
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("sha3_512 matches", async () => {
    const expected = sha3_512(testMessage)
    const response = await client.query<{ sha3_512: string }>({
      uri: ensUri,
      query: `
        query {
          sha3_512(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.sha3_512).toBe(expected)
  })
  
  it("sha3_384 matches", async () => {
    const expected = sha3_384(testMessage)
    const response = await client.query<{ sha3_384: string }>({
      uri: ensUri,
      query: `
        query {
          sha3_384(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.sha3_384).toBe(expected)
  })

  it("sha3_256 matches", async () => {
    const expected = sha3_256(testMessage)
    const response = await client.query<{ sha3_256: string }>({
      uri: ensUri,
      query: `
        query {
          sha3_256(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.sha3_256).toBe(expected)
  })

  it("sha3_224 matches", async () => {
    const expected = sha3_224(testMessage)
    const response = await client.query<{ sha3_224: string }>({
      uri: ensUri,
      query: `
        query {
          sha3_224(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.sha3_224).toBe(expected)
  })

  it("keccak512 matches", async () => {
    const expected = keccak512(testMessage)
    const response = await client.query<{ keccak_512: string }>({
      uri: ensUri,
      query: `
        query {
          keccak_512(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak_512).toBe(expected)
  })

  it("keccak384 matches", async () => {
    const expected = keccak384(testMessage)
    const response = await client.query<{ keccak_384: string }>({
      uri: ensUri,
      query: `
        query {
          keccak_384(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak_384).toBe(expected)
  })

  it("keccak256 matches", async () => {
    const expected = keccak256(testMessage)
    const response = await client.query<{ keccak_256: string }>({
      uri: ensUri,
      query: `
        query {
          keccak_256(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak_256).toBe(expected)
  })

  it("keccak256 buffer matches", async () => {
    const encoder = new TextEncoder();
    const testMessageBuffer = encoder.encode(testMessage);
    const expected = keccak256(testMessageBuffer)
    const response = await client.query<{ buffer_keccak_256: Uint8Array }>({
      uri: ensUri,
      query: `
        query {
          buffer_keccak_256(message: $message)
        }
      `,
      variables: {
        message: testMessageBuffer
      }
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.buffer_keccak_256).toMatch(expected)
  })

  it("keccak224 matches", async () => {
    const expected = keccak224(testMessage)
    const response = await client.query<{ keccak_224: string }>({
      uri: ensUri,
      query: `
        query {
          keccak_224(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak_224).toBe(expected)
  })

  it("shake128 matches", async () => {
    const expected = shake128(testMessage, 256)
    const response = await client.query<{ shake_128: string }>({
      uri: ensUri,
      query: `
        query {
          shake_128(message: "${testMessage}", outputBits: 256)
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.shake_128).toBe(expected)
  })

  it("shake256 matches", async () => {
    const expected = shake256(testMessage, 512)
    const response = await client.query<{ shake_256: string }>({
      uri: ensUri,
      query: `
        query {
          shake_256(message: "${testMessage}", outputBits: 512)
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.shake_256).toBe(expected)
  })
})