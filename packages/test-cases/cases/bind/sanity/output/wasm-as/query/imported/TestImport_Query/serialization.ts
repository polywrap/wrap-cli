import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
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
  union: Types.TestImport_Union;
  optUnion: Types.TestImport_Union | null;
  unionArray: Array<Types.TestImport_Union>;
  optUnionArray: Array<Types.TestImport_Union | null> | null;
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
  writer.writeMapLength(17);
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
  writer.context().push("union", "Types.TestImport_Union", "writing property");
  writer.writeString("union");
  Types.TestImport_Union.write(writer, input.union);
  writer.context().pop();
  writer.context().push("optUnion", "Types.TestImport_Union | null", "writing property");
  writer.writeString("optUnion");
  if (input.optUnion) {
    Types.TestImport_Union.write(writer, input.optUnion as Types.TestImport_Union);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("unionArray", "Array<Types.TestImport_Union>", "writing property");
  writer.writeString("unionArray");
  writer.writeArray(input.unionArray, (writer: Write, item: Types.TestImport_Union): void => {
    Types.TestImport_Union.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("optUnionArray", "Array<Types.TestImport_Union | null> | null", "writing property");
  writer.writeString("optUnionArray");
  writer.writeNullableArray(input.optUnionArray, (writer: Write, item: Types.TestImport_Union | null): void => {
    if (item) {
      Types.TestImport_Union.write(writer, item as Types.TestImport_Union);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Types.TestImport_Object | null {
  const context: Context =  new Context("Deserializing imported module-type: importedMethod");
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
