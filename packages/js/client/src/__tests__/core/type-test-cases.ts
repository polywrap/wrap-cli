import { memoryStoragePlugin, ErrResult } from "../helpers";
import { PolywrapClient } from "../../PolywrapClient";

import BigNumber from "bignumber.js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

export const typeTestCases = (implementation: string) => {
  describe("types test cases", () => {
    test(`asyncify ${implementation}`, async () => {
      const builder = new ClientConfigBuilder();
      builder.addDefaults().addPackage(
        "wrap://ens/memory-storage.polywrap.eth",
        memoryStoragePlugin()
      );
      const client = new PolywrapClient(builder.build());

      const uri = `fs/${GetPathToTestWrappers()}/asyncify/implementations/${implementation}`;
      const subsequentInvokes = await client.invoke({
        uri: uri,
        method: "subsequentInvokes",
        args: {
          numberOfTimes: 40,
        },
      });

      const expected = Array.from(new Array(40), (_, index) =>
        index.toString()
      );

      if (!subsequentInvokes.ok) fail(subsequentInvokes.error);
      expect(subsequentInvokes.value).toBeTruthy();
      expect(subsequentInvokes.value).toEqual(expected);

      const localVarMethod = await client.invoke<boolean>({
        uri,
        method: "localVarMethod",
      });

      if (!localVarMethod.ok) fail(localVarMethod.error);
      expect(localVarMethod.value).toBeTruthy();
      expect(localVarMethod.value).toEqual(true);

      const globalVarMethod = await client.invoke<boolean>({
        uri,
        method: "globalVarMethod",
      });

      if (!globalVarMethod.ok) fail(globalVarMethod.error);
      expect(globalVarMethod.value).toBeTruthy();
      expect(globalVarMethod.value).toEqual(true);

      const largeStr = new Array(10000).join("polywrap ");
      const setDataWithLargeArgs = await client.invoke<string>({
        uri,
        method: "setDataWithLargeArgs",
        args: {
          value: largeStr,
        },
      });

      if (!setDataWithLargeArgs.ok) fail(setDataWithLargeArgs.error);
      expect(setDataWithLargeArgs.value).toBeTruthy();
      expect(setDataWithLargeArgs.value).toEqual(largeStr);

      const setDataWithManyArgs = await client.invoke<string>({
        uri,
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

      if (!setDataWithManyArgs.ok) fail(setDataWithManyArgs.error);
      expect(setDataWithManyArgs.value).toBeTruthy();
      expect(setDataWithManyArgs.value).toEqual(
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
        uri,
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

      if (!setDataWithManyStructuredArgs.ok)
        fail(setDataWithManyStructuredArgs.error);
      expect(setDataWithManyStructuredArgs.value).toBeTruthy();
      expect(setDataWithManyStructuredArgs.value).toBe(true);
    });

    test(`bigint-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/bigint-type/implementations/${implementation}`;
      const client = new PolywrapClient();
      let response = await client.invoke({
        uri,
        method: "method",
        args: {
          arg1: "123456789123456789",
          obj: {
            prop1: "987654321987654321",
          },
        },
      });
      let result = BigInt("123456789123456789") * BigInt("987654321987654321");
      if (!response.ok) fail(response.error);
      expect(response.value).toBeTruthy();
      expect(response.value).toEqual(result.toString());

      response = await client.invoke({
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

      result =
        BigInt("123456789123456789") *
        BigInt("123456789123456789123456789123456789") *
        BigInt("987654321987654321") *
        BigInt("987654321987654321987654321987654321");

      if (!response.ok) fail(response.error);
      expect(response.value).toBeTruthy();
      expect(response.value).toEqual(result.toString());
    });

    test(`bignumber-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/bignumber-type/implementations/${implementation}`;
      const client = new PolywrapClient();
      let response = await client.invoke({
        uri,
        method: "method",
        args: {
          arg1: "1234.56789123456789",
          obj: {
            prop1: "98.7654321987654321",
          },
        },
      });

      let arg1 = new BigNumber("1234.56789123456789");
      let prop1 = new BigNumber("98.7654321987654321");
      let result = arg1.times(prop1);

      if (!response.ok) fail(response.error);
      expect(response.value).toBeTruthy();
      expect(response.value).toEqual(result.toFixed());

      response = await client.invoke({
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

      arg1 = new BigNumber("1234567.89123456789");
      const arg2 = new BigNumber("123456789123.456789123456789123456789");
      prop1 = new BigNumber("987654.321987654321");
      const prop2 = new BigNumber("987.654321987654321987654321987654321");
      result = arg1.times(arg2).times(prop1).times(prop2);

      if (!response.ok) fail(response.error);
      expect(response.value).toBeTruthy();
      expect(response.value).toEqual(result.toFixed());
    });

    test(`bytes-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/bytes-type/implementations/${implementation}`;
      const client = new PolywrapClient();
      const response = await client.invoke({
        uri,
        method: "bytesMethod",
        args: {
          arg: {
            prop: Buffer.from("Argument Value"),
          },
        },
      });

      if (!response.ok) fail(response.error);
      expect(response.value).toBeTruthy();
      expect(response.value).toEqual(
        new TextEncoder().encode("Argument Value Sanity!")
      );
    });

    test(`enum-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/enum-type/implementations/${implementation}`;
      const client = new PolywrapClient();

      let method1a = await client.invoke({
        uri,
        method: "method1",
        args: {
          en: 5,
        },
      });

      method1a = method1a as ErrResult;
      expect(method1a.error).toBeTruthy();
      expect(method1a.error?.message).toMatch(
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

      if (!method1b.ok) fail(method1b.error);
      expect(method1b.value).toBeTruthy();
      expect(method1b.value).toEqual(2);

      let method1c = await client.invoke({
        uri,
        method: "method1",
        args: {
          en: 1,
          optEnum: "INVALID",
        },
      });

      method1c = method1c as ErrResult;
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

      if (!method2a.ok) fail(method2a.error);
      expect(method2a.value).toBeTruthy();
      expect(method2a.value).toEqual([0, 0, 2]);
    });

    test(`invalid-types ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/invalid-type/implementations/${implementation}`;
      const client = new PolywrapClient();
      let invalidBoolIntSent = await client.invoke({
        uri,
        method: "boolMethod",
        args: {
          arg: 10,
        },
      });
      invalidBoolIntSent = invalidBoolIntSent as ErrResult;
      expect(invalidBoolIntSent.error).toBeTruthy();
      expect(invalidBoolIntSent.error?.message).toMatch(
        /Property must be of type 'bool'. Found 'int'./
      );

      let invalidIntBoolSent = await client.invoke({
        uri,
        method: "intMethod",
        args: {
          arg: true,
        },
      });
      invalidIntBoolSent = invalidIntBoolSent as ErrResult;
      expect(invalidIntBoolSent.error).toBeTruthy();
      expect(invalidIntBoolSent.error?.message).toMatch(
        /Property must be of type 'int'. Found 'bool'./
      );

      let invalidUIntArraySent = await client.invoke({
        uri,
        method: "uIntMethod",
        args: {
          arg: [10],
        },
      });
      invalidUIntArraySent = invalidUIntArraySent as ErrResult;
      expect(invalidUIntArraySent.error).toBeTruthy();
      expect(invalidUIntArraySent.error?.message).toMatch(
        /Property must be of type 'uint'. Found 'array'./
      );

      let invalidBytesFloatSent = await client.invoke({
        uri,
        method: "bytesMethod",
        args: {
          arg: 10.15,
        },
      });

      invalidBytesFloatSent = invalidBytesFloatSent as ErrResult;
      expect(invalidBytesFloatSent.error).toBeTruthy();
      expect(invalidBytesFloatSent.error?.message).toMatch(
        /Property must be of type 'bytes'. Found 'float64'./
      );

      let invalidArrayMapSent = await client.invoke({
        uri,
        method: "arrayMethod",
        args: {
          arg: {
            prop: "prop",
          },
        },
      });

      invalidArrayMapSent = invalidArrayMapSent as ErrResult;
      expect(invalidArrayMapSent.error).toBeTruthy();
      expect(invalidArrayMapSent.error?.message).toMatch(
        /Property must be of type 'array'. Found 'map'./
      );
    });

    test(`json-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/json-type/implementations/${implementation}`;
      const client = new PolywrapClient();
      type Json = string;
      const value = JSON.stringify({ foo: "bar", bar: "bar" });
      const parseResponse = await client.invoke<Json>({
        uri,
        method: "parse",
        args: {
          value,
        },
      });

      if (!parseResponse.ok) fail(parseResponse.error);
      expect(parseResponse.value).toEqual(value);

      const values = [
        JSON.stringify({ bar: "foo" }),
        JSON.stringify({ baz: "fuz" }),
      ];

      const stringifyResponse = await client.invoke<Json>({
        uri,
        method: "stringify",
        args: {
          values,
        },
      });

      if (!stringifyResponse.ok) fail(stringifyResponse.error);
      expect(stringifyResponse.value).toEqual(values.join(""));

      const object = {
        jsonA: JSON.stringify({ foo: "bar" }),
        jsonB: JSON.stringify({ fuz: "baz" }),
      };

      const stringifyObjectResponse = await client.invoke<string>({
        uri,
        method: "stringifyObject",
        args: {
          object,
        },
      });

      if (!stringifyObjectResponse.ok) fail(stringifyObjectResponse.error);
      expect(stringifyObjectResponse.value).toEqual(
        object.jsonA + object.jsonB
      );

      const json = {
        valueA: 5,
        valueB: "foo",
        valueC: true,
      };

      const methodJSONResponse = await client.invoke<Json>({
        uri,
        method: "methodJSON",
        args: json,
      });

      if (!methodJSONResponse.ok) fail(methodJSONResponse.error);
      const methodJSONResult = JSON.stringify(json);
      expect(methodJSONResponse.value).toEqual(methodJSONResult);

      // @TODO: Remove this once https://github.com/polywrap/toolchain/issues/633 is implemented & tested
      if (implementation === "rs") {
        const reserved = { const: "hello", if: true };
        const parseReservedResponse = await client.invoke<{
          const: string;
          if: boolean;
        }>({
          uri,
          method: "parseReserved",
          args: {
            json: JSON.stringify(reserved),
          },
        });

        if (!parseReservedResponse.ok) fail(parseReservedResponse.error);
        expect(parseReservedResponse.value).toEqual(reserved);

        const stringifyReservedResponse = await client.invoke<string>({
          uri,
          method: "stringifyReserved",
          args: {
            reserved,
          },
        });

        if (!stringifyReservedResponse.ok)
          fail(stringifyReservedResponse.error);
        expect(stringifyReservedResponse.value).toEqual(
          JSON.stringify(reserved)
        );
      }
    });

    test(`numbers-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/numbers-type/implementations/${implementation}`;
      const client = new PolywrapClient();
      let i8Underflow = await client.invoke({
        uri,
        method: "i8Method",
        args: {
          first: -129, // min i8 = -128
          second: 10,
        },
      });

      i8Underflow = i8Underflow as ErrResult;
      expect(i8Underflow.error).toBeTruthy();
      expect(i8Underflow.error?.message).toMatch(
        /integer overflow: value = -129; bits = 8/
      );

      let u8Overflow = await client.invoke({
        uri,
        method: "u8Method",
        args: {
          first: 256, // max u8 = 255
          second: 10,
        },
      });
      u8Overflow = u8Overflow as ErrResult;
      expect(u8Overflow.error).toBeTruthy();
      expect(u8Overflow.error?.message).toMatch(
        /unsigned integer overflow: value = 256; bits = 8/
      );

      let i16Underflow = await client.invoke({
        uri,
        method: "i16Method",
        args: {
          first: -32769, // min i16 = -32768
          second: 10,
        },
      });
      i16Underflow = i16Underflow as ErrResult;
      expect(i16Underflow.error).toBeTruthy();
      expect(i16Underflow.error?.message).toMatch(
        /integer overflow: value = -32769; bits = 16/
      );

      let u16Overflow = await client.invoke({
        uri,
        method: "u16Method",
        args: {
          first: 65536, // max u16 = 65535
          second: 10,
        },
      });
      u16Overflow = u16Overflow as ErrResult;
      expect(u16Overflow.error).toBeTruthy();
      expect(u16Overflow.error?.message).toMatch(
        /unsigned integer overflow: value = 65536; bits = 16/
      );

      let i32Underflow = await client.invoke({
        uri,
        method: "i32Method",
        args: {
          first: -2147483649, // min i32 = -2147483648
          second: 10,
        },
      });
      i32Underflow = i32Underflow as ErrResult;
      expect(i32Underflow.error).toBeTruthy();
      expect(i32Underflow.error?.message).toMatch(
        /integer overflow: value = -2147483649; bits = 32/
      );

      let u32Overflow = await client.invoke({
        uri,
        method: "u32Method",
        args: {
          first: 4294967296, // max u32 = 4294967295
          second: 10,
        },
      });
      u32Overflow = u32Overflow as ErrResult;
      expect(u32Overflow.error).toBeTruthy();
      expect(u32Overflow.error?.message).toMatch(
        /unsigned integer overflow: value = 4294967296; bits = 32/
      );
    });

    test(`object-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/object-type/implementations/${implementation}`;
      const client = new PolywrapClient();
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

      if (!method1a.ok) fail(method1a.error);
      expect(method1a.value).toBeTruthy();
      expect(method1a.value).toEqual([
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

      if (!method1b.ok) fail(method1b.error);
      expect(method1b.value).toBeTruthy();
      expect(method1b.value).toEqual([
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

      if (!method2a.ok) fail(method2a.error);
      expect(method2a.value).toBeTruthy();
      expect(method2a.value).toEqual({
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

      if (!method2b.ok) fail(method2b.error);
      expect(method2b.value).toEqual(null);

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

      if (!method3.ok) fail(method3.error);
      expect(method3.value).toBeTruthy();
      expect(method3.value).toEqual([
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

      if (!method5.ok) fail(method5.error);
      expect(method5.value).toBeTruthy();
      expect(method5.value).toEqual({
        prop: "1234",
        nested: {
          prop: "nested prop",
        },
      });
    });

    test(`map-type ${implementation}`, async () => {
      const uri = `fs/${GetPathToTestWrappers()}/map-type/implementations/${implementation}`;
      const client = new PolywrapClient();
      const mapClass = new Map<string, number>()
        .set("Hello", 1)
        .set("Heyo", 50);
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
      if (!returnMapResponse1.ok) fail(returnMapResponse1.error);
      expect(returnMapResponse1.value).toEqual(mapClass);

      const returnMapResponse2 = await client.invoke<Map<string, number>>({
        uri,
        method: "returnMap",
        args: {
          map: mapRecord,
        },
      });
      if (!returnMapResponse2.ok) fail(returnMapResponse2.error);
      expect(returnMapResponse2.value).toEqual(mapClass);

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
      if (!getKeyResponse1.ok) fail(getKeyResponse1.error);
      expect(getKeyResponse1.value).toEqual(mapClass.get("Hello"));

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
      if (!getKeyResponse2.ok) fail(getKeyResponse2.error);
      expect(getKeyResponse2.value).toEqual(mapRecord.Heyo);

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
      if (!returnCustomMap.ok) fail(returnCustomMap.error);
      expect(returnCustomMap.value).toEqual({
        map: mapClass,
        nestedMap: nestedMapClass,
      });

      const returnNestedMap = await client.invoke<
        Map<string, Map<string, number>>
      >({
        uri,
        method: "returnNestedMap",
        args: {
          foo: nestedMapClass,
        },
      });
      if (!returnNestedMap.ok) fail(returnNestedMap.error);
      expect(returnNestedMap.value).toEqual(nestedMapClass);
    });
  });
};
