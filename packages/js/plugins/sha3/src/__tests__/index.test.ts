import { Uri } from "@web3api/core-js"
import { Web3ApiClient } from "@web3api/client-js"
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
  cshake128,
  cshake256,
  kmac128,
  kmac256,
} from "js-sha3";
import { SHA3Plugin } from "..";

const testMessage = "test message to hash"
const testFunctionName = "testFunctionName"
const testCustomization = "testCustomization"
const testKey = "testKey"

describe("js-sha3 algorithms returned values match the plugin's", () => {
  let client: Web3ApiClient

  beforeAll(() => {
    client = new Web3ApiClient({
      redirects: [
        {
          from: new Uri("w3://ens/sha3.web3api.eth"),
          to: {
            factory: () => new SHA3Plugin(),
            manifest: SHA3Plugin.manifest(),
          },
        },
      ]
    })
  })
  
  it("sha3_512 matches", async () => {
    const expected = sha3_512(testMessage)
    const response = await client.query<{ sha3_512: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          sha3_512(message: "${testMessage}")
        }
      `,
    })

    console.log(response.errors)

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.sha3_512).toBe(expected)
  })
  
  it("sha3_384 matches", async () => {
    const expected = sha3_384(testMessage)
    const response = await client.query<{ sha3_384: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
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
      uri: new Uri("w3://ens/sha3.web3api.eth"),
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
      uri: new Uri("w3://ens/sha3.web3api.eth"),
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
    const response = await client.query<{ keccak512: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          keccak512(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak512).toBe(expected)
  })

  it("keccak384 matches", async () => {
    const expected = keccak384(testMessage)
    const response = await client.query<{ keccak384: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          keccak384(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak384).toBe(expected)
  })

  it("keccak256 matches", async () => {
    const expected = keccak256(testMessage)
    const response = await client.query<{ keccak256: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          keccak256(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak256).toBe(expected)
  })

  it("keccak224 matches", async () => {
    const expected = keccak224(testMessage)
    const response = await client.query<{ keccak224: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          keccak224(message: "${testMessage}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.keccak224).toBe(expected)
  })

  it("shake128 matches", async () => {
    const expected = shake128(testMessage, 256)
    const response = await client.query<{ shake128: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          shake128(message: "${testMessage}", outputBits: 256)
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.shake128).toBe(expected)
  })

  it("shake256 matches", async () => {
    const expected = shake256(testMessage, 512)
    const response = await client.query<{ shake256: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          shake256(message: "${testMessage}", outputBits: 512)
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.shake256).toBe(expected)
  })

  it("cshake128 matches", async () => {
    const expected = cshake128(testMessage, 256, testFunctionName, testCustomization)
    const response = await client.query<{ cshake128: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          cshake128(message: "${testMessage}", outputBits: 256, functionName: "${testFunctionName}", customization: "${testCustomization}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.cshake128).toBe(expected)
  })

  it("cshake256 matches", async () => {
    const expected = cshake256(testMessage, 512, testFunctionName, testCustomization)
    const response = await client.query<{ cshake256: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          cshake256(message: "${testMessage}", outputBits: 512, functionName: "${testFunctionName}", customization: "${testCustomization}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.cshake256).toBe(expected)
  })

  it("kmac128 matches", async () => {
    const expected = kmac128(testKey, testMessage, 256, testCustomization)
    const response = await client.query<{ kmac128: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          kmac128(key: "${testKey}", message: "${testMessage}", outputBits: 256, customization: "${testCustomization}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.kmac128).toBe(expected)
  })

  it("kmac256 matches", async () => {
    const expected = kmac256(testKey, testMessage, 512, testCustomization)
    const response = await client.query<{ kmac256: string }>({
      uri: new Uri("w3://ens/sha3.web3api.eth"),
      query: `
        query {
          kmac256(key: "${testKey}", message: "${testMessage}", outputBits: 512, customization: "${testCustomization}")
        }
      `,
    })

    expect(response.data).toBeDefined()
    expect(response.errors).toBeUndefined()
    expect(response.data?.kmac256).toBe(expected)
  })
})