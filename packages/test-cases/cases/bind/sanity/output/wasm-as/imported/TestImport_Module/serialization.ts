import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Option,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import * as Types from "../..";

export class Input_importedMethod {
  str: string;
  optStr: Option<string>;
  u: u32;
  optU: Option<u32>;
  uArrayArray: Array<Option<Array<Option<u32>>>>;
  object: Types.TestImport_Object;
  optObject: Option<Types.TestImport_Object>;
  objectArray: Array<Types.TestImport_Object>;
  optObjectArray: Option<Array<Option<Types.TestImport_Object>>>;
  en: Types.TestImport_Enum;
  optEnum: Option<Types.TestImport_Enum>;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray: Option<Array<Option<Types.TestImport_Enum>>>;
}

export function serializeimportedMethodArgs(input: Input_importedMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: importedMethod");
  const sizer = new WriteSizer(sizerContext);
  writeimportedMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: importedMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
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
  writer.context().push("optStr", "Option<string>", "writing property");
  writer.writeString("optStr");
  writer.writeNullableString(input.optStr);
  writer.context().pop();
  writer.context().push("u", "u32", "writing property");
  writer.writeString("u");
  writer.writeUInt32(input.u);
  writer.context().pop();
  writer.context().push("optU", "Option<u32>", "writing property");
  writer.writeString("optU");
  writer.writeNullableUInt32(input.optU);
  writer.context().pop();
  writer.context().push("uArrayArray", "Array<Option<Array<Option<u32>>>>", "writing property");
  writer.writeString("uArrayArray");
  writer.writeArray(input.uArrayArray, (writer: Write, item: Option<Array<Option<u32>>>): void => {
    writer.writeNullableArray(item, (writer: Write, item: Option<u32>): void => {
      writer.writeNullableUInt32(item);
    });
  });
  writer.context().pop();
  writer.context().push("object", "Types.TestImport_Object", "writing property");
  writer.writeString("object");
  Types.TestImport_Object.write(writer, input.object);
  writer.context().pop();
  writer.context().push("optObject", "Option<Types.TestImport_Object>", "writing property");
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
  writer.context().push("optObjectArray", "Option<Array<Option<Types.TestImport_Object>>>", "writing property");
  writer.writeString("optObjectArray");
  writer.writeNullableArray(input.optObjectArray, (writer: Write, item: Option<Types.TestImport_Object>): void => {
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
  writer.context().push("optEnum", "Option<Types.TestImport_Enum>", "writing property");
  writer.writeString("optEnum");
  writer.writeNullableInt32(input.optEnum);
  writer.context().pop();
  writer.context().push("enumArray", "Array<Types.TestImport_Enum>", "writing property");
  writer.writeString("enumArray");
  writer.writeArray(input.enumArray, (writer: Write, item: Types.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.context().pop();
  writer.context().push("optEnumArray", "Option<Array<Option<Types.TestImport_Enum>>>", "writing property");
  writer.writeString("optEnumArray");
  writer.writeNullableArray(input.optEnumArray, (writer: Write, item: Option<Types.TestImport_Enum>): void => {
    writer.writeNullableInt32(item);
  });
  writer.context().pop();
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Option<Types.TestImport_Object> {
  const context: Context =  new Context("Deserializing imported module-type: importedMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("importedMethod", "Option<Types.TestImport_Object>", "reading function output");
  let object: Option<Types.TestImport_Object> = Option.None<Types.TestImport_Object>();
  if (!reader.isNextNil()) {
    object = Types.TestImport_Object.read(reader);
  }
  const res: Option<Types.TestImport_Object> =  object;
  reader.context().pop();

  return res;
}

export class Input_anotherMethod {
  arg: Array<string>;
}

export function serializeanotherMethodArgs(input: Input_anotherMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: anotherMethod");
  const sizer = new WriteSizer(sizerContext);
  writeanotherMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: anotherMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
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

export function deserializeanotherMethodResult(buffer: ArrayBuffer): i32 {
  const context: Context =  new Context("Deserializing imported module-type: anotherMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("anotherMethod", "i32", "reading function output");
  const res: i32 = reader.readInt32();
  reader.context().pop();

  return res;
}
