import { PolywrapClient } from "@polywrap/client-js"
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
import { sha3Plugin } from "..";

const testMessage = "test message to hash"

describe("js-sha3 algorithms returned values match the plugin's", () => {
  let client: PolywrapClient

  beforeAll(() => {
    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/sha3.polywrap.eth",
          plugin: sha3Plugin({ }),
        },
      ]
    })
  })
  
  it("sha3_512 matches", async () => {
    const expected = sha3_512(testMessage)
    const response = await client.query<{ sha3_512: string }>({
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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
      uri: "wrap://ens/sha3.polywrap.eth",
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