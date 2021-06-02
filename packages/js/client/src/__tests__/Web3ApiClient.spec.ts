import {
  createWeb3ApiClient
} from "../";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment
} from "@web3api/test-env-js";
import { GetPathToTestApis } from "@web3api/test-cases";

jest.setTimeout(50000);

describe("Web3ApiClient", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    const { ipfs, ethereum, ensAddress: ens } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async () => {
    return createWeb3ApiClient({
      ethereum: {
        networks: {
          testnet: {
            provider: ethProvider
          },
        },
      },
      ipfs: { provider: ipfsProvider },
      ens: {
        addresses: {
          testnet: ensAddress
        }
      }
    })
  }

  it("simple-storage", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/simple-storage`,
      ipfsProvider,
      ensAddress
    );

    const client = await getClient();

    const ensUri = `ens/testnet/${api.ensDomain}`;
    const ipfsUri = `ipfs/${api.ipfsCid}`;

    const deploy = await client.query<{
      deployContract: string;
    }>({
      uri: ensUri,
      query: `
        mutation {
          deployContract(
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
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
            connection: {
              networkNameOrChainId: "testnet"
            }
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
      secondGetData: number;
      thirdGetData: number;
    }>({
      uri: ensUri,
      query: `
        query {
          getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          secondGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
          thirdGetData: getData(
            address: "${address}"
            connection: {
              networkNameOrChainId: "testnet"
            }
          )
        }
      `,
    });

    expect(get.errors).toBeFalsy();
    expect(get.data).toBeTruthy();
    expect(get.data?.getData).toBe(55);
    expect(get.data?.secondGetData).toBe(55);
    expect(get.data?.thirdGetData).toBe(55);
  });

  it("object-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/object-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    const method1a = await client.query<{
      method1: {
        prop: string;
        nested: {
          prop: string;
        };
      }[];
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
            prop: "arg1 nested prop",
          },
        },
        {
          prop: "",
          nested: {
            prop: "",
          },
        },
      ],
    });

    const method1b = await client.query<{
      method1: {
        prop: string;
        nested: {
          prop: string;
        };
      }[];
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
            prop: "arg1 nested prop",
          },
        },
        {
          prop: "arg2 prop",
          nested: {
            prop: "arg2 circular prop",
          },
        },
      ],
    });

    const method2a = await client.query<{
      method2: {
        prop: string;
        nested: {
          prop: string;
        };
      } | null;
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
          prop: "arg nested prop",
        },
      },
    });

    const method2b = await client.query<{
      method2: {
        prop: string;
        nested: {
          prop: string;
        };
      } | null;
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
      method2: null,
    });

    const method3 = await client.query<{
      method3: ({
        prop: string;
        nested: {
          prop: string;
        };
      } | null)[];
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
            prop: "arg nested prop",
          },
        },
      ],
    });

    const method5 = await client.query<{
      method5: {
        prop: string;
        nested: {
          prop: string;
        };
      };
    }>({
      uri: ensUri,
      query: `
        query {
          method5(
            arg: {
              prop: [49, 50, 51, 52]
            }
          )
        }
      `,
    });

    expect(method5.errors).toBeFalsy();
    expect(method5.data).toBeTruthy();
    expect(method5.data).toMatchObject({
      method5: {
        prop: "1234",
        nested: {
          prop: "nested prop",
        },
      },
    });
  });

  it("bigint-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/bigint-type`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    {
      const response = await client.query<{
        method: string
      }>({
        uri: ensUri,
        query: `query {
          method(
            arg1: "123456789123456789"
            obj: {
              prop1: "987654321987654321"
            }
          )
        }`
      });

      const result = BigInt("123456789123456789") * BigInt("987654321987654321");

      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        method: result.toString()
      });
    }

    {
      const response = await client.query<{
        method: string
      }>({
        uri: ensUri,
        query: `query {
          method(
            arg1: "123456789123456789"
            arg2: "123456789123456789123456789123456789"
            obj: {
              prop1: "987654321987654321"
              prop2: "987654321987654321987654321987654321"
            }
          )
        }`
      });

      const result = BigInt("123456789123456789")
        * BigInt("123456789123456789123456789123456789")
        * BigInt("987654321987654321")
        * BigInt("987654321987654321987654321987654321");

      expect(response.errors).toBeFalsy();
      expect(response.data).toBeTruthy();
      expect(response.data).toMatchObject({
        method: result.toString()
      });
    }
  });

  it("bytes-type", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/bytes-type`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    const response = await client.query<{
      bytesMethod: Buffer;
    }>({
      uri: ensUri,
      query: `
        query {
          bytesMethod(
            arg: {
              prop: $buffer
            }
          )
        }
      `,
      variables: {
        buffer: Buffer.from("Argument Value"),
      },
    });

    expect(response.errors).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data).toMatchObject({
      bytesMethod: Buffer.from("Argument Value Sanity!").buffer,
    });
  });

  it("enum-types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/enum-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;

    const client = await getClient();

    const method1a = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method1(
            en: 5
          )
        }
      `,
    });

    expect(method1a.errors).toBeTruthy();
    expect((method1a.errors as Error[])[0].message).toMatch(
      /__w3_abort: Invalid value for enum 'Enum': 5/gm
    );

    const method1b = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method1(
            en: 2
            optEnum: 1
          )
        }
      `,
    });

    expect(method1b.errors).toBeFalsy();
    expect(method1b.data).toBeTruthy();
    expect(method1b.data).toMatchObject({
      method1: 2,
    });

    const method1c = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method1(
            en: 1
            optEnum: INVALID
          )
        }
      `,
    });

    expect(method1c.errors).toBeTruthy();
    // @ts-ignore
    expect(method1c.errors[0].message).toMatch(
      /__w3_abort: Invalid key for enum 'Enum': INVALID/gm
    );

    const method2a = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method2(
            enumArray: [OPTION1, 0, OPTION3]
          )
        }
      `,
    });

    expect(method2a.errors).toBeFalsy();
    expect(method2a.data).toBeTruthy();
    expect(method2a.data).toMatchObject({
      method2: [0, 0, 2],
    });
  });

  it("should work with large types", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/large-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    const largeStr = new Array(10000).join("web3api ")
    const largeBytes = new Uint8Array(Buffer.from(largeStr));
    const largeStrArray = [];
    const largeBytesArray = [];

    for (let i=0; i<100; i++) {
      largeStrArray.push(largeStr);
      largeBytesArray.push(largeBytes);
    }

    const largeTypesMethodCall = await client.query<any>({
      uri: ensUri,
      query: `
        query {
          method(
            largeCollection: {
              largeStr: $largeStr
              largeBytes: $largeBytes
              largeStrArray: $largeStrArray
              largeBytesArray: $largeBytesArray
            }
          )
        }
      `,
      variables: {
        largeStr: largeStr,
        largeBytes: largeBytes,
        largeStrArray: largeStrArray,
        largeBytesArray: largeBytesArray,
      }
    });

    expect(largeTypesMethodCall.data).toBeTruthy();
    expect(largeTypesMethodCall.data).toEqual({
      method: {
        largeStr: largeStr,
        largeBytes: largeBytes,
        largeStrArray: largeStrArray,
        largeBytesArray: largeBytesArray
      }
    });
  });

  it("number-types under and overflows", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/number-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    const i8Underflow = await client.query<{
      i8Method: number
    }>({
      uri: ensUri,
      query: `
      query {
        i8Method(
          first: $firstInt
          second: $secondInt
        )
      }
    `,
      variables: {
        firstInt: -129, // min i8 = -128
        secondInt: 10
      }
    });
    expect(i8Underflow.errors).toBeTruthy();
    expect(i8Underflow.errors?.[0].message).toMatch(
      /integer overflow: value = -129; bits = 8/
    );
    expect(i8Underflow.data?.i8Method).toBeUndefined();

    const u8Overflow = await client.query<{
      u8Method: number
    }>({
      uri: ensUri,
      query: `
        query {
          u8Method(
            first: $firstInt
            second: $secondInt
          )
        }
      `,
      variables: {
        firstInt: 256, // max u8 = 255
        secondInt: 10
      }
    });
    expect(u8Overflow.errors).toBeTruthy();
    expect(u8Overflow.errors?.[0].message).toMatch(
      /unsigned integer overflow: value = 256; bits = 8/
    );
    expect(u8Overflow.data?.u8Method).toBeUndefined();

    const i16Underflow = await client.query<{
      i16Method: number
    }>({
      uri: ensUri,
      query: `
      query {
        i16Method(
          first: $firstInt
          second: $secondInt
        )
      }
    `,
      variables: {
        firstInt: -32769, // min i16 = -32768
        secondInt: 10
      }
    });
    expect(i16Underflow.errors).toBeTruthy();
    expect(i16Underflow.errors?.[0].message).toMatch(
      /integer overflow: value = -32769; bits = 16/
    );
    expect(i16Underflow.data?.i16Method).toBeUndefined();

    const u16Overflow = await client.query<{
      u16Method: number
    }>({
      uri: ensUri,
      query: `
        query {
          u16Method(
            first: $firstInt
            second: $secondInt
          )
        }
      `,
      variables: {
        firstInt: 65536, // max u16 = 65535
        secondInt: 10
      }
    });
    expect(u16Overflow.errors).toBeTruthy();
    expect(u16Overflow.errors?.[0].message).toMatch(
      /unsigned integer overflow: value = 65536; bits = 16/
    );
    expect(u16Overflow.data?.u16Method).toBeUndefined();

    const i32Underflow = await client.query<{
      i32Method: number
    }>({
      uri: ensUri,
      query: `
      query {
        i32Method(
          first: $firstInt
          second: $secondInt
        )
      }
    `,
      variables: {
        firstInt: -2147483649, // min i32 = -2147483648
        secondInt: 10
      }
    });
    expect(i32Underflow.errors).toBeTruthy();
    expect(i32Underflow.errors?.[0].message).toMatch(
      /integer overflow: value = -2147483649; bits = 32/
    );
    expect(i32Underflow.data?.i32Method).toBeUndefined();

    const u32Overflow = await client.query<{
      u32Method: number
    }>({
      uri: ensUri,
      query: `
        query {
          u32Method(
            first: $firstInt
            second: $secondInt
          )
        }
      `,
      variables: {
        firstInt: 4294967296, // max u32 = 4294967295
        secondInt: 10
      }
    });
    expect(u32Overflow.errors).toBeTruthy();
    expect(u32Overflow.errors?.[0].message).toMatch(
      /unsigned integer overflow: value = 4294967296; bits = 32/
    );
    expect(u32Overflow.data?.u32Method).toBeUndefined();

    const i64Underflow = await client.query<{
      i64Method: number
    }>({
      uri: ensUri,
      query: `
      query {
        i64Method(
          first: $firstInt
          second: $secondInt
        )
      }
    `,
      variables: {
        firstInt: -9223372036854775809, // min i32 = -9223372036854775808
        secondInt: 10
      }
    });
    expect(i64Underflow.errors).toBeTruthy();
    expect(i64Underflow.errors?.[0].message).toMatch(
      /Property must be of type 'int'. Found 'float64'./
    );
    expect(i64Underflow.data?.i64Method).toBeUndefined();

    const u64Overflow = await client.query<{
      u64Method: number
    }>({
      uri: ensUri,
      query: `
        query {
          u64Method(
            first: $firstInt
            second: $secondInt
          )
        }
      `,
      variables: {
        firstInt: 18446744073709551616, // max u64 = 18446744073709551615
        secondInt: 10
      }
    });
    expect(u64Overflow.errors).toBeTruthy();
    expect(u64Overflow.errors?.[0].message).toMatch(
      /Property must be of type 'uint'. Found 'float64'/
    );
    expect(u64Overflow.data?.u64Method).toBeUndefined();
  });

  it("invalid type errors", async () => {
    const api = await buildAndDeployApi(
      `${GetPathToTestApis()}/invalid-types`,
      ipfsProvider,
      ensAddress
    );
    const ensUri = `ens/testnet/${api.ensDomain}`;
    const client = await getClient();

    const invalidBoolIntSent = await client.query({
      uri: ensUri,
      query: `
      query {
        boolMethod(
          arg: $integer
        )
      }
    `,
      variables: {
        integer: 10
      }
    });
    expect(invalidBoolIntSent.errors).toBeTruthy();
    expect(invalidBoolIntSent.errors?.[0].message).toMatch(
      /Property must be of type 'bool'. Found 'int'./
    );

    const invalidIntBoolSent = await client.query({
      uri: ensUri,
      query: `
      query {
        intMethod(
          arg: $bool
        )
      }
    `,
      variables: {
        bool: true
      }
    });
    expect(invalidIntBoolSent.errors).toBeTruthy();
    expect(invalidIntBoolSent.errors?.[0].message).toMatch(
      /Property must be of type 'int'. Found 'bool'./
    );

    const invalidUIntArraySent = await client.query({
      uri: ensUri,
      query: `
      query {
        uIntMethod(
          arg: $array
        )
      }
    `,
      variables: {
        array: [10]
      }
    });
    expect(invalidUIntArraySent.errors).toBeTruthy();
    expect(invalidUIntArraySent.errors?.[0].message).toMatch(
      /Property must be of type 'uint'. Found 'array'./
    );

    const invalidBytesFloatSent = await client.query({
      uri: ensUri,
      query: `
      query {
        bytesMethod(
          arg: $float
        )
      }
    `,
      variables: {
        float: 10.15
      }
    });
    expect(invalidBytesFloatSent.errors).toBeTruthy();
    expect(invalidBytesFloatSent.errors?.[0].message).toMatch(
      /Property must be of type 'bytes'. Found 'float64'./
    );

    const invalidArrayMapSent = await client.query({
      uri: ensUri,
      query: `
      query {
        arrayMethod(
          arg: $object
        )
      }
    `,
      variables: {
        object: {
          prop: "prop"
        }
      }
    });
    expect(invalidArrayMapSent.errors).toBeTruthy();
    expect(invalidArrayMapSent.errors?.[0].message).toMatch(
      /Property must be of type 'array'. Found 'map'./
    );
  });
});
