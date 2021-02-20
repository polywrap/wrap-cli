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
  const sizer = new WriteSizer();
  writeimportedMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeimportedMethodArgs(encoder, input);
  return buffer;
}

export function writeimportedMethodArgs(
  writer: Write,
  input: Input_importedMethod
): void {
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
  Objects.TestImport_Object.write(writer, input.object);
  writer.writeString("optObject");
  if (input.optObject) {
    Objects.TestImport_Object.write(writer, input.optObject);
  } else {
    writer.writeNil();
  }
  writer.writeString("objectArray");
  writer.writeArray(input.objectArray, (writer: Write, item: Objects.TestImport_Object): void => {
    Objects.TestImport_Object.write(writer, item);
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(input.optObjectArray, (writer: Write, item: Objects.TestImport_Object | null): void => {
    if (item) {
      Objects.TestImport_Object.write(writer, item);
    } else {
      writer.writeNil();
    }
  });
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Objects.TestImport_Object | null {
  const reader = new ReadDecoder(buffer);
  var object: Objects.TestImport_Object | null = null;
  if (!reader.isNextNil()) {
    object = Objects.TestImport_Object.read(reader);
  }
  return object;
}

export class Input_anotherMethod {
  arg: Array<string>;
}

export function serializeanotherMethodArgs(input: Input_anotherMethod): ArrayBuffer {
  const sizer = new WriteSizer();
  writeanotherMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeanotherMethodArgs(encoder, input);
  return buffer;
}

export function writeanotherMethodArgs(
  writer: Write,
  input: Input_anotherMethod
): void {
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
