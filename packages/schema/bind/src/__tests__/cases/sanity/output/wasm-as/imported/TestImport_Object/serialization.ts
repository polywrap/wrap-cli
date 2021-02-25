import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable
} from "@web3api/wasm-as";
import { TestImport_Object } from "./";
import * as Enums from "../../enums";
import * as Objects from "../..";

export function serializeTestImport_Object(type: TestImport_Object): ArrayBuffer {
  const sizer = new WriteSizer();
  writeTestImport_Object(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeTestImport_Object(encoder, type);
  return buffer;
}

export function writeTestImport_Object(writer: Write, type: TestImport_Object): void {
  writer.writeMapLength(8);
  writer.writeString("object");
  Objects.TestImport_AnotherObject.write(writer, type.object);
  writer.writeString("optObject");
  if (type.optObject) {
    Objects.TestImport_AnotherObject.write(writer, type.optObject);
  } else {
    writer.writeNil();
  }
  writer.writeString("objectArray");
  writer.writeArray(type.objectArray, (writer: Write, item: Objects.TestImport_AnotherObject): void => {
    Objects.TestImport_AnotherObject.write(writer, item);
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(type.optObjectArray, (writer: Write, item: Objects.TestImport_AnotherObject | null): void => {
    if (item) {
      Objects.TestImport_AnotherObject.write(writer, item);
    } else {
      writer.writeNil();
    }
  });
  writer.writeString("en");
  writer.writeInt32(type.en);
  writer.writeString("optEnum");
  writer.writeNullableInt32(type.optEnum);
  writer.writeString("enumArray");
  writer.writeArray(type.enumArray, (writer: Write, item: Enums.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.writeString("optEnumArray");
  writer.writeNullableArray(type.optEnumArray, (writer: Write, item: Nullable<Enums.TestImport_Enum>): void => {
    writer.writeNullableInt32(item);
  });
}

export function deserializeTestImport_Object(buffer: ArrayBuffer): TestImport_Object {
  const reader = new ReadDecoder(buffer);
  return readTestImport_Object(reader);
}

export function readTestImport_Object(reader: Read): TestImport_Object {
  var numFields = reader.readMapLength();

  var _object: Objects.TestImport_AnotherObject | null = null;
  var _objectSet: bool = false;
  var _optObject: Objects.TestImport_AnotherObject | null = null;
  var _objectArray: Array<Objects.TestImport_AnotherObject> = [];
  var _objectArraySet: bool = false;
  var _optObjectArray: Array<Objects.TestImport_AnotherObject | null> | null = null;
  var _en: Enums.TestImport_Enum = 0;
  var _enSet: bool = false;
  var _optEnum: Nullable<Enums.TestImport_Enum> = new Nullable<Enums.TestImport_Enum>();
  var _enumArray: Array<Enums.TestImport_Enum> = [];
  var _enumArraySet: bool = false;
  var _optEnumArray: Array<Nullable<Enums.TestImport_Enum>> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "object") {
      const object = Objects.TestImport_AnotherObject.read(reader);
      _object = object;
      _objectSet = true;
    }
    else if (field == "optObject") {
      var object: Objects.TestImport_AnotherObject | null = null;
      if (!reader.isNextNil()) {
        object = Objects.TestImport_AnotherObject.read(reader);
      }
      _optObject = object;
    }
    else if (field == "objectArray") {
      _objectArray = reader.readArray((reader: Read): Objects.TestImport_AnotherObject => {
        const object = Objects.TestImport_AnotherObject.read(reader);
        return object;
      });
      _objectArraySet = true;
    }
    else if (field == "optObjectArray") {
      _optObjectArray = reader.readNullableArray((reader: Read): Objects.TestImport_AnotherObject | null => {
        var object: Objects.TestImport_AnotherObject | null = null;
        if (!reader.isNextNil()) {
          object = Objects.TestImport_AnotherObject.read(reader);
        }
        return object;
      });
    }
    else if (field == "en") {
      let value: Enums.TestImport_Enum;
      if (reader.isNextEnumValue()) {
        value = Enums.matchTestImport_EnumByValue(reader.readInt32());
      } else {
        value = Enums.matchTestImport_EnumByKey(reader.readString());
      }
      _en = value;
      _enSet = true;
    }
    else if (field == "optEnum") {
      let value: Nullable<Enums.TestImport_Enum>;
      if (!reader.isNextNil()) {
        if (reader.isNextEnumValue()) {
          value = Nullable.fromValue(Enums.matchTestImport_EnumByValue(reader.readInt32()));
        } else {
          value = Nullable.fromValue(Enums.matchTestImport_EnumByKey(reader.readString()));
        }
      } else {
        value = Nullable.fromNull<Enums.TestImport_Enum>();
      }
      _optEnum = value;
    }
    else if (field == "enumArray") {
      _enumArray = reader.readArray((reader: Read): Enums.TestImport_Enum => {
        let value: Enums.TestImport_Enum;
        if (reader.isNextEnumValue()) {
          value = Enums.matchTestImport_EnumByValue(reader.readInt32());
        } else {
          value = Enums.matchTestImport_EnumByKey(reader.readString());
        }
        return value;
      });
      _enumArraySet = true;
    }
    else if (field == "optEnumArray") {
      _optEnumArray = reader.readNullableArray((reader: Read): Nullable<Enums.TestImport_Enum> => {
        let value: Nullable<Enums.TestImport_Enum>;
        if (!reader.isNextNil()) {
          if (reader.isNextEnumValue()) {
            value = Nullable.fromValue(Enums.matchTestImport_EnumByValue(reader.readInt32()));
          } else {
            value = Nullable.fromValue(Enums.matchTestImport_EnumByKey(reader.readString()));
          }
        } else {
          value = Nullable.fromNull<Enums.TestImport_Enum>();
        }
        return value;
      });
    }
  }

  if (!_object || !_objectSet) {
    throw new Error("Missing required property: 'object: TestImport_AnotherObject'");
  }
  if (!_objectArraySet) {
    throw new Error("Missing required property: 'objectArray: [TestImport_AnotherObject]'");
  }
  if (!_enSet) {
    throw new Error("Missing required property: 'en: TestImport_Enum'");
  }
  if (!_enumArraySet) {
    throw new Error("Missing required property: 'enumArray: [TestImport_Enum]'");
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
