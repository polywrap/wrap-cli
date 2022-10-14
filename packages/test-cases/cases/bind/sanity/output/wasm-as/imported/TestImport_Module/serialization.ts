import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Box,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import * as Types from "../..";

export class Args_importedMethod {
  str: string;
  optStr: string | null;
  u: u32;
  optU: Box<u32> | null;
  uArrayArray: Array<Array<Box<u32> | null> | null>;
  object: Types.TestImport_Object;
  optObject: Types.TestImport_Object | null;
  objectArray: Array<Types.TestImport_Object>;
  optObjectArray: Array<Types.TestImport_Object | null> | null;
  en: Types.TestImport_Enum;
  optEnum: Box<Types.TestImport_Enum> | null;
  enumArray: Array<Types.TestImport_Enum>;
  optEnumArray: Array<Box<Types.TestImport_Enum> | null> | null;
}

export function deserializeimportedMethodArgs(argsBuf: ArrayBuffer): Args_importedMethod {
  const context: Context = new Context("Deserializing imported module-type: importedMethod Args");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;
  let _optStr: string | null = null;
  let _u: u32 = 0;
  let _uSet: bool = false;
  let _optU: Box<u32> | null = null;
  let _uArrayArray: Array<Array<Box<u32> | null> | null> = [];
  let _uArrayArraySet: bool = false;
  let _object: Types.TestImport_Object | null = null;
  let _objectSet: bool = false;
  let _optObject: Types.TestImport_Object | null = null;
  let _objectArray: Array<Types.TestImport_Object> = [];
  let _objectArraySet: bool = false;
  let _optObjectArray: Array<Types.TestImport_Object | null> | null = null;
  let _en: Types.TestImport_Enum = 0;
  let _enSet: bool = false;
  let _optEnum: Box<Types.TestImport_Enum> | null = null;
  let _enumArray: Array<Types.TestImport_Enum> = [];
  let _enumArraySet: bool = false;
  let _optEnumArray: Array<Box<Types.TestImport_Enum> | null> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string", "type found, reading property");
      _str = reader.readString();
      _strSet = true;
      reader.context().pop();
    }
    else if (field == "optStr") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optStr = reader.readOptionalString();
      reader.context().pop();
    }
    else if (field == "u") {
      reader.context().push(field, "u32", "type found, reading property");
      _u = reader.readUInt32();
      _uSet = true;
      reader.context().pop();
    }
    else if (field == "optU") {
      reader.context().push(field, "Box<u32> | null", "type found, reading property");
      _optU = reader.readOptionalUInt32();
      reader.context().pop();
    }
    else if (field == "uArrayArray") {
      reader.context().push(field, "Array<Array<Box<u32> | null> | null>", "type found, reading property");
      _uArrayArray = reader.readArray((reader: Read): Array<Box<u32> | null> | null => {
        return reader.readOptionalArray((reader: Read): Box<u32> | null => {
          return reader.readOptionalUInt32();
        });
      });
      _uArrayArraySet = true;
      reader.context().pop();
    }
    else if (field == "object") {
      reader.context().push(field, "Types.TestImport_Object", "type found, reading property");
      const object = Types.TestImport_Object.read(reader);
      _object = object;
      _objectSet = true;
      reader.context().pop();
    }
    else if (field == "optObject") {
      reader.context().push(field, "Types.TestImport_Object | null", "type found, reading property");
      let object: Types.TestImport_Object | null = null;
      if (!reader.isNextNil()) {
        object = Types.TestImport_Object.read(reader);
      }
      _optObject = object;
      reader.context().pop();
    }
    else if (field == "objectArray") {
      reader.context().push(field, "Array<Types.TestImport_Object>", "type found, reading property");
      _objectArray = reader.readArray((reader: Read): Types.TestImport_Object => {
        const object = Types.TestImport_Object.read(reader);
        return object;
      });
      _objectArraySet = true;
      reader.context().pop();
    }
    else if (field == "optObjectArray") {
      reader.context().push(field, "Array<Types.TestImport_Object | null> | null", "type found, reading property");
      _optObjectArray = reader.readOptionalArray((reader: Read): Types.TestImport_Object | null => {
        let object: Types.TestImport_Object | null = null;
        if (!reader.isNextNil()) {
          object = Types.TestImport_Object.read(reader);
        }
        return object;
      });
      reader.context().pop();
    }
    else if (field == "en") {
      reader.context().push(field, "Types.TestImport_Enum", "type found, reading property");
      let value: Types.TestImport_Enum;
      if (reader.isNextString()) {
        value = Types.getTestImport_EnumValue(reader.readString());
      } else {
        value = reader.readInt32();
        Types.sanitizeTestImport_EnumValue(value);
      }
      _en = value;
      _enSet = true;
      reader.context().pop();
    }
    else if (field == "optEnum") {
      reader.context().push(field, "Box<Types.TestImport_Enum> | null", "type found, reading property");
      let value: Box<Types.TestImport_Enum> | null;
      if (!reader.isNextNil()) {
        if (reader.isNextString()) {
          value = Box.from(
            Types.getTestImport_EnumValue(reader.readString())
          );
        } else {
          value = Box.from(
            reader.readInt32()
          );
          Types.sanitizeTestImport_EnumValue(value.unwrap());
        }
      } else {
        value = null;
      }
      _optEnum = value;
      reader.context().pop();
    }
    else if (field == "enumArray") {
      reader.context().push(field, "Array<Types.TestImport_Enum>", "type found, reading property");
      _enumArray = reader.readArray((reader: Read): Types.TestImport_Enum => {
        let value: Types.TestImport_Enum;
        if (reader.isNextString()) {
          value = Types.getTestImport_EnumValue(reader.readString());
        } else {
          value = reader.readInt32();
          Types.sanitizeTestImport_EnumValue(value);
        }
        return value;
      });
      _enumArraySet = true;
      reader.context().pop();
    }
    else if (field == "optEnumArray") {
      reader.context().push(field, "Array<Box<Types.TestImport_Enum> | null> | null", "type found, reading property");
      _optEnumArray = reader.readOptionalArray((reader: Read): Box<Types.TestImport_Enum> | null => {
        let value: Box<Types.TestImport_Enum> | null;
        if (!reader.isNextNil()) {
          if (reader.isNextString()) {
            value = Box.from(
              Types.getTestImport_EnumValue(reader.readString())
            );
          } else {
            value = Box.from(
              reader.readInt32()
            );
            Types.sanitizeTestImport_EnumValue(value.unwrap());
          }
        } else {
          value = null;
        }
        return value;
      });
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'str: String'"));
  }
  if (!_uSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'u: UInt'"));
  }
  if (!_uArrayArraySet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'uArrayArray: [[UInt]]'"));
  }
  if (!_object || !_objectSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'object: TestImport_Object'"));
  }
  if (!_objectArraySet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'objectArray: [TestImport_Object]'"));
  }
  if (!_enSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'en: TestImport_Enum'"));
  }
  if (!_enumArraySet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'enumArray: [TestImport_Enum]'"));
  }

  return {
    str: _str,
    optStr: _optStr,
    u: _u,
    optU: _optU,
    uArrayArray: _uArrayArray,
    object: _object,
    optObject: _optObject,
    objectArray: _objectArray,
    optObjectArray: _optObjectArray,
    en: _en,
    optEnum: _optEnum,
    enumArray: _enumArray,
    optEnumArray: _optEnumArray
  };
}

export function serializeimportedMethodArgs(args: Args_importedMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: importedMethod Args");
  const sizer = new WriteSizer(sizerContext);
  writeimportedMethodArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: importedMethod Args");
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
  writer.context().push("optU", "Box<u32> | null", "writing property");
  writer.writeString("optU");
  writer.writeOptionalUInt32(args.optU);
  writer.context().pop();
  writer.context().push("uArrayArray", "Array<Array<Box<u32> | null> | null>", "writing property");
  writer.writeString("uArrayArray");
  writer.writeArray(args.uArrayArray, (writer: Write, item: Array<Box<u32> | null> | null): void => {
    writer.writeOptionalArray(item, (writer: Write, item: Box<u32> | null): void => {
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
  writer.context().push("optEnum", "Box<Types.TestImport_Enum> | null", "writing property");
  writer.writeString("optEnum");
  writer.writeOptionalInt32(args.optEnum);
  writer.context().pop();
  writer.context().push("enumArray", "Array<Types.TestImport_Enum>", "writing property");
  writer.writeString("enumArray");
  writer.writeArray(args.enumArray, (writer: Write, item: Types.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.context().pop();
  writer.context().push("optEnumArray", "Array<Box<Types.TestImport_Enum> | null> | null", "writing property");
  writer.writeString("optEnumArray");
  writer.writeOptionalArray(args.optEnumArray, (writer: Write, item: Box<Types.TestImport_Enum> | null): void => {
    writer.writeOptionalInt32(item);
  });
  writer.context().pop();
}

export function serializeimportedMethodResult(result: Types.TestImport_Object | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: importedMethod Result");
  const sizer = new WriteSizer(sizerContext);
  writeimportedMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: importedMethod Result");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeimportedMethodResult(encoder, result);
  return buffer;
}

export function writeimportedMethodResult(writer: Write, result: Types.TestImport_Object | null): void {
  writer.context().push("importedMethod", "Types.TestImport_Object | null", "writing property");
  if (result) {
    Types.TestImport_Object.write(writer, result as Types.TestImport_Object);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializeimportedMethodResult(buffer: ArrayBuffer): Types.TestImport_Object | null {
  const context: Context = new Context("Deserializing imported module-type: importedMethod Result");
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

export function deserializeanotherMethodArgs(argsBuf: ArrayBuffer): Args_anotherMethod {
  const context: Context = new Context("Deserializing imported module-type: anotherMethod Args");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg: Array<string> = [];
  let _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _arg = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _argSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_argSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg: [String]'"));
  }

  return {
    arg: _arg
  };
}

export function serializeanotherMethodArgs(args: Args_anotherMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: anotherMethod Args");
  const sizer = new WriteSizer(sizerContext);
  writeanotherMethodArgs(sizer, args);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: anotherMethod Args");
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

export function serializeanotherMethodResult(result: i32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: anotherMethod Result");
  const sizer = new WriteSizer(sizerContext);
  writeanotherMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: anotherMethod Result");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeanotherMethodResult(encoder, result);
  return buffer;
}

export function writeanotherMethodResult(writer: Write, result: i32): void {
  writer.context().push("anotherMethod", "i32", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export function deserializeanotherMethodResult(buffer: ArrayBuffer): i32 {
  const context: Context = new Context("Deserializing imported module-type: anotherMethod Result");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("anotherMethod", "i32", "reading function output");
  const res: i32 = reader.readInt32();
  reader.context().pop();

  return res;
}
