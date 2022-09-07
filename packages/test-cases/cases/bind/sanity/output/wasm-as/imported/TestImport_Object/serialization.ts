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
import { TestImport_Object } from "./";
import * as Types from "../..";

export function serializeTestImport_Object(type: TestImport_Object): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: TestImport_Object");
  const sizer = new WriteSizer(sizerContext);
  writeTestImport_Object(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: TestImport_Object");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeTestImport_Object(encoder, type);
  return buffer;
}

export function writeTestImport_Object(writer: Write, type: TestImport_Object): void {
  writer.writeMapLength(8);
  writer.context().push("object", "Types.TestImport_AnotherObject", "writing property");
  writer.writeString("object");
  Types.TestImport_AnotherObject.write(writer, type.object);
  writer.context().pop();
  writer.context().push("optObject", "Types.TestImport_AnotherObject | null", "writing property");
  writer.writeString("optObject");
  if (type.optObject) {
    Types.TestImport_AnotherObject.write(writer, type.optObject as Types.TestImport_AnotherObject);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("objectArray", "Array<Types.TestImport_AnotherObject>", "writing property");
  writer.writeString("objectArray");
  writer.writeArray(type.objectArray, (writer: Write, item: Types.TestImport_AnotherObject): void => {
    Types.TestImport_AnotherObject.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("optObjectArray", "Array<Types.TestImport_AnotherObject | null> | null", "writing property");
  writer.writeString("optObjectArray");
  writer.writeOptionalArray(type.optObjectArray, (writer: Write, item: Types.TestImport_AnotherObject | null): void => {
    if (item) {
      Types.TestImport_AnotherObject.write(writer, item as Types.TestImport_AnotherObject);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
  writer.context().push("en", "Types.TestImport_Enum", "writing property");
  writer.writeString("en");
  writer.writeInt32(type.en);
  writer.context().pop();
  writer.context().push("optEnum", "Box<Types.TestImport_Enum> | null", "writing property");
  writer.writeString("optEnum");
  writer.writeOptionalInt32(type.optEnum);
  writer.context().pop();
  writer.context().push("enumArray", "Array<Types.TestImport_Enum>", "writing property");
  writer.writeString("enumArray");
  writer.writeArray(type.enumArray, (writer: Write, item: Types.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.context().pop();
  writer.context().push("optEnumArray", "Array<Box<Types.TestImport_Enum> | null> | null", "writing property");
  writer.writeString("optEnumArray");
  writer.writeOptionalArray(type.optEnumArray, (writer: Write, item: Box<Types.TestImport_Enum> | null): void => {
    writer.writeOptionalInt32(item);
  });
  writer.context().pop();
}

export function deserializeTestImport_Object(buffer: ArrayBuffer): TestImport_Object {
  const context: Context = new Context("Deserializing imported object-type TestImport_Object");
  const reader = new ReadDecoder(buffer, context);
  return readTestImport_Object(reader);
}

export function readTestImport_Object(reader: Read): TestImport_Object {
  let numFields = reader.readMapLength();

  let _object: Types.TestImport_AnotherObject | null = null;
  let _objectSet: bool = false;
  let _optObject: Types.TestImport_AnotherObject | null = null;
  let _objectArray: Array<Types.TestImport_AnotherObject> = [];
  let _objectArraySet: bool = false;
  let _optObjectArray: Array<Types.TestImport_AnotherObject | null> | null = null;
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
    if (field == "object") {
      reader.context().push(field, "Types.TestImport_AnotherObject", "type found, reading property");
      const object = Types.TestImport_AnotherObject.read(reader);
      _object = object;
      _objectSet = true;
      reader.context().pop();
    }
    else if (field == "optObject") {
      reader.context().push(field, "Types.TestImport_AnotherObject | null", "type found, reading property");
      let object: Types.TestImport_AnotherObject | null = null;
      if (!reader.isNextNil()) {
        object = Types.TestImport_AnotherObject.read(reader);
      }
      _optObject = object;
      reader.context().pop();
    }
    else if (field == "objectArray") {
      reader.context().push(field, "Array<Types.TestImport_AnotherObject>", "type found, reading property");
      _objectArray = reader.readArray((reader: Read): Types.TestImport_AnotherObject => {
        const object = Types.TestImport_AnotherObject.read(reader);
        return object;
      });
      _objectArraySet = true;
      reader.context().pop();
    }
    else if (field == "optObjectArray") {
      reader.context().push(field, "Array<Types.TestImport_AnotherObject | null> | null", "type found, reading property");
      _optObjectArray = reader.readOptionalArray((reader: Read): Types.TestImport_AnotherObject | null => {
        let object: Types.TestImport_AnotherObject | null = null;
        if (!reader.isNextNil()) {
          object = Types.TestImport_AnotherObject.read(reader);
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

  if (!_object || !_objectSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'object: TestImport_AnotherObject'"));
  }
  if (!_objectArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'objectArray: [TestImport_AnotherObject]'"));
  }
  if (!_enSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'en: TestImport_Enum'"));
  }
  if (!_enumArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'enumArray: [TestImport_Enum]'"));
  }

  return {
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
