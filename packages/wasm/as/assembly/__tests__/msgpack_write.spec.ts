import { Write } from "../msgpack/Write";
import { WriteSizer } from "../msgpack/WriteSizer";
import { WriteEncoder } from "../msgpack/WriteEncoder";
import { BigInt, BigNumber } from "../math";
import { JSON } from "../json";

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

describe("WriteEncoder", () => {
  it("TestWriteNil", () => {
    const sizer = new WriteSizer();
    sizer.writeNil();
    const buffer = new ArrayBuffer(sizer.length);
    const encoder = new WriteEncoder(buffer, sizer);
    encoder.writeNil();

    const actual = encoder._view.buffer;
    const expected = fill([<u8>192]);
    expect(actual).toStrictEqual(expected);
  });

  it("TestWriteBool", () => {
    const cases = [
      new Case<bool>("false", false, [194]),
      new Case<bool>("true", true, [195]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeBool(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeBool(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteInt8", () => {
    const cases = [
      new Case<i8>("zero", 0, [0]),
      new Case<i8>("negative fixed int", -1, [255]),
      new Case<i8>("negative fixed int", -31, [225]),
      new Case<i8>("negative fixed int", -32, [224]),
      new Case<i8>("positive fixed int", 1, [1]),
      new Case<i8>("positive fixed int", 127, [127]),
      new Case<i8>("8-bit signed int", -128, [208, 128]),
      new Case<i8>("8-bit signed int", -100, [208, 156]),
      new Case<i8>("8-bit signed int", -33, [208, 223]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeInt8(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeInt8(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteInt16", () => {
    const cases = [
      new Case<i16>("16-bit signed int (negative)", -32768, [209, 128, 0]),
      new Case<i16>("16-bit signed int (negative)", -32767, [209, 128, 1]),
      new Case<i16>("16-bit signed int (negative)", -129, [209, 255, 127]),
      new Case<i16>("16-bit signed int (positive)", 128, [209, 0, 128]),
      new Case<i16>("16-bit signed int (positive)", 32767, [209, 127, 255]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeInt16(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeInt16(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteInt32", () => {
    const cases = [
      new Case<i32>("32-bit signed int (negative)", -32769,     [210, 255, 255, 127, 255]),
      new Case<i32>("32-bit signed int (negative)", -2147483648,[210, 128, 0, 0, 0]),
      new Case<i32>("32-bit signed int (negative)", -2147483647,[210, 128, 0, 0, 1]),
      new Case<i32>("32-bit signed int (positive)", 32768,      [210, 0, 0, 128, 0]),
      new Case<i32>("32-bit signed int (positive)", 123456,     [210, 0, 1, 226, 64]),
      new Case<i32>("32-bit signed int (positive)", 2147483647, [210, 127, 255, 255, 255]),
    ]

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeInt32(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeInt32(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteUint8", () => {
    const cases = [
      new Case<u8>("zero", 0, [0]),
      new Case<u8>("positive fixed int", 1, [1]),
      new Case<u8>("positive fixed int", 127, [127]),
      new Case<u8>("8-bit unsigned int", 200, [204, 200]),
      new Case<u8>("8-bit unsigned int", 255, [204, 255]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeUInt8(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeUInt8(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteUint16", () => {
    const cases = [
      new Case<u16>("16-bit unsigned int", 256, [205, 1, 0]),
      new Case<u16>("16-bit unsigned int", 32767, [205, 127, 255]),
      new Case<u16>("16-bit unsigned int", 32768, [205, 128, 0]),
      new Case<u16>("16-bit unsigned int", 65535, [205, 255, 255]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeUInt16(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeUInt16(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteUint32", () => {
    const cases = [
      new Case<u32>("32-bit unsigned int", 65536, [206, 0, 1, 0, 0]),
      new Case<u32>("32-bit unsigned int", 123456, [206, 0, 1, 226, 64]),
      new Case<u32>("32-bit unsigned int", 2147483648, [206, 128, 0, 0, 0]),
      new Case<u32>("32-bit unsigned int", 4294967295, [206, 255, 255, 255, 255]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeUInt32(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeUInt32(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteFloat32", () => {
    const cases = [new Case<f32>("32-bit float", 0.5, [202, 63, 0, 0, 0])];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeFloat32(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeFloat32(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteFloat64", () => {
    const cases = [
      new Case<f64>("64-bit float", 3.141592653589793, [203, 64, 9, 33, 251, 84, 68, 45, 24]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeFloat64(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeFloat64(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteBytes", () => {
    const arr1 = new Uint8Array(1);
    arr1.fill(1, 0, 1);

    const cases = [new Case<ArrayBuffer>("Bytes", arr1.buffer, [196, 1, 1])];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeBytes(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeBytes(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteString", () => {
    const cases = [
      new Case<string>("Empty String", "", [160]),
      new Case<string>("5-char String", "hello", [165, 104, 101, 108, 108, 111]),
      new Case<string>("11-char String", "hello world", [171, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeString(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeString(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteBigInt", () => {
    const cases = [
      new Case<BigInt>("BigInt", BigInt.fromString("3124124512598273468017578125"),
               [188, 51, 49, 50, 52, 49, 50, 52, 53, 49, 50, 53, 57, 56,
                50, 55, 51, 52, 54, 56, 48, 49, 55, 53, 55, 56, 49, 50, 53]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeBigInt(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeBigInt(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteBigNumber", () => {
    const cases = [
      new Case<BigNumber>("BigNumber", BigNumber.fromString("3124124512.598273468017578125"),
               [189, 51, 49, 50, 52, 49, 50, 52, 53, 49, 50, 46, 53, 57, 56,
                50, 55, 51, 52, 54, 56, 48, 49, 55, 53, 55, 56, 49, 50, 53]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeBigNumber(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeBigNumber(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteJSON", () => {
    const cases = [
        new Case<JSON.Value>("JSON", JSON.parse(`{"foo": "bar"}`), [173, 123, 34, 102, 111, 111, 34, 58, 34, 98, 97, 114, 34, 125]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeJSON(testcase.input);
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeJSON(testcase.input);

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteArray", () => {
    const cases = [
      new Case<Array<u8>>("Array", [10, 20, 30], [147, 10, 20, 30]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeArray<u8>(testcase.input, (writer: Write, item: u8) => {
        writer.writeUInt8(item);
      });
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeArray<u8>(testcase.input, (writer: Write, item: u8) => {
        writer.writeUInt8(item);
      });

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });

  it("TestWriteMap", () => {
    const map1 = new Map<string, Array<i32>>();
    map1.set("foo", [1, -1, 42]);
    map1.set("baz", [12412, -98987]);

    const cases = [
        new Case<Map<string, Array<i32>>>(
            "Map", map1,
            [130, 163, 102, 111, 111, 147, 1, 255, 42, 163, 98,
             97, 122, 146, 209, 48, 124, 210, 255, 254, 125, 85]),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeMap<string, Array<i32>>(
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
      encoder.writeMap<string, Array<i32>>(
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

  it("TestWriteExtGenericMap", () => {
    const map1 = new Map<i32, Array<i32>>();
    map1.set(1, [3, 5, 9]);
    map1.set(2, [1, 4, 7]);
    const map2 = new Map<i32, Array<i32>>();
    for (let i = 0; i < 16; ++i) {
      map2.set(i, [i, i + 1, i + 2]);
    }

    const cases = [
        new Case<Map<i32, Array<i32>>>(
          "map 8",
          map1,
          [199, 11, 1, 130, 1, 147, 3, 5, 9, 2, 147, 1, 4, 7]
        ),
        new Case<Map<i32, Array<i32>>>(
          "map 16",
          map2,
          [
            199, 83, 1, 222, 0, 16, 0, 147, 0, 1, 2, 1, 147, 1, 2, 3, 2, 147, 2, 3, 4, 3, 147,
            3, 4, 5, 4, 147, 4, 5, 6, 5, 147, 5, 6, 7, 6, 147, 6, 7, 8, 7, 147, 7, 8, 9, 8,
            147, 8, 9, 10, 9, 147, 9, 10, 11, 10, 147, 10, 11, 12, 11, 147, 11, 12, 13, 12,
            147, 12, 13, 14, 13, 147, 13, 14, 15, 14, 147, 14, 15, 16, 15, 147, 15, 16, 17,
          ]
        )
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeExtGenericMap(
        testcase.input,
        (writer: Write, key: i32): void => {
          writer.writeInt32(key);
        },
        (writer: Write, value: Array<i32>) => {
          writer.writeArray(value, (writer: Write, item: i32) => {
            writer.writeInt32(item);
          });
        }
      );
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeExtGenericMap(
        testcase.input,
        (writer: Write, key: i32): void => {
          writer.writeInt32(key);
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

  it("TestWriteExtGenericMap Nested Maps", () => {
    const rootMap = new Map<string, Map<string, u8>>();
    const subMap = new Map<string, u8>();
    subMap.set("Hello", 1);
    subMap.set("Heyo", 50);
    rootMap.set("Nested", subMap);

    const cases = [
        new Case<Map<string, Map<string, u8>>>(
          "nested maps",
          rootMap,
          [199, 25, 1, 129, 166, 78, 101, 115, 116, 101, 100, 199, 14, 1, 130,
          165, 72, 101, 108, 108, 111, 1, 164, 72, 101, 121, 111, 50]
        ),
    ];

    for (let i: i32 = 0; i < cases.length; ++i) {
      const testcase = cases[i];
      const sizer = new WriteSizer();
      sizer.writeExtGenericMap(
        testcase.input,
        (writer: Write, key: string): void => {
          writer.writeString(key);
        },
        (writer: Write, value: Map<string, u8>) => {
          writer.writeExtGenericMap(
            value,
            (writer: Write, key: string) => {
              writer.writeString(key);
            },
            (writer: Write, value: u8) => {
              writer.writeUInt8(value);
            }
          );
        }
      );
      const buffer = new ArrayBuffer(sizer.length);
      const encoder = new WriteEncoder(buffer, sizer);
      encoder.writeExtGenericMap(
        testcase.input,
        (writer: Write, key: string): void => {
          writer.writeString(key);
        },
        (writer: Write, value: Map<string, u8>) => {
          writer.writeExtGenericMap(
            value,
            (writer: Write, key: string) => {
              writer.writeString(key);
            },
            (writer: Write, value: u8) => {
              writer.writeUInt8(value);
            }
          );
        }
      );

      const actual = encoder._view.buffer;
      const expected = fill(testcase.want);
      expect(actual).toStrictEqual(expected);
    }
  });
});
