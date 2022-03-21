import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import * as Types from "../..";

export class Input_importedMethod {
  str: string;
  object: Types.TestImport_Object;
  objectArray: Array<Types.TestImport_Object>;
}

export function serializeimportedMethodArgs(input: Input_importedMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: importedMethod");
  const sizer = new WriteSizer(sizerContext);
  writeimportedMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: importedMethod");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeimportedMethodArgs(encoder, input);
  return buffer;
}

export function writeimportedMethodArgs(
  writer: Write,
  input: Input_importedMethod
): void {
  writer.writeMapLength(3);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(input.str);
  writer.context().pop();
  writer.context().push("object", "Types.TestImport_Object", "writing property");
  writer.writeString("object");
  Types.TestImport_Object.write(writer, input.object);
  writer.context().pop();
  writer.context().push("objectArray", "Array<Types.TestImport_Object>", "writing property");
  writer.writeString("objectArray");
  writer.writeArray(input.objectArray, (writer: Write, item: Types.TestImport_Object): void => {
    Types.TestImport_Object.write(writer, item);
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

export function deserializeanotherMethodResult(buffer: ArrayBuffer): i32 {
  const context: Context =  new Context("Deserializing imported module-type: anotherMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("anotherMethod", "i32", "reading function output");
  const res: i32 = reader.readInt32();
  reader.context().pop();

  return res;
}
