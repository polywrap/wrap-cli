/* eslint-disable @typescript-eslint/no-inferrable-types */

import {
  Nullable,
  Read,
  ReadDecoder,
  Write,
  WriteEncoder,
  WriteSizer,
} from "../";

class Sanity {
  int8: i8;
  int16: i16;
  int32: i32;
  int64: i64;
  uint8: u8;
  uint16: u16;
  uint32: u32;
  uint64: u64;

  init(): void {
    this.int8 = -128;
    this.int16 = -32768;
    this.int32 = -2147483648;
    this.int64 = -9223372036854775808;
    this.uint8 = 255;
    this.uint16 = 65535;
    this.uint32 = 4294967295;
    this.uint64 = 18446744073709551615;
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
  writer.writeMapLength(8);
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
}

function deserializeSanity(reader: Read, type: Sanity): void {
  let numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "int8") {
      type.int8 = reader.readInt16();
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
    } else {
      throw new Error("Sanity.decode: Unknown field name '" + field + "'");
    }
  }
}

describe("MsgPack: Overflow", () => {
  it("Serializes & Deserializes", () => {
    const input = new Sanity();
    input.init();
    const output = new Sanity();
    output.fromBuffer(input.toBuffer());
    expect(output).toStrictEqual(input);
  });
});