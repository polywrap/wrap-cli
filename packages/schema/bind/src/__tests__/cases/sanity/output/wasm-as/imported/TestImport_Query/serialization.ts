import {
  Nullable,
  Write,
  WriteSizer,
  WriteEncoder,
  ReadDecoder
} from "@web3api/wasm-as";
import * as Objects from "../..";

export class Input_importedMethod {
  str: string;
  optStr: string | null;
  u: u32;
  optU: Nullable<u32>;
  uArrayArray: Array<Array<Nullable<u32>> | null>;
  object: Objects.TestImport_Object;
  optObject: Objects.TestImport_Object | null;
  objectArray: Array<Objects.TestImport_Object>;
  optObjectArray: Array<Objects.TestImport_Object | null> | null;
}

export function serializeimportedMethodArgs(input: Input_importedMethod): ArrayBuffer {
  const objects: (ArrayBuffer | null)[] = [
    Objects.TestImport_Object.toBuffer(input.object),
    input.optObject ? Objects.TestImport_Object.toBuffer(input.optObject) : null,
  ];
  const sizer = new WriteSizer();
  writeimportedMethodArgs(sizer, input, objects);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeimportedMethodArgs(encoder, input, objects);
  return buffer;
}

function writeimportedMethodArgs(
  writer: Write,
  input: Input_importedMethod,
  objects: (ArrayBuffer | null)[]
): void {
  let objectsIdx = 0;
  writer.writeMapLength(9);
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
  writer.writeString("object");
  writer.writeNullableBytes(objects[objectsIdx++]);
  writer.writeString("optObject");
  writer.writeNullableBytes(objects[objectsIdx++]);
  writer.writeString("objectArray");
  writer.writeArray(input.objectArray, (writer: Write, item: Objects.TestImport_Object): void => {
    writer.writeBytes(Objects.TestImport_Object.toBuffer(item));
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(input.optObjectArray, (writer: Write, item: Objects.TestImport_Object | null): void => {
    writer.writeNullableBytes(item ? Objects.TestImport_Object.toBuffer(item) : null);
  });
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Objects.TestImport_Object | null {
  const reader = new ReadDecoder(buffer);
  const bytes = reader.readNullableBytes();
  var object: Objects.TestImport_Object | null = null;
  if (bytes) {
    object = Objects.TestImport_Object.fromBuffer(bytes);
  }
  return object;
}

export class Input_anotherMethod {
  arg: Array<string>;
}

export function serializeanotherMethodArgs(input: Input_anotherMethod): ArrayBuffer {
  const objects: (ArrayBuffer | null)[] = [
  ];
  const sizer = new WriteSizer();
  writeanotherMethodArgs(sizer, input, objects);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeanotherMethodArgs(encoder, input, objects);
  return buffer;
}

function writeanotherMethodArgs(
  writer: Write,
  input: Input_anotherMethod,
  objects: (ArrayBuffer | null)[]
): void {
  let objectsIdx = 0;
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
