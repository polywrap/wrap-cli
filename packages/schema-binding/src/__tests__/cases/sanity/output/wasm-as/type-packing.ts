import { Write, WriteSizer, WriteEncoder } from "@web3api/wasm-as";
import {
  CustomType
} from "./";

function __write_CustomType(writer: Write, type: CustomType) {
  writer.writeMapSize(18);
  writer.writeString("str");
  writer.writeString(type.str);
  writer.writeString("optStr");
  if (type.optStr === null) {
    writer.writeNil();
  } else {
    writer.writeString(type.optStr);
  }
  writer.writeString("u");
  writer.writeUInt32(type.u);
  writer.writeString("optU");
  if (type.optU === null) {
    writer.writeNil();
  } else {
    writer.writeUInt32(type.optU);
  }
  writer.writeString("u8");
  writer.writeUInt8(type.u8);
  writer.writeString("u16");
  writer.writeUInt16(type.u16);
  writer.writeString("u32");
  writer.writeUInt32(type.u32);
  writer.writeString("u64");
  writer.writeUInt64(type.u64);
  writer.writeString("i");
  writer.writeInt32(type.i);
  writer.writeString("i8");
  writer.writeInt8(type.i8);
  writer.writeString("i16");
  writer.writeInt16(type.i16);
  writer.writeString("i32");
  writer.writeInt32(type.i32);
  writer.writeString("i64");
  writer.writeInt64(type.i64);
  writer.writeString("uArray");
  writer.writeArray(type.uArray, (writer: Write, item: u32): void => {
    writer.writeUInt32(item);
  });
  writer.writeString("uOptArray");
  writer.writeNullableArray(type.uOptArray, (writer: Write, item: u32): void => {
    writer.writeUInt32(item);
  });
  writer.writeString("optUOptArray");
  writer.writeNullableArray(type.optUOptArray, (writer: Write, item: u32 | null): void => {
    if (item === null) {
      writer.writeNil();
    } else {
      writer.writeUInt32(item);
    }
  });
  writer.writeString("optStrOptArray");
  writer.writeNullableArray(type.optStrOptArray, (writer: Write, item: string | null): void => {
    if (item === null) {
      writer.writeNil();
    } else {
      writer.writeString(item);
    }
  });
  writer.writeString("uArrayArray");
  writer.writeArray(type.uArrayArray, (writer: Write, item: u32[]): void => {
    writer.writeArray(item, (writer: Write, item: u32): void => {
      writer.writeUInt32(item);
    });
  });
}
