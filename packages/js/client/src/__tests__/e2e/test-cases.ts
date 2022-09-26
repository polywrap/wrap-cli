import { PolywrapClient, Uri } from "../../";
import { BigNumber } from "bignumber.js";

export const runAsyncifyTest = async (
  client: PolywrapClient,
  wrapperUri: string
) => {
  const subsequentInvokes = await client.invoke<string>({
    uri: wrapperUri,
    method: "subsequentInvokes",
    args: {
      numberOfTimes: 40,
    },
  });

  const expected = Array.from(new Array(40), (_, index) => index.toString());

  expect(subsequentInvokes.error).toBeFalsy();
  expect(subsequentInvokes.data).toBeTruthy();
  expect(subsequentInvokes.data).toEqual(expected);

  const localVarMethod = await client.invoke<boolean>({
    uri: wrapperUri,
    method: "localVarMethod",
  });

  expect(localVarMethod.error).toBeFalsy();
  expect(localVarMethod.data).toBeTruthy();
  expect(localVarMethod.data).toEqual(true);

  const globalVarMethod = await client.invoke<boolean>({
    uri: wrapperUri,
    method: "globalVarMethod",
  });

  expect(globalVarMethod.error).toBeFalsy();
  expect(globalVarMethod.data).toBeTruthy();
  expect(globalVarMethod.data).toEqual(true);

  const largeStr = new Array(10000).join("polywrap ");
  const setDataWithLargeArgs = await client.invoke<string>({
    uri: wrapperUri,
    method: "setDataWithLargeArgs",
    args: {
      value: largeStr,
    },
  });

  expect(setDataWithLargeArgs.error).toBeFalsy();
  expect(setDataWithLargeArgs.data).toBeTruthy();
  expect(setDataWithLargeArgs.data).toEqual(largeStr);

  const setDataWithManyArgs = await client.invoke<string>({
    uri: wrapperUri,
    method: "setDataWithManyArgs",
    args: {
      valueA: "polywrap a",
      valueB: "polywrap b",
      valueC: "polywrap c",
      valueD: "polywrap d",
      valueE: "polywrap e",
      valueF: "polywrap f",
      valueG: "polywrap g",
      valueH: "polywrap h",
      valueI: "polywrap i",
      valueJ: "polywrap j",
      valueK: "polywrap k",
      valueL: "polywrap l",
    },
  });

  expect(setDataWithManyArgs.error).toBeFalsy();
  expect(setDataWithManyArgs.data).toBeTruthy();
  expect(setDataWithManyArgs.data).toEqual(
    "polywrap apolywrap bpolywrap cpolywrap dpolywrap epolywrap fpolywrap gpolywrap hpolywrap ipolywrap jpolywrap kpolywrap l"
  );

  const createObj = (i: number) => {
    return {
      propA: `a-${i}`,
      propB: `b-${i}`,
      propC: `c-${i}`,
      propD: `d-${i}`,
      propE: `e-${i}`,
      propF: `f-${i}`,
      propG: `g-${i}`,
      propH: `h-${i}`,
      propI: `i-${i}`,
      propJ: `j-${i}`,
      propK: `k-${i}`,
      propL: `l-${i}`,
    };
  };

  const setDataWithManyStructuredArgs = await client.invoke<string>({
    uri: wrapperUri,
    method: "setDataWithManyStructuredArgs",
    args: {
      valueA: createObj(1),
      valueB: createObj(2),
      valueC: createObj(3),
      valueD: createObj(4),
      valueE: createObj(5),
      valueF: createObj(6),
      valueG: createObj(7),
      valueH: createObj(8),
      valueI: createObj(9),
      valueJ: createObj(10),
      valueK: createObj(11),
      valueL: createObj(12),
    },
  });

  expect(setDataWithManyStructuredArgs.error).toBeFalsy();
  expect(setDataWithManyStructuredArgs.data).toBeTruthy();
  expect(setDataWithManyStructuredArgs.data).toBe(true);
};

export const runBigIntTypeTest = async (
  client: PolywrapClient,
  uri: string
) => {
  {
    const response = await client.invoke({
      uri,
      method: "method",
      args: {
        arg1: "123456789123456789",
        obj: {
          prop1: "987654321987654321",
        },
      },
    });

    const result = BigInt("123456789123456789") * BigInt("987654321987654321");

    expect(response.error).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data).toEqual(result.toString());
  }

  {
    const response = await client.invoke({
      uri,
      method: "method",
      args: {
        arg1: "123456789123456789",
        arg2: "123456789123456789123456789123456789",
        obj: {
          prop1: "987654321987654321",
          prop2: "987654321987654321987654321987654321",
        },
      },
    });

    const result =
      BigInt("123456789123456789") *
      BigInt("123456789123456789123456789123456789") *
      BigInt("987654321987654321") *
      BigInt("987654321987654321987654321987654321");

    expect(response.error).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data).toEqual(result.toString());
  }
};

export const runBigNumberTypeTest = async (
  client: PolywrapClient,
  uri: string
) => {
  {
    const response = await client.invoke({
      uri,
      method: "method",
      args: {
        arg1: "1234.56789123456789",
        obj: {
          prop1: "98.7654321987654321",
        },
      },
    });

    const arg1 = new BigNumber("1234.56789123456789");
    const prop1 = new BigNumber("98.7654321987654321");
    const result = arg1.times(prop1);

    expect(response.error).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data).toEqual(result.toFixed());
  }

  {
    const response = await client.invoke({
      uri,
      method: "method",
      args: {
        arg1: "1234567.89123456789",
        arg2: "123456789123.456789123456789123456789",
        obj: {
          prop1: "987654.321987654321",
          prop2: "987.654321987654321987654321987654321",
        },
      },
    });

    const arg1 = new BigNumber("1234567.89123456789");
    const arg2 = new BigNumber("123456789123.456789123456789123456789");
    const prop1 = new BigNumber("987654.321987654321");
    const prop2 = new BigNumber("987.654321987654321987654321987654321");
    const result = arg1.times(arg2).times(prop1).times(prop2);

    expect(response.error).toBeFalsy();
    expect(response.data).toBeTruthy();
    expect(response.data).toEqual(result.toFixed());
  }
};

export const runBytesTypeTest = async (client: PolywrapClient, uri: string) => {
  const response = await client.invoke({
    uri,
    method: "bytesMethod",
    args: {
      arg: {
        prop: Buffer.from("Argument Value"),
      },
    },
  });

  expect(response.error).toBeFalsy();
  expect(response.data).toBeTruthy();
  expect(response.data).toEqual(
    new TextEncoder().encode("Argument Value Sanity!")
  );
};

export const runEnumTypesTest = async (client: PolywrapClient, uri: string) => {
  const method1a = await client.invoke({
    uri,
    method: "method1",
    args: {
      en: 5,
    },
  });

  expect(method1a.error).toBeTruthy();
  expect((method1a.error as Error).message).toMatch(
    /__wrap_abort: Invalid value for enum 'SanityEnum': 5/gm
  );

  const method1b = await client.invoke({
    uri,
    method: "method1",
    args: {
      en: 2,
      optEnum: 1,
    },
  });

  expect(method1b.error).toBeFalsy();
  expect(method1b.data).toBeTruthy();
  expect(method1b.data).toEqual(2);

  const method1c = await client.invoke({
    uri,
    method: "method1",
    args: {
      en: 1,
      optEnum: "INVALID",
    },
  });

  expect(method1c.error).toBeTruthy();
  expect(method1c.error?.message).toMatch(
    /__wrap_abort: Invalid key for enum 'SanityEnum': INVALID/gm
  );

  const method2a = await client.invoke({
    uri,
    method: "method2",
    args: {
      enumArray: ["OPTION1", 0, "OPTION3"],
    },
  });

  expect(method2a.error).toBeFalsy();
  expect(method2a.data).toBeTruthy();
  expect(method2a.data).toEqual([0, 0, 2]);
};

export const runImplementationsTest = async (
  client: PolywrapClient,
  interfaceUri: string,
  implementationUri: string
) => {
  expect(client.getImplementations(interfaceUri)).toEqual([
    new Uri(implementationUri).uri,
  ]);

  const results = await Promise.all([
    client.invoke({
      uri: implementationUri,
      method: "moduleMethod",
      args: {
        arg: {
          uint8: 1,
          str: "Test String 1",
        },
      },
    }),
    client.invoke({
      uri: implementationUri,
      method: "abstractModuleMethod",
      args: {
        arg: {
          str: "Test String 2",
        },
      },
    }),
  ]);

  expect(results.filter((x) => x.error).length).toEqual(0);
  expect(results[0].data).toEqual({
    uint8: 1,
    str: "Test String 1",
  });
  expect(results[1].data).toBe("Test String 2");
};

export const runGetImplementationsTest = async (
  client: PolywrapClient,
  aggregatorUri: string,
  interfaceUri: string,
  implementationUri: string
) => {
  let implUri = new Uri(implementationUri);
  expect(client.getImplementations(interfaceUri)).toEqual([implUri.uri]);

  const result = await client.invoke({
    uri: aggregatorUri,
    method: "moduleImplementations",
  });

  expect(result.error).toBeFalsy();
  expect(result.data).toBeTruthy();
  expect(result.data).toEqual([implUri.uri]);

  const moduleMethodResult = await client.invoke({
    uri: aggregatorUri,
    method: "abstractModuleMethod",
    args: {
      arg: {
        str: "Test String 2",
      },
    },
  });
  expect(moduleMethodResult.error).toBeFalsy();
  expect(moduleMethodResult.data).toEqual("Test String 2");
};

export const runInvalidTypesTest = async (
  client: PolywrapClient,
  uri: string
) => {
  const invalidBoolIntSent = await client.invoke({
    uri,
    method: "boolMethod",
    args: {
      arg: 10,
    },
  });
  expect(invalidBoolIntSent.error).toBeTruthy();
  expect(invalidBoolIntSent.error?.message).toMatch(
    /Property must be of type 'bool'. Found 'int'./
  );

  const invalidIntBoolSent = await client.invoke({
    uri,
    method: "intMethod",
    args: {
      arg: true,
    },
  });
  expect(invalidIntBoolSent.error).toBeTruthy();
  expect(invalidIntBoolSent.error?.message).toMatch(
    /Property must be of type 'int'. Found 'bool'./
  );

  const invalidUIntArraySent = await client.invoke({
    uri,
    method: "uIntMethod",
    args: {
      arg: [10],
    },
  });
  expect(invalidUIntArraySent.error).toBeTruthy();
  expect(invalidUIntArraySent.error?.message).toMatch(
    /Property must be of type 'uint'. Found 'array'./
  );

  const invalidBytesFloatSent = await client.invoke({
    uri,
    method: "bytesMethod",
    args: {
      arg: 10.15,
    },
  });
  expect(invalidBytesFloatSent.error).toBeTruthy();
  expect(invalidBytesFloatSent.error?.message).toMatch(
    /Property must be of type 'bytes'. Found 'float64'./
  );

  const invalidArrayMapSent = await client.invoke({
    uri,
    method: "arrayMethod",
    args: {
      arg: {
        prop: "prop",
      },
    },
  });
  expect(invalidArrayMapSent.error).toBeTruthy();
  expect(invalidArrayMapSent.error?.message).toMatch(
    /Property must be of type 'array'. Found 'map'./
  );
};

export const runJsonTypeTest = async (client: PolywrapClient, uri: string, testReserved: boolean = false) => {
  type Json = string;
  const value = JSON.stringify({ foo: "bar", bar: "bar" });
  const parseResponse = await client.invoke<{ parse: Json }>({
    uri,
    method: "parse",
    args: {
      value,
    },
  });

  expect(parseResponse.data).toEqual(value);

  const values = [
    JSON.stringify({ bar: "foo" }),
    JSON.stringify({ baz: "fuz" }),
  ];

  const stringifyResponse = await client.invoke<{ stringify: Json }>({
    uri,
    method: "stringify",
    args: {
      values,
    },
  });

  expect(stringifyResponse.data).toEqual(values.join(""));

  const object = {
    jsonA: JSON.stringify({ foo: "bar" }),
    jsonB: JSON.stringify({ fuz: "baz" }),
  };

  const stringifyObjectResponse = await client.invoke<{
    stringifyObject: string;
  }>({
    uri,
    method: "stringifyObject",
    args: {
      object,
    },
  });

  expect(stringifyObjectResponse.data).toEqual(object.jsonA + object.jsonB);

  const json = {
    valueA: 5,
    valueB: "foo",
    valueC: true,
  };

  const methodJSONResponse = await client.invoke<{
    methodJSON: Json;
  }>({
    uri,
    method: "methodJSON",
    args: json,
  });

  const methodJSONResult = JSON.stringify(json);
  expect(methodJSONResponse.data).toEqual(methodJSONResult);

  if (testReserved) {
    const reserved = { const: "hello", if: true };
    const parseReservedResponse = await client.invoke<{ const: string; if: boolean }>({
      uri,
      method: "parseReserved",
      args: {
        json: JSON.stringify(reserved)
      },
    });
  
    expect(parseReservedResponse.data).toEqual(reserved);
  
    const stringifyReservedResponse = await client.invoke<string>({
      uri,
      method: "stringifyReserved",
      args: {
        reserved
      },
    });
    expect(stringifyReservedResponse.data).toEqual(JSON.stringify(reserved));
  }
};

export const runLargeTypesTest = async (
  client: PolywrapClient,
  uri: string
) => {
  const largeStr = new Array(5000).join("polywrap ");
  const largeBytes = new Uint8Array(Buffer.from(largeStr));
  const largeStrArray = [];
  const largeBytesArray = [];

  for (let i = 0; i < 50; i++) {
    largeStrArray.push(largeStr);
    largeBytesArray.push(largeBytes);
  }

  const largeTypesMethodCall = await client.invoke({
    uri,
    method: "method",
    args: {
      largeCollection: {
        largeStr: largeStr,
        largeBytes: largeBytes,
        largeStrArray: largeStrArray,
        largeBytesArray: largeBytesArray,
      },
    },
  });

  expect(largeTypesMethodCall.data).toBeTruthy();
  expect(largeTypesMethodCall.data).toEqual({
    largeStr: largeStr,
    largeBytes: largeBytes,
    largeStrArray: largeStrArray,
    largeBytesArray: largeBytesArray,
  });
};

export const runNumberTypesTest = async (
  client: PolywrapClient,
  uri: string
) => {
  const i8Underflow = await client.invoke({
    uri,
    method: "i8Method",
    args: {
      first: -129, // min i8 = -128
      second: 10,
    },
  });
  expect(i8Underflow.error).toBeTruthy();
  expect(i8Underflow.error?.message).toMatch(
    /integer overflow: value = -129; bits = 8/
  );
  expect(i8Underflow.data).toBeUndefined();

  const u8Overflow = await client.invoke({
    uri,
    method: "u8Method",
    args: {
      first: 256, // max u8 = 255
      second: 10,
    },
  });
  expect(u8Overflow.error).toBeTruthy();
  expect(u8Overflow.error?.message).toMatch(
    /unsigned integer overflow: value = 256; bits = 8/
  );
  expect(u8Overflow.data).toBeUndefined();

  const i16Underflow = await client.invoke({
    uri,
    method: "i16Method",
    args: {
      first: -32769, // min i16 = -32768
      second: 10,
    },
  });
  expect(i16Underflow.error).toBeTruthy();
  expect(i16Underflow.error?.message).toMatch(
    /integer overflow: value = -32769; bits = 16/
  );
  expect(i16Underflow.data).toBeUndefined();

  const u16Overflow = await client.invoke({
    uri,
    method: "u16Method",
    args: {
      first: 65536, // max u16 = 65535
      second: 10,
    },
  });
  expect(u16Overflow.error).toBeTruthy();
  expect(u16Overflow.error?.message).toMatch(
    /unsigned integer overflow: value = 65536; bits = 16/
  );
  expect(u16Overflow.data).toBeUndefined();

  const i32Underflow = await client.invoke({
    uri,
    method: "i32Method",
    args: {
      first: -2147483649, // min i32 = -2147483648
      second: 10,
    },
  });
  expect(i32Underflow.error).toBeTruthy();
  expect(i32Underflow.error?.message).toMatch(
    /integer overflow: value = -2147483649; bits = 32/
  );
  expect(i32Underflow.data).toBeUndefined();

  const u32Overflow = await client.invoke({
    uri,
    method: "u32Method",
    args: {
      first: 4294967296, // max u32 = 4294967295
      second: 10,
    },
  });
  expect(u32Overflow.error).toBeTruthy();
  expect(u32Overflow.error?.message).toMatch(
    /unsigned integer overflow: value = 4294967296; bits = 32/
  );
  expect(u32Overflow.data).toBeUndefined();
};

export const runObjectTypesTest = async (
  client: PolywrapClient,
  uri: string
) => {
  const method1a = await client.invoke({
    uri,
    method: "method1",
    args: {
      arg1: {
        prop: "arg1 prop",
        nested: {
          prop: "arg1 nested prop",
        },
      },
    },
  });

  expect(method1a.error).toBeFalsy();
  expect(method1a.data).toBeTruthy();
  expect(method1a.data).toEqual([
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
  ]);

  const method1b = await client.invoke({
    uri,
    method: "method1",
    args: {
      arg1: {
        prop: "arg1 prop",
        nested: {
          prop: "arg1 nested prop",
        },
      },
      arg2: {
        prop: "arg2 prop",
        circular: {
          prop: "arg2 circular prop",
        },
      },
    },
  });

  expect(method1b.error).toBeFalsy();
  expect(method1b.data).toBeTruthy();
  expect(method1b.data).toEqual([
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
  ]);

  const method2a = await client.invoke({
    uri,
    method: "method2",
    args: {
      arg: {
        prop: "arg prop",
        nested: {
          prop: "arg nested prop",
        },
      },
    },
  });

  expect(method2a.error).toBeFalsy();
  expect(method2a.data).toBeTruthy();
  expect(method2a.data).toEqual({
    prop: "arg prop",
    nested: {
      prop: "arg nested prop",
    },
  });

  const method2b = await client.invoke({
    uri,
    method: "method2",
    args: {
      arg: {
        prop: "null",
        nested: {
          prop: "arg nested prop",
        },
      },
    },
  });

  expect(method2b.error).toBeFalsy();
  expect(method2b.data).toEqual(null);

  const method3 = await client.invoke({
    uri,
    method: "method3",
    args: {
      arg: {
        prop: "arg prop",
        nested: {
          prop: "arg nested prop",
        },
      },
    },
  });

  expect(method3.error).toBeFalsy();
  expect(method3.data).toBeTruthy();
  expect(method3.data).toEqual([
    null,
    {
      prop: "arg prop",
      nested: {
        prop: "arg nested prop",
      },
    },
  ]);

  const method5 = await client.invoke({
    uri,
    method: "method5",
    args: {
      arg: {
        prop: [49, 50, 51, 52],
      },
    },
  });

  expect(method5.error).toBeFalsy();
  expect(method5.data).toBeTruthy();
  expect(method5.data).toEqual({
    prop: "1234",
    nested: {
      prop: "nested prop",
    },
  });
};

export const runMapTypeTest = async (client: PolywrapClient, uri: string) => {
  const mapClass = new Map<string, number>().set("Hello", 1).set("Heyo", 50);
  const nestedMapClass = new Map<string, Map<string, number>>().set(
    "Nested",
    mapClass
  );
  const mapRecord: Record<string, number> = {
    Hello: 1,
    Heyo: 50,
  };
  const nestedMapRecord: Record<string, Record<string, number>> = {
    Nested: mapRecord,
  };

  const returnMapResponse1 = await client.invoke<Map<string, number>>({
    uri,
    method: "returnMap",
    args: {
      map: mapClass,
    },
  });
  expect(returnMapResponse1.error).toBeUndefined();
  expect(returnMapResponse1.data).toEqual(mapClass);

  const returnMapResponse2 = await client.invoke<Map<string, number>>({
    uri,
    method: "returnMap",
    args: {
      map: mapRecord,
    },
  });
  expect(returnMapResponse2.error).toBeUndefined();
  expect(returnMapResponse2.data).toEqual(mapClass);

  const getKeyResponse1 = await client.invoke<number>({
    uri,
    method: "getKey",
    args: {
      foo: {
        map: mapClass,
        nestedMap: nestedMapClass,
      },
      key: "Hello",
    },
  });
  expect(getKeyResponse1.error).toBeUndefined();
  expect(getKeyResponse1.data).toEqual(mapClass.get("Hello"));

  const getKeyResponse2 = await client.invoke<number>({
    uri,
    method: "getKey",
    args: {
      foo: {
        map: mapRecord,
        nestedMap: nestedMapRecord,
      },
      key: "Heyo",
    },
  });
  expect(getKeyResponse2.error).toBeUndefined();
  expect(getKeyResponse2.data).toEqual(mapRecord.Heyo);

  const returnCustomMap = await client.invoke<{
    map: Map<string, number>;
    nestedMap: Map<string, Map<string, number>>;
  }>({
    uri,
    method: "returnCustomMap",
    args: {
      foo: {
        map: mapRecord,
        nestedMap: nestedMapClass,
      },
    },
  });
  expect(returnCustomMap.error).toBeUndefined();
  expect(returnCustomMap.data).toEqual({
    map: mapClass,
    nestedMap: nestedMapClass,
  });

  const returnNestedMap = await client.invoke<Map<string, Map<string, number>>>(
    {
      uri,
      method: "returnNestedMap",
      args: {
        foo: nestedMapClass,
      },
    }
  );
  expect(returnNestedMap.error).toBeUndefined();
  expect(returnNestedMap.data).toEqual(nestedMapClass);
};

export const runSimpleStorageTest = async (
  client: PolywrapClient,
  wrapperUri: string
) => {
  const deploy = await client.invoke<string>({
    uri: wrapperUri,
    method: "deployContract",
    args: {
      connection: {
        networkNameOrChainId: "testnet",
      },
    },
  });

  expect(deploy.error).toBeFalsy();
  expect(deploy.data).toBeTruthy();
  expect(deploy.data?.indexOf("0x")).toBeGreaterThan(-1);

  if (!deploy.data) {
    return;
  }

  const address = deploy.data;
  const set = await client.invoke<string>({
    uri: wrapperUri,
    method: "setData",
    args: {
      address,
      value: 55,
      connection: {
        networkNameOrChainId: "testnet",
      },
    },
  });

  expect(set.error).toBeFalsy();
  expect(set.data).toBeTruthy();
  expect(set.data?.indexOf("0x")).toBeGreaterThan(-1);

  const getDataResult = await client.invoke<number>({
    uri: wrapperUri,
    method: "getData",
    args: {
      address,
      connection: {
        networkNameOrChainId: "testnet",
      },
    },
  });

  expect(getDataResult.error).toBeFalsy();
  expect(getDataResult.data).toEqual(55);
};

export const runSimpleEnvTest = async (
  client: PolywrapClient,
  wrapperUri: string
) => {
  const getEnvResult = await client.invoke({
    uri: wrapperUri,
    method: "getEnv",
    args: {
      arg: "string",
    },
  });
  expect(getEnvResult.error).toBeFalsy();
  expect(getEnvResult.data).toEqual({
    str: "module string",
    requiredInt: 1,
  });

  const noEnvClient = new PolywrapClient(
    client
      .reconfigure()
      .removeEnv(wrapperUri)
      .build()
  );
  const getEnvNotSetResult = await noEnvClient.invoke({
    uri: wrapperUri,
    method: "getEnv",
    args: {
      arg: "not set",
    }
  });
  expect(getEnvNotSetResult.data).toBeUndefined();
  expect(getEnvNotSetResult.error).toBeTruthy();
  expect(getEnvNotSetResult.error?.message).toContain("requiredInt: Int");

  const envIncorrectClient = new PolywrapClient(
    client
      .reconfigure()
      .setEnv(
        wrapperUri, {
          str: "string",
          requiredInt: "99",
        }
      ).build()
  );
  const envIncorrectResult = await envIncorrectClient.invoke({
    uri: wrapperUri,
    method: "getEnv",
    args: {
      arg: "not set",
    }
  });

  expect(envIncorrectResult.data).toBeUndefined();
  expect(envIncorrectResult.error).toBeTruthy();
  expect(envIncorrectResult.error?.message).toContain(
    "Property must be of type 'int'. Found 'string'."
  );
};

export const runComplexEnvs = async (
  client: PolywrapClient,
  wrapperUri: string
) => {
  const methodRequireEnvResult = await client.invoke({
    uri: wrapperUri,
    method: "methodRequireEnv",
    args: {
      arg: "string",
    },
  });
  expect(methodRequireEnvResult.error).toBeFalsy();
  expect(methodRequireEnvResult.data).toEqual({
    str: "string",
    optFilledStr: "optional string",
    optStr: null,
    number: 10,
    optNumber: null,
    bool: true,
    optBool: null,
    object: {
      prop: "object string",
    },
    optObject: null,
    en: 0,
    optEnum: null,
    array: [32, 23],
  });

  const subinvokeEnvMethodResult = await client.invoke({
    uri: wrapperUri,
    method: "subinvokeEnvMethod",
    args: {
      arg: "string",
    },
  });
  expect(subinvokeEnvMethodResult.error).toBeFalsy();
  expect(subinvokeEnvMethodResult.data).toEqual({
    local: {
      str: "string",
      optFilledStr: "optional string",
      optStr: null,
      number: 10,
      optNumber: null,
      bool: true,
      optBool: null,
      object: {
        prop: "object string",
      },
      optObject: null,
      en: 0,
      optEnum: null,
      array: [32, 23],
    },
    external: {
      externalArray: [1, 2, 3],
      externalString: "iamexternal",
    },
  });

  const methodRequireEnvModuleTimeResult = await client.invoke({
    uri: wrapperUri,
    method: "methodRequireEnv",
    args: {
      arg: "string",
    },
  });
  expect(methodRequireEnvModuleTimeResult.error).toBeFalsy();
  expect(methodRequireEnvModuleTimeResult.data).toEqual({
    str: "string",
    optFilledStr: "optional string",
    optStr: null,
    number: 10,
    optNumber: null,
    bool: true,
    optBool: null,
    object: {
      prop: "object string",
    },
    optObject: null,
    en: 0,
    optEnum: null,
    array: [32, 23],
  });

  const mockClient = new PolywrapClient(
    client
      .reconfigure({
      envs: [
        {
          uri: wrapperUri,
          env: {
            object: {
              prop: "object another string",
            },
            str: "another string",
            optFilledStr: "optional string",
            number: 10,
            bool: true,
            en: "FIRST",
            array: [32, 23],
          },
        },
      ],
    }).build()
  );
  const mockUpdatedEnvResult = await mockClient.invoke({
    uri: wrapperUri,
    method: "methodRequireEnv",
    args: {
      arg: "string",
    }
  });
  expect(mockUpdatedEnvResult.error).toBeFalsy();
  expect(mockUpdatedEnvResult.data).toEqual({
    str: "another string",
    optFilledStr: "optional string",
    optStr: null,
    number: 10,
    optNumber: null,
    bool: true,
    optBool: null,
    object: {
      prop: "object another string",
    },
    optObject: null,
    en: 0,
    optEnum: null,
    array: [32, 23],
  });
};
