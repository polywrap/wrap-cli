import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write,
  Nullable
} from "@web3api/wasm-as";
import * as Enums from "../enums";
import * as Objects from "..";

export class Input_queryMethod {
  str: string;
  optStr: string | null;
  en: string;
  optEnum: string | null;
  enumArray: Array<string>;
  optEnumArray: Array<string | null> | null;
}

export function deserializequeryMethodArgs(argsBuf: ArrayBuffer): Input_queryMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _str: string = "";
  var _strSet: bool = false;
  var _optStr: string | null = null;
  var _en: string = "";
  var _enSet: bool = false;
  var _optEnum: string | null = null;
  var _enumArray: Array<string> = [];
  var _enumArraySet: bool = false;
  var _optEnumArray: Array<string | null> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "str") {
      _str = reader.readString();
      _strSet = true;
    }
    else if (field == "optStr") {
      _optStr = reader.readNullableString();
    }
    else if (field == "en") {
      const value = reader.readString();
      if (!(value in Enums.CustomEnum)) {
        throw new Error("invalid value");
      }
      _en = value;
      _enSet = true;
    }
    else if (field == "optEnum") {
      const value = reader.readNullableString();
      if (value && !(value in Enums.CustomEnum)) {
        throw new Error("invalid value");
      }
      _optEnum = value;
    }
    else if (field == "enumArray") {
      _enumArray = reader.readArray((reader: Read): string => {
        const value = reader.readString();
        if (!(value in Enums.CustomEnum)) {
          throw new Error("invalid value");
        }
        return value;
      });
      _enumArraySet = true;
    }
    else if (field == "optEnumArray") {
      _optEnumArray = reader.readNullableArray((reader: Read): string | null => {
        const value = reader.readNullableString();
        if (value && !(value in Enums.CustomEnum)) {
          throw new Error("invalid value");
        }
        return value;
      });
    }
  }

  if (!_strSet) {
    throw new Error("Missing required argument: 'str: String'");
  }
  if (!_enSet) {
    throw new Error("Missing required argument: 'en: CustomEnum'");
  }
  if (!_enumArraySet) {
    throw new Error("Missing required argument: 'enumArray: [CustomEnum]'");
  }

  return {
    str: _str,
    optStr: _optStr,
    en: _en,
    optEnum: _optEnum,
    enumArray: _enumArray,
    optEnumArray: _optEnumArray
  };
}

export function serializequeryMethodResult(result: i32): ArrayBuffer {
  const sizer = new WriteSizer();
  writequeryMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writequeryMethodResult(encoder, result);
  return buffer;
}

export function writequeryMethodResult(writer: Write, result: i32): void {
  writer.writeInt32(result);
}

export class Input_objectMethod {
  object: Objects.AnotherType;
  optObject: Objects.AnotherType | null;
  objectArray: Array<Objects.AnotherType>;
  optObjectArray: Array<Objects.AnotherType | null> | null;
}

export function deserializeobjectMethodArgs(argsBuf: ArrayBuffer): Input_objectMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _object: Objects.AnotherType | null = null;
  var _objectSet: bool = false;
  var _optObject: Objects.AnotherType | null = null;
  var _objectArray: Array<Objects.AnotherType> = [];
  var _objectArraySet: bool = false;
  var _optObjectArray: Array<Objects.AnotherType | null> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "object") {
      const object = Objects.AnotherType.read(reader);
      _object = object;
      _objectSet = true;
    }
    else if (field == "optObject") {
      var object: Objects.AnotherType | null = null;
      if (!reader.isNextNil()) {
        object = Objects.AnotherType.read(reader);
      }
      _optObject = object;
    }
    else if (field == "objectArray") {
      _objectArray = reader.readArray((reader: Read): Objects.AnotherType => {
        const object = Objects.AnotherType.read(reader);
        return object;
      });
      _objectArraySet = true;
    }
    else if (field == "optObjectArray") {
      _optObjectArray = reader.readNullableArray((reader: Read): Objects.AnotherType | null => {
        var object: Objects.AnotherType | null = null;
        if (!reader.isNextNil()) {
          object = Objects.AnotherType.read(reader);
        }
        return object;
      });
    }
  }

  if (!_object || !_objectSet) {
    throw new Error("Missing required argument: 'object: AnotherType'");
  }
  if (!_objectArraySet) {
    throw new Error("Missing required argument: 'objectArray: [AnotherType]'");
  }

  return {
    object: _object,
    optObject: _optObject,
    objectArray: _objectArray,
    optObjectArray: _optObjectArray
  };
}

export function serializeobjectMethodResult(result: Objects.AnotherType | null): ArrayBuffer {
  const sizer = new WriteSizer();
  writeobjectMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeobjectMethodResult(encoder, result);
  return buffer;
}

export function writeobjectMethodResult(writer: Write, result: Objects.AnotherType | null): void {
  if (result) {
    Objects.AnotherType.write(writer, result);
  } else {
    writer.writeNil();
  }
}
