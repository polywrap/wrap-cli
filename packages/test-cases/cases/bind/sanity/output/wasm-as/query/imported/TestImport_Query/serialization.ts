import {
  Nullable,
  Write,
  WriteSizer,
  WriteEncoder,
  ReadDecoder,
  BigInt,
  Context
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
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: importedMethod");
  const sizer = new WriteSizer(sizerContext);
  writeimportedMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: importedMethod");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeimportedMethodArgs(encoder, input);
  return buffer;
}

export function writeimportedMethodArgs(
  writer: Write,
  input: Input_importedMethod
): void {
  writer.writeMapLength(13);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(input.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeNullableString(input.optStr);
  writer.context().pop();
  writer.context().push("u", "u32", "writing property");
  writer.writeString("u");
  writer.writeUInt32(input.u);
  writer.context().pop();
  writer.context().push("optU", "Nullable<u32>", "writing property");
  writer.writeString("optU");
  writer.writeNullableUInt32(input.optU);
  writer.context().pop();
  writer.context().push("uArrayArray", "Array<Array<Nullable<u32>> | null>", "writing property");
  writer.writeString("uArrayArray");
  writer.writeArray(input.uArrayArray, (writer: Write, item: Array<Nullable<u32>> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: Nullable<u32>): void => {
      writer.writeNullableUInt32(item);
    });
  });
  writer.context().pop();
  writer.context().push("object", "Types.TestImport_Object", "writing property");
  writer.writeString("object");
  Types.TestImport_Object.write(writer, input.object);
  writer.context().pop();
  writer.context().push("optObject", "Types.TestImport_Object | null", "writing property");
  writer.writeString("optObject");
  if (input.optObject) {
    Types.TestImport_Object.write(writer, input.optObject as Types.TestImport_Object);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("objectArray", "Array<Types.TestImport_Object>", "writing property");
  writer.writeString("objectArray");
  writer.writeArray(input.objectArray, (writer: Write, item: Types.TestImport_Object): void => {
    Types.TestImport_Object.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("optObjectArray", "Array<Types.TestImport_Object | null> | null", "writing property");
  writer.writeString("optObjectArray");
  writer.writeNullableArray(input.optObjectArray, (writer: Write, item: Types.TestImport_Object | null): void => {
    if (item) {
      Types.TestImport_Object.write(writer, item as Types.TestImport_Object);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
  writer.context().push("en", "Types.TestImport_Enum", "writing property");
  writer.writeString("en");
  writer.writeInt32(input.en);
  writer.context().pop();
  writer.context().push("optEnum", "Nullable<Types.TestImport_Enum>", "writing property");
  writer.writeString("optEnum");
  writer.writeNullableInt32(input.optEnum);
  writer.context().pop();
  writer.context().push("enumArray", "Array<Types.TestImport_Enum>", "writing property");
  writer.writeString("enumArray");
  writer.writeArray(input.enumArray, (writer: Write, item: Types.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.context().pop();
  writer.context().push("optEnumArray", "Array<Nullable<Types.TestImport_Enum>> | null", "writing property");
  writer.writeString("optEnumArray");
  writer.writeNullableArray(input.optEnumArray, (writer: Write, item: Nullable<Types.TestImport_Enum>): void => {
    writer.writeNullableInt32(item);
  });
  writer.context().pop();
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Types.TestImport_Object | null {
  const context: Context =  new Context("Deserializing imported query-type: importedMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("importedMethod", "Types.TestImport_Object | null", "reading function output");
  var object: Types.TestImport_Object | null = null;
  if (!reader.isNextNil()) {
    object = Types.TestImport_Object.read(reader);
  }
  const res: Types.TestImport_Object | null =  object;
  reader.context().pop();

  return res;
}

export class Input_anotherMethod {
  arg: Array<string>;
}

export function serializeanotherMethodArgs(input: Input_anotherMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: anotherMethod");
  const sizer = new WriteSizer(sizerContext);
  writeanotherMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: anotherMethod");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeanotherMethodArgs(encoder, input);
  return buffer;
}

export function writeanotherMethodArgs(
  writer: Write,
  input: Input_anotherMethod
): void {
  writer.writeMapLength(1);
  writer.context().push("arg", "Array<string>", "writing property");
  writer.writeString("arg");
  writer.writeArray(input.arg, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializeanotherMethodResult(buffer: ArrayBuffer): i64 {
  const context: Context =  new Context("Deserializing imported query-type: anotherMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("anotherMethod", "i64", "reading function output");
  const res: i64 = reader.readInt64();
  reader.context().pop();

  return res;
}
