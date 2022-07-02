import { Write } from "../msgpack/Write";
import { WriteSizer } from "../msgpack/WriteSizer";
import { WriteEncoder } from "../msgpack/WriteEncoder";
import { BigFraction, BigInt, BigNumber, Fraction } from "../math";
import { JSON } from "../json";
import { Option } from "../";

function fill(arr: Array<u8>): ArrayBuffer {
  const buffer = new ArrayBuffer(arr.length);
  const offset = changetype<u32>(buffer);
  for (let i: i32 = 0; i < arr.length; ++i) {
    store<u8>(offset + i, arr[i]);
  }
  return buffer;
}

class Case<T> {
  name: string;
  input: T;
  want: Array<u8>;

  constructor(name: string, input: T, want: Array<u8>) {
    this.name = name;
    this.input = input;
    this.want = want;
  }
}

describe("WriteEncoder Option types", () => {
  it("TestWriteOptionalBool", () => {
    const cases = [
      new Case<Option<bool>>("nil", Option.None<bool>(), [192]),
      new Case<Option<bool>>("nil", Option.Some(false), [194]),
      new Case<Option<bool>>("nil", Option.Some(true), [195]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalBool(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalBool(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalInt8", () => {
    const cases = [
      new Case<Option<i8>>("none", Option.None<i8>(), [192]),
      new Case<Option<i8>>(
        "positive fixed int",
        Option.Some(<i8>-128),
        [208,128]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalInt8(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalInt8(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalInt16", () => {
    const cases = [
      new Case<Option<i16>>("none", Option.None<i16>(), [192]),
      new Case<Option<i16>>(
        "16-bit signed int (negative)",
        Option.Some(<i16>-32768),
        [209, 128, 0]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalInt16(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalInt16(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalInt32", () => {
    const cases = [
      new Case<Option<i32>>("none", Option.None<i32>(), [192]),
      new Case<Option<i32>>(
        "32-bit signed int (negative)",
        Option.Some(-32769),
        [210, 255, 255, 127, 255]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalInt32(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalInt32(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalUint8", () => {
    const cases = [
      new Case<Option<u8>>("none", Option.None<u8>(), [192]),
      new Case<Option<u8>>(
        "8-bit unsigned int",
        Option.Some(<u8>200),
        [204,200]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalUInt8(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalUInt8(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalUint16", () => {
    const cases = [
      new Case<Option<u16>>("none", Option.None<u16>(), [192]),
      new Case<Option<u16>>(
        "16-bit unsigned int",
        Option.Some(<u16>256),
        [205,1,0]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalUInt16(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalUInt16(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalUint32", () => {
    const cases = [
      new Case<Option<u32>>("none", Option.None<u32>(), [192]),
      new Case<Option<u32>>(
        "32-bit unsigned int",
        Option.Some(<u32>65536),
        [206,0,1,0,0]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalUInt32(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalUInt32(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalFloat32", () => {
    const cases = [
      new Case<Option<f32>>("none", Option.None<f32>(), [192]),
      new Case<Option<f32>>(
        "32-bit float",
        Option.Some(<f32>0.5),
        [202,63,0,0,0]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalFloat32(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalFloat32(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalFloat64", () => {
    const cases = [
      new Case<Option<f64>>("none", Option.None<f64>(), [192]),
      new Case<Option<f64>>(
        "64-bit float",
        Option.Some(<f64>3.141592653589793),
        [203, 64, 9, 33, 251, 84, 68, 45, 24]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalFloat64(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalFloat64(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalBytes", () => {
    const arr1 = new Uint8Array(1);
    arr1.fill(1, 0, 1);

    const cases = [
      new Case<ArrayBuffer | null>("none", null, [192]),
      new Case<ArrayBuffer | null>("Bytes", arr1.buffer, [196, 1, 1]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalBytes(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalBytes(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalString", () => {
    const cases = [
      new Case<string | null>("none", null, [192]),
      new Case<string | null>(
        "5-char String",
        "hello",
        [165,104,101,108,108,111]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalString(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalString(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalBigInt", () => {
    const cases = [
      new Case<BigInt | null>("none", null, [192]),
      new Case<BigInt | null>(
        "BigInt",
        BigInt.fromString("3124124512598273468017578125"),
        [188,51,49,50,52,49,50,52,53,49,50,53,57,56,
         50,55,51,52,54,56,48,49,55,53,55,56,49,50,53]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalBigInt(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalBigInt(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalBigNumber", () => {
    const cases = [
      new Case<BigNumber | null>("none", null, [192]),
      new Case<BigNumber | null>(
        "BigNumber",
        BigNumber.fromString("3124124512.598273468017578125"),
        [189,51,49,50,52,49,50,52,53,49,50,46,53,57,56,
         50,55,51,52,54,56,48,49,55,53,55,56,49,50,53]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalBigNumber(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalBigNumber(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalBigFraction", () => {
    const numerator: BigInt = BigInt.fromString("3124124512598273468017578125");
    const denominator: BigInt = BigInt.fromString("3124124512");
    const numeratorSerialized: u8[] = [188, 51, 49, 50, 52, 49, 50, 52, 53, 49, 50, 53, 57, 56,
      50, 55, 51, 52, 54, 56, 48, 49, 55, 53, 55, 56, 49, 50, 53];
    const denominatorSerialized: u8[] = [170,51,49,50,52,49,50,52,53,49,50];
    const cases = [
      new Case<BigFraction | null>("none", null, [192]),
      new Case<BigFraction | null>("BigFraction", new BigFraction(numerator, denominator),
        numeratorSerialized.concat(denominatorSerialized)
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalBigFraction(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalBigFraction(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteFraction", () => {
    const numeratorSerialized: u8[] =   [210, 0, 0, 128, 0];
    const denominatorSerialized: u8[] = [209, 255, 127];
    const cases = [
      new Case<Fraction<i32> | null>("none", null, [192]),
      new Case<Fraction<i32> | null>("Fraction", new Fraction<i32>(32768, -129),
        numeratorSerialized.concat(denominatorSerialized)
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalFraction(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalFraction(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalJSON", () => {
    const cases = [
      new Case<JSON.Value | null>("none", null, [192]),
      new Case<JSON.Value | null>(
        "JSON",
        JSON.parse(`{"foo": "bar"}`),
        [173,123,34,102,111,111,34,58,34,98,97,114,34,125]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalJSON(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalJSON(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalArray", () => {
    const cases = [
      new Case<Array<u8> | null>("none", null, [192]),
      new Case<Array<u8> | null>("Array", [10, 20, 30], [147, 10, 20, 30]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalArray<u8>(
        testcase.input,
        (writer: Write, item: u8) => {
          writer.writeUInt8(item);
        }
      );
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalArray<u8>(
        testcase.input,
        (writer: Write, item: u8) => {
          writer.writeUInt8(item);
        }
      );

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalMap", () => {
    const map1 = new Map<string, Array<i32>>();
    map1.set("foo", [1, -1, 42]);
    map1.set("baz", [12412, -98987]);

    const cases = [
      new Case<Map<string, Array<i32>> | null>("none", null, [192]),
      new Case<Map<string, Array<i32>> | null>(
        "Map",
        map1,
        [130,163,102,111,111,147,1,255,42,163,98,
         97,122,146,209,48,124,210,255,254,125,85]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalMap<string, Array<i32>>(
        testcase.input,
        (writer: Write, key: string): void => {
          writer.writeString(key);
        },
        (writer: Write, value: Array<i32>) => {
          writer.writeArray(value, (writer: Write, item: i32) => {
            writer.writeInt32(item);
          });
        }
      );
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalMap<string, Array<i32>>(
        testcase.input,
        (writer: Write, key: string): void => {
          writer.writeString(key);
        },
        (writer: Write, value: Array<i32>) => {
          writer.writeArray(value, (writer: Write, item: i32) => {
            writer.writeInt32(item);
          });
        }
      );

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteOptionalExtGenericMap", () => {
    const map1 = new Map<string, Array<i32>>();
    map1.set("foo", [1, -1, 42]);
    map1.set("baz", [12412, -98987]);

    const cases = [
      new Case<Map<string, Array<i32>> | null>("none", null, [192]),
      new Case<Map<string, Array<i32>> | null>(
        "Map",
        map1,
        [199,22,1,130,163,102,111,111,147,1,255,42,163,
         98,97,122,146,209,48,124,210,255,254,125,85]
      ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeOptionalExtGenericMap<string, Array<i32>>(
        testcase.input,
        (writer: Write, key: string): void => {
          writer.writeString(key);
        },
        (writer: Write, value: Array<i32>) => {
          writer.writeArray(value, (writer: Write, item: i32) => {
            writer.writeInt32(item);
          });
        }
      );
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeOptionalExtGenericMap<string, Array<i32>>(
        testcase.input,
        (writer: Write, key: string): void => {
          writer.writeString(key);
        },
        (writer: Write, value: Array<i32>) => {
          writer.writeArray(value, (writer: Write, item: i32) => {
            writer.writeInt32(item);
          });
        }
      );

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });
});
