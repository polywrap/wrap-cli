import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write,
  Nullable,
  BigInt
} from "@web3api/wasm-as";
import * as Types from "..";

export class Input_queryMethod {
  str: string;
  optStr: string | null;
  en: Types.CustomEnum;
  optEnum: Nullable<Types.CustomEnum>;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray: Array<Nullable<Types.CustomEnum>> | null;
}

export function deserializequeryMethodArgs(argsBuf: ArrayBuffer): Input_queryMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _str: string = "";
  var _strSet: bool = false;
  var _optStr: string | null = null;
  var _en: Types.CustomEnum = 0;
  var _enSet: bool = false;
  var _optEnum: Nullable<Types.CustomEnum> = new Nullable<Types.CustomEnum>();
  var _enumArray: Array<Types.CustomEnum> = [];
  var _enumArraySet: bool = false;
  var _optEnumArray: Array<Nullable<Types.CustomEnum>> | null = null;

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
      let value: Types.CustomEnum;
      if (reader.isNextString()) {
        value = Types.getCustomEnumValue(reader.readString());
      } else {
        value = reader.readInt32();
        Types.sanitizeCustomEnumValue(value);
      }
      _en = value;
      _enSet = true;
    }
    else if (field == "optEnum") {
      let value: Nullable<Types.CustomEnum>;
      if (!reader.isNextNil()) {
        if (reader.isNextString()) {
          value = Nullable.fromValue(
            Types.getCustomEnumValue(reader.readString())
          );
        } else {
          value = Nullable.fromValue(
            reader.readInt32()
          );
          Types.sanitizeCustomEnumValue(value.value);
        }
      } else {
        value = Nullable.fromNull<Types.CustomEnum>();
      }
      _optEnum = value;
    }
    else if (field == "enumArray") {
      _enumArray = reader.readArray((reader: Read): Types.CustomEnum => {
        let value: Types.CustomEnum;
        if (reader.isNextString()) {
          value = Types.getCustomEnumValue(reader.readString());
        } else {
          value = reader.readInt32();
          Types.sanitizeCustomEnumValue(value);
        }
        return value;
      });
      _enumArraySet = true;
    }
    else if (field == "optEnumArray") {
      _optEnumArray = reader.readNullableArray((reader: Read): Nullable<Types.CustomEnum> => {
        let value: Nullable<Types.CustomEnum>;
        if (!reader.isNextNil()) {
          if (reader.isNextString()) {
            value = Nullable.fromValue(
              Types.getCustomEnumValue(reader.readString())
            );
          } else {
            value = Nullable.fromValue(
              reader.readInt32()
            );
            Types.sanitizeCustomEnumValue(value.value);
          }
        } else {
          value = Nullable.fromNull<Types.CustomEnum>();
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
  object: Types.AnotherType;
  optObject: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Array<Types.AnotherType | null> | null;
}

export function deserializeobjectMethodArgs(argsBuf: ArrayBuffer): Input_objectMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _object: Types.AnotherType | null = null;
  var _objectSet: bool = false;
  var _optObject: Types.AnotherType | null = null;
  var _objectArray: Array<Types.AnotherType> = [];
  var _objectArraySet: bool = false;
  var _optObjectArray: Array<Types.AnotherType | null> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "object") {
      const object = Types.AnotherType.read(reader);
      _object = object;
      _objectSet = true;
    }
    else if (field == "optObject") {
      var object: Types.AnotherType | null = null;
      if (!reader.isNextNil()) {
        object = Types.AnotherType.read(reader);
      }
      _optObject = object;
    }
    else if (field == "objectArray") {
      _objectArray = reader.readArray((reader: Read): Types.AnotherType => {
        const object = Types.AnotherType.read(reader);
        return object;
      });
      _objectArraySet = true;
    }
    else if (field == "optObjectArray") {
      _optObjectArray = reader.readNullableArray((reader: Read): Types.AnotherType | null => {
        var object: Types.AnotherType | null = null;
        if (!reader.isNextNil()) {
          object = Types.AnotherType.read(reader);
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

export function serializeobjectMethodResult(result: Types.AnotherType | null): ArrayBuffer {
  const sizer = new WriteSizer();
  writeobjectMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeobjectMethodResult(encoder, result);
  return buffer;
}

export function writeobjectMethodResult(writer: Write, result: Types.AnotherType | null): void {
  if (result) {
    Types.AnotherType.write(writer, result as Types.AnotherType);
  } else {
    writer.writeNil();
  }
}
