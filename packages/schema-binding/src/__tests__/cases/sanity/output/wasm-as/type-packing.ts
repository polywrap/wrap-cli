import { Write, WriteSizer, WriteEncoder } from "@web3api/wasm-as";
import {
  CustomType
} from "./";

function __write_CustomType(writer: Write, type: CustomType) {
  writer.writeMapSize(19);
  writer.writeString("str");
  writer.writeString(type.str);
  writer.writeString("optStr");
  writer.writeNullableString(type.optStr);
  writer.writeString("u");
  writer.writeUInt32(type.u);
  writer.writeString("optU");
  writer.writeNullableUInt32(type.optU);
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
    writer.writeNullableUInt32(item);
  });
  writer.writeString("optStrOptArray");
  writer.writeNullableArray(type.optStrOptArray, (writer: Write, item: string | null): void => {
    writer.writeNullableString(item);
  });
  writer.writeString("uArrayArray");
  writer.writeArray(type.uArrayArray, (writer: Write, item: Array<u32>): void => {
    writer.writeArray(item, (writer: Write, item: u32): void => {
      writer.writeUInt32(item);
    });
  });
  writer.writeString("uOptArrayOptArray");
  writer.writeArray(type.uOptArrayOptArray, (writer: Write, item: Array<u64 | null> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: u64 | null): void => {
      writer.writeNullableUInt64(item);
    });
  });
}
