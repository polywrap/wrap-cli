import {
  Nullable,
  Read,
  ReadDecoder,
  Write,
  WriteEncoder,
  WriteSizer
} from "../msgpack";

class Sanity {
  nil: string | null = "null";
  int8: i8;
  int16: i16;
  int32: i32;
  int64: i64;
  uint8: u8;
  uint16: u16;
  uint32: u32;
  uint64: u64;
  optUint32: Nullable<u32> = new Nullable<u32>();
  optUint64: Nullable<u64> = new Nullable<u64>();
  float32: f32;
  float64: f64;
  str: string = "";
  bytes: ArrayBuffer = new ArrayBuffer(1);
  array: Array<u8> = new Array<u8>();
  map: Map<string, Array<i32>> = new Map<string, Array<i32>>();

  init(): void {
    this.nil = null;
    this.int8 = -128;
    this.int16 = -32768;
    this.int32 = -2147483648;
    this.int64 = -9223372036854775808;
    this.uint8= 255;
    this.uint16 = 65535;
    this.uint32 = 4294967295;
    this.uint64 = 18446744073709551615;
    this.optUint32 = Nullable.fromValue<u32>(234234234);
    this.optUint64 = Nullable.fromNull<u64>();
    this.float32 = 3.40282344818115234375;
    this.float64 = 3124124512.598273468017578125;
    this.str = "Hello, world!";
    this.bytes = new ArrayBuffer(12);
    this.array = [10, 20, 30];
    this.map = new Map<string, Array<i32>>();
    this.map.set("foo", [1, -1, 42]);
    this.map.set("baz", [12412, -98987]);
  }

  toBuffer(): ArrayBuffer {
    const sizer = new WriteSizer();
    serializeSanity(sizer, this);
    const buffer = new ArrayBuffer(sizer.length);
    const encoder = new WriteEncoder(buffer);
    serializeSanity(encoder, this);
    return buffer;
  }

  fromBuffer(buffer: ArrayBuffer): void {
    const decoder = new ReadDecoder(buffer);
    deserializeSanity(decoder, this);
  }
}

function serializeSanity(writer: Write, type: Sanity): void {
  writer.writeMapLength(17);
  writer.writeString("nil");
  writer.writeNullableString(type.nil);
  writer.writeString("int8");
  writer.writeInt8(type.int8);
  writer.writeString("int16");
  writer.writeInt16(type.int16);
  writer.writeString("int32");
  writer.writeInt32(type.int32);
  writer.writeString("int64");
  writer.writeInt64(type.int64);
  writer.writeString("uint8");
  writer.writeUInt8(type.uint8);
  writer.writeString("uint16");
  writer.writeUInt16(type.uint16);
  writer.writeString("uint32");
  writer.writeUInt32(type.uint32);
  writer.writeString("uint64");
  writer.writeUInt64(type.uint64);
  writer.writeString("optUint32");
  writer.writeNullableUInt32(type.optUint32);
  writer.writeString("optUint64");
  writer.writeNullableUInt64(type.optUint64);
  writer.writeString("float32");
  writer.writeFloat32(type.float32);
  writer.writeString("float64");
  writer.writeFloat64(type.float64);
  writer.writeString("str");
  writer.writeString(type.str);
  writer.writeString("bytes");
  writer.writeBytes(type.bytes);
  writer.writeString("array");
  writer.writeArray(type.array, (writer: Write, item: u8) => {
    writer.writeUInt8(item);
  });
  writer.writeString("map");
  writer.writeMap(
     type.map,
    (writer: Write, key: string): void => {
      writer.writeString(key);
    },
    (writer: Write, value: Array<i32>) => {
      writer.writeArray(value, (writer: Write, item: i32) => {
        writer.writeInt32(item);
      });
    }
  );
}

function deserializeSanity(reader: Read, type: Sanity): void {
  var numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "nil") {
      type.nil = reader.readNullableString();
    } else if (field == "int8") {
      type.int8 = reader.readInt8();
    } else if (field == "int16") {
      type.int16 = reader.readInt16();
    } else if (field == "int32") {
      type.int32 = reader.readInt32();
    } else if (field == "int64") {
      type.int64 = reader.readInt64();
    } else if (field == "uint8") {
      type.uint8 = reader.readUInt8();
    } else if (field == "uint16") {
      type.uint16 = reader.readUInt16();
    } else if (field == "uint32") {
      type.uint32 = reader.readUInt32();
    } else if (field == "uint64") {
      type.uint64 = reader.readUInt64();
    } else if (field == "optUint32") {
      type.optUint32 = reader.readNullableUInt32();
    } else if (field == "optUint64") {
      type.optUint64 = reader.readNullableUInt64();
    } else if (field == "float32") {
      type.float32 = reader.readFloat32();
    } else if (field == "float64") {
      type.float64 = reader.readFloat64();
    } else if (field == "str") {
      type.str = reader.readString();
    } else if (field == "bytes") {
      type.bytes = reader.readBytes();
    } else if (field == "array") {
      type.array = reader.readArray(
        (reader: Read): u8 => {
          return reader.readUInt8();
        }
      );
    } else if (field == "map") {
      type.map = reader.readMap(
        (reader: Read): string => {
          return reader.readString();
        },
        (reader: Read): Array<i32> => {
          return reader.readArray(
            (reader: Read): i32 => {
              return reader.readInt32();
            }
          );
        }
      );
    } else {
      throw new Error(
        "Sanity.decode: Unknown field name '" + field + "'"
      );
    }
  }
}

// TODO: nullable (readNullable?), array, array of arrays

describe("MsgPack: Sanity", () => {
  it("Serializes & Deserializes", () => {
    const input = new Sanity();
    input.init();
    const output = new Sanity();
    output.fromBuffer(input.toBuffer());
    expect(output).toStrictEqual(input);
  });
});
