import {
  Nullable,
  Write,
  WriteSizer,
  WriteEncoder,
  ReadDecoder
} from "@web3api/wasm-as";

export function serializeimportedMethodArgs(input: {
  str: string,
  optStr: string | null,
  u: u32,
  optU: Nullable<u32>,
  uArrayArray: Array<Array<Nullable<u32>> | null>
}): ArrayBuffer {
  const sizer = new WriteSizer();
  writeimportedMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeimportedMethodArgs(encoder, input);
  return buffer;
}

function writeimportedMethodArgs(
  writer: Write,
  input: {
    str: string,
    optStr: string | null,
    u: u32,
    optU: Nullable<u32>,
    uArrayArray: Array<Array<Nullable<u32>> | null>
  }
) {
  writer.writeMapLength(5);
  writer.writeString("str");
  writer.writeString(input.str);
  writer.writeString("optStr");
  writer.writeNullableString(input.optStr);
  writer.writeString("u");
  writer.writeUInt32(input.u);
  writer.writeString("optU");
  writer.writeNullableUInt32(input.optU);
  writer.writeString("uArrayArray");
  writer.writeArray(input.uArrayArray, (writer: Write, item: Array<Nullable<u32>> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: Nullable<u32>): void => {
      writer.writeNullableUInt32(item);
    });
  });
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): string {
  const reader = new ReadDecoder(buffer);
  return reader.readString();
}

export function serializeanotherMethodArgs(input: {
  arg: Array<string>
}): ArrayBuffer {
  const sizer = new WriteSizer();
  writeanotherMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeanotherMethodArgs(encoder, input);
  return buffer;
}

function writeanotherMethodArgs(
  writer: Write,
  input: {
    arg: Array<string>
  }
) {
  writer.writeMapLength(1);
  writer.writeString("arg");
  writer.writeArray(input.arg, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
}

export function deserializeanotherMethodResult(buffer: ArrayBuffer): i64 {
  const reader = new ReadDecoder(buffer);
  return reader.readInt64();
}
