import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write,
  Nullable,
  BigInt,
  Context
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
  const context: Context =  new Context("Deserializing query-type: queryMethod");
  const reader = new ReadDecoder(argsBuf, context);
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

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string", "type found, reading property");
      _str = reader.readString();
      _strSet = true;
      reader.context().pop();
    }
    else if (field == "optStr") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optStr = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "en") {
      reader.context().push(field, "Types.CustomEnum", "type found, reading property");
      let value: Types.CustomEnum;
      if (reader.isNextString()) {
        value = Types.getCustomEnumValue(reader.readString());
      } else {
        value = reader.readInt32();
        Types.sanitizeCustomEnumValue(value);
      }
      _en = value;
      _enSet = true;
      reader.context().pop();
    }
    else if (field == "optEnum") {
      reader.context().push(field, "Nullable<Types.CustomEnum>", "type found, reading property");
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
      reader.context().pop();
    }
    else if (field == "enumArray") {
      reader.context().push(field, "Array<Types.CustomEnum>", "type found, reading property");
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
      reader.context().pop();
    }
    else if (field == "optEnumArray") {
      reader.context().push(field, "Array<Nullable<Types.CustomEnum>> | null", "type found, reading property");
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
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'str: String'"));
  }
  if (!_enSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'en: CustomEnum'"));
  }
  if (!_enumArraySet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'enumArray: [CustomEnum]'"));
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
  const sizerContext: Context = new Context("Serializing (sizing) query-type: queryMethod");
  const sizer = new WriteSizer(sizerContext);
  writequeryMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: queryMethod");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writequeryMethodResult(encoder, result);
  return buffer;
}

export function writequeryMethodResult(writer: Write, result: i32): void {
  writer.context().push("queryMethod", "i32", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export class Input_objectMethod {
  object: Types.AnotherType;
  optObject: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Array<Types.AnotherType | null> | null;
}

export function deserializeobjectMethodArgs(argsBuf: ArrayBuffer): Input_objectMethod {
  const context: Context =  new Context("Deserializing query-type: objectMethod");
  const reader = new ReadDecoder(argsBuf, context);
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

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "object") {
      reader.context().push(field, "Types.AnotherType", "type found, reading property");
      const object = Types.AnotherType.read(reader);
      _object = object;
      _objectSet = true;
      reader.context().pop();
    }
    else if (field == "optObject") {
      reader.context().push(field, "Types.AnotherType | null", "type found, reading property");
      var object: Types.AnotherType | null = null;
      if (!reader.isNextNil()) {
        object = Types.AnotherType.read(reader);
      }
      _optObject = object;
      reader.context().pop();
    }
    else if (field == "objectArray") {
      reader.context().push(field, "Array<Types.AnotherType>", "type found, reading property");
      _objectArray = reader.readArray((reader: Read): Types.AnotherType => {
        const object = Types.AnotherType.read(reader);
        return object;
      });
      _objectArraySet = true;
      reader.context().pop();
    }
    else if (field == "optObjectArray") {
      reader.context().push(field, "Array<Types.AnotherType | null> | null", "type found, reading property");
      _optObjectArray = reader.readNullableArray((reader: Read): Types.AnotherType | null => {
        var object: Types.AnotherType | null = null;
        if (!reader.isNextNil()) {
          object = Types.AnotherType.read(reader);
        }
        return object;
      });
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_object || !_objectSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'object: AnotherType'"));
  }
  if (!_objectArraySet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'objectArray: [AnotherType]'"));
  }

  return {
    object: _object,
    optObject: _optObject,
    objectArray: _objectArray,
    optObjectArray: _optObjectArray
  };
}

export function serializeobjectMethodResult(result: Types.AnotherType | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: objectMethod");
  const sizer = new WriteSizer(sizerContext);
  writeobjectMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: objectMethod");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeobjectMethodResult(encoder, result);
  return buffer;
}

export function writeobjectMethodResult(writer: Write, result: Types.AnotherType | null): void {
  writer.context().push("objectMethod", "Types.AnotherType | null", "writing property");
  if (result) {
    Types.AnotherType.write(writer, result as Types.AnotherType);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
