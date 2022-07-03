import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Option,
  BigInt,
  BigNumber,
  BigFraction,
  Fraction,
  JSON,
  Context
} from "@polywrap/wasm-as";
import * as Types from "../..";

export class Args_importedMethod {
  str: string;
  optStr: string | null;
  u: u32;
  optU: Option<u32>;
  uArrayArray: Array<Array<Option<u32>> | null>;
  object: Types.TestImport_Object;
  optObject: Types.TestImport_Object | null;
  objectArray: Array<Types.TestImport_Object>;
  optObjectArray: Array<Types.TestImport_Object | null> | null;
  en: Types.TestImport_Enum;
  optEnum: Option<Types.TestImport_Enum>;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray: Array<Option<Types.TestImport_Enum>> | null;
}

export function serializeimportedMethodArgs(args: Args_importedMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: importedMethod");
  const sizer = new WriteSizer(sizerContext);
  writeimportedMethodArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: importedMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeimportedMethodArgs(encoder, args);
  return buffer;
}

export function writeimportedMethodArgs(
  writer: Write,
  args: Args_importedMethod
): void {
  writer.writeMapLength(13);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(args.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeOptionalString(args.optStr);
  writer.context().pop();
  writer.context().push("u", "u32", "writing property");
  writer.writeString("u");
  writer.writeUInt32(args.u);
  writer.context().pop();
  writer.context().push("optU", "Option<u32>", "writing property");
  writer.writeString("optU");
  writer.writeOptionalUInt32(args.optU);
  writer.context().pop();
  writer.context().push("uArrayArray", "Array<Array<Option<u32>> | null>", "writing property");
  writer.writeString("uArrayArray");
  writer.writeArray(args.uArrayArray, (writer: Write, item: Array<Option<u32>> | null): void => {
    writer.writeOptionalArray(item, (writer: Write, item: Option<u32>): void => {
      writer.writeOptionalUInt32(item);
    });
  });
  writer.context().pop();
  writer.context().push("object", "Types.TestImport_Object", "writing property");
  writer.writeString("object");
  Types.TestImport_Object.write(writer, args.object);
  writer.context().pop();
  writer.context().push("optObject", "Types.TestImport_Object | null", "writing property");
  writer.writeString("optObject");
  if (args.optObject) {
    Types.TestImport_Object.write(writer, args.optObject as Types.TestImport_Object);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("objectArray", "Array<Types.TestImport_Object>", "writing property");
  writer.writeString("objectArray");
  writer.writeArray(args.objectArray, (writer: Write, item: Types.TestImport_Object): void => {
    Types.TestImport_Object.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("optObjectArray", "Array<Types.TestImport_Object | null> | null", "writing property");
  writer.writeString("optObjectArray");
  writer.writeOptionalArray(args.optObjectArray, (writer: Write, item: Types.TestImport_Object | null): void => {
    if (item) {
      Types.TestImport_Object.write(writer, item as Types.TestImport_Object);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
  writer.context().push("en", "Types.TestImport_Enum", "writing property");
  writer.writeString("en");
  writer.writeInt32(args.en);
  writer.context().pop();
  writer.context().push("optEnum", "Option<Types.TestImport_Enum>", "writing property");
  writer.writeString("optEnum");
  writer.writeOptionalInt32(args.optEnum);
  writer.context().pop();
  writer.context().push("enumArray", "Array<Types.TestImport_Enum>", "writing property");
  writer.writeString("enumArray");
  writer.writeArray(args.enumArray, (writer: Write, item: Types.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.context().pop();
  writer.context().push("optEnumArray", "Array<Option<Types.TestImport_Enum>> | null", "writing property");
  writer.writeString("optEnumArray");
  writer.writeOptionalArray(args.optEnumArray, (writer: Write, item: Option<Types.TestImport_Enum>): void => {
    writer.writeOptionalInt32(item);
  });
  writer.context().pop();
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Types.TestImport_Object | null {
  const context: Context = new Context("Deserializing imported module-type: importedMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("importedMethod", "Types.TestImport_Object | null", "reading function output");
  let object: Types.TestImport_Object | null = null;
  if (!reader.isNextNil()) {
    object = Types.TestImport_Object.read(reader);
  }
  const res: Types.TestImport_Object | null =  object;
  reader.context().pop();

  return res;
}

export class Args_anotherMethod {
  arg: Array<string>;
}

export function serializeanotherMethodArgs(args: Args_anotherMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: anotherMethod");
  const sizer = new WriteSizer(sizerContext);
  writeanotherMethodArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: anotherMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeanotherMethodArgs(encoder, args);
  return buffer;
}

export function writeanotherMethodArgs(
  writer: Write,
  args: Args_anotherMethod
): void {
  writer.writeMapLength(1);
  writer.context().push("arg", "Array<string>", "writing property");
  writer.writeString("arg");
  writer.writeArray(args.arg, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializeanotherMethodResult(buffer: ArrayBuffer): i32 {
  const context: Context = new Context("Deserializing imported module-type: anotherMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("anotherMethod", "i32", "reading function output");
  const res: i32 = reader.readInt32();
  reader.context().pop();

  return res;
}
