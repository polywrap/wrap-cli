import {
  Nullable,
  Write,
  WriteSizer,
  WriteEncoder,
  ReadDecoder,
  BigInt
} from "@web3api/wasm-as";
import * as Types from "../..";

export class Input_importedMethod {
  str: string;
  optStr: string | null;
  u: u32;
  optU: Nullable<u32>;
  uArrayArray: Array<Array<Nullable<u32>> | null>;
  object: Types.TestImport_Object;
  optObject: Types.TestImport_Object | null;
  objectArray: Array<Types.TestImport_Object>;
  optObjectArray: Array<Types.TestImport_Object | null> | null;
  en: Types.TestImport_Enum;
  optEnum: Nullable<Types.TestImport_Enum>;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray: Array<Nullable<Types.TestImport_Enum>> | null;
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
  writer.writeMapLength(13);
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
  Types.TestImport_Object.write(writer, input.object);
  writer.writeString("optObject");
  if (input.optObject) {
    Types.TestImport_Object.write(writer, input.optObject as Types.TestImport_Object);
  } else {
    writer.writeNil();
  }
  writer.writeString("objectArray");
  writer.writeArray(input.objectArray, (writer: Write, item: Types.TestImport_Object): void => {
    Types.TestImport_Object.write(writer, item);
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(input.optObjectArray, (writer: Write, item: Types.TestImport_Object | null): void => {
    if (item) {
      Types.TestImport_Object.write(writer, item as Types.TestImport_Object);
    } else {
      writer.writeNil();
    }
  });
  writer.writeString("en");
  writer.writeInt32(input.en);
  writer.writeString("optEnum");
  writer.writeNullableInt32(input.optEnum);
  writer.writeString("enumArray");
  writer.writeArray(input.enumArray, (writer: Write, item: Types.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.writeString("optEnumArray");
  writer.writeNullableArray(input.optEnumArray, (writer: Write, item: Nullable<Types.TestImport_Enum>): void => {
    writer.writeNullableInt32(item);
  });
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Types.TestImport_Object | null {
  const reader = new ReadDecoder(buffer);
  var object: Types.TestImport_Object | null = null;
  if (!reader.isNextNil()) {
    object = Types.TestImport_Object.read(reader);
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
