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
import * as Types from "..";

export class Args_moduleMethod {
  str: string;
  optStr: string | null;
  en: Types.CustomEnum;
  optEnum: Box<Types.CustomEnum> | null;
  enumArray: Array<Types.CustomEnum>;
  optEnumArray: Array<Box<Types.CustomEnum> | null> | null;
  map: Map<string, i32>;
  mapOfArr: Map<string, Array<i32>>;
  mapOfMap: Map<string, Map<string, i32>>;
  mapOfObj: Map<string, Types.AnotherType>;
  mapOfArrOfObj: Map<string, Array<Types.AnotherType>>;
}

export function deserializemoduleMethodArgs(argsBuf: ArrayBuffer): Args_moduleMethod {
  const context: Context = new Context("Deserializing module-type: moduleMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;
  let _optStr: string | null = null;
  let _en: Types.CustomEnum = 0;
  let _enSet: bool = false;
  let _optEnum: Box<Types.CustomEnum> | null = null;
  let _enumArray: Array<Types.CustomEnum> = [];
  let _enumArraySet: bool = false;
  let _optEnumArray: Array<Box<Types.CustomEnum> | null> | null = null;
  let _map: Map<string, i32> = new Map<string, i32>();
  let _mapSet: bool = false;
  let _mapOfArr: Map<string, Array<i32>> = new Map<string, Array<i32>>();
  let _mapOfArrSet: bool = false;
  let _mapOfMap: Map<string, Map<string, i32>> = new Map<string, Map<string, i32>>();
  let _mapOfMapSet: bool = false;
  let _mapOfObj: Map<string, Types.AnotherType> = new Map<string, Types.AnotherType>();
  let _mapOfObjSet: bool = false;
  let _mapOfArrOfObj: Map<string, Array<Types.AnotherType>> = new Map<string, Array<Types.AnotherType>>();
  let _mapOfArrOfObjSet: bool = false;

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
      reader.context().push(field, "Box<Types.CustomEnum> | null", "type found, reading property");
      let value: Box<Types.CustomEnum> | null;
      if (!reader.isNextNil()) {
        if (reader.isNextString()) {
          value = Box.from(
            Types.getCustomEnumValue(reader.readString())
          );
        } else {
          value = Box.from(
            reader.readInt32()
          );
          Types.sanitizeCustomEnumValue(value.unwrap());
        }
      } else {
        value = null;
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
      reader.context().push(field, "Array<Box<Types.CustomEnum> | null> | null", "type found, reading property");
      _optEnumArray = reader.readOptionalArray((reader: Read): Box<Types.CustomEnum> | null => {
        let value: Box<Types.CustomEnum> | null;
        if (!reader.isNextNil()) {
          if (reader.isNextString()) {
            value = Box.from(
              Types.getCustomEnumValue(reader.readString())
            );
          } else {
            value = Box.from(
              reader.readInt32()
            );
            Types.sanitizeCustomEnumValue(value.unwrap());
          }
        } else {
          value = null;
        }
        return value;
      });
      reader.context().pop();
    }
    else if (field == "map") {
      reader.context().push(field, "Map<string, i32>", "type found, reading property");
      _map = reader.readExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): i32 => {
        return reader.readInt32();
      });
      _mapSet = true;
      reader.context().pop();
    }
    else if (field == "mapOfArr") {
      reader.context().push(field, "Map<string, Array<i32>>", "type found, reading property");
      _mapOfArr = reader.readExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): Array<i32> => {
        return reader.readArray((reader: Read): i32 => {
          return reader.readInt32();
        });
      });
      _mapOfArrSet = true;
      reader.context().pop();
    }
    else if (field == "mapOfMap") {
      reader.context().push(field, "Map<string, Map<string, i32>>", "type found, reading property");
      _mapOfMap = reader.readExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): Map<string, i32> => {
        return reader.readExtGenericMap((reader: Read): string => {
          return reader.readString();
        }, (reader: Read): i32 => {
          return reader.readInt32();
        });
      });
      _mapOfMapSet = true;
      reader.context().pop();
    }
    else if (field == "mapOfObj") {
      reader.context().push(field, "Map<string, Types.AnotherType>", "type found, reading property");
      _mapOfObj = reader.readExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): Types.AnotherType => {
        const object = Types.AnotherType.read(reader);
        return object;
      });
      _mapOfObjSet = true;
      reader.context().pop();
    }
    else if (field == "mapOfArrOfObj") {
      reader.context().push(field, "Map<string, Array<Types.AnotherType>>", "type found, reading property");
      _mapOfArrOfObj = reader.readExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): Array<Types.AnotherType> => {
        return reader.readArray((reader: Read): Types.AnotherType => {
          const object = Types.AnotherType.read(reader);
          return object;
        });
      });
      _mapOfArrOfObjSet = true;
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
  if (!_mapSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'map: Map<String, Int>'"));
  }
  if (!_mapOfArrSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'mapOfArr: Map<String, [Int]>'"));
  }
  if (!_mapOfMapSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'mapOfMap: Map<String, Map<String, Int>>'"));
  }
  if (!_mapOfObjSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'mapOfObj: Map<String, AnotherType>'"));
  }
  if (!_mapOfArrOfObjSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'mapOfArrOfObj: Map<String, [AnotherType]>'"));
  }

  return {
    str: _str,
    optStr: _optStr,
    en: _en,
    optEnum: _optEnum,
    enumArray: _enumArray,
    optEnumArray: _optEnumArray,
    map: _map,
    mapOfArr: _mapOfArr,
    mapOfMap: _mapOfMap,
    mapOfObj: _mapOfObj,
    mapOfArrOfObj: _mapOfArrOfObj
  };
}

export function serializemoduleMethodArgs(type: Args_moduleMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-method: Args_moduleMethod");
  const sizer = new WriteSizer(sizerContext);
  writemoduleMethodArgs(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-method: Args_moduleMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemoduleMethodArgs(encoder, type);
  return buffer;
}

export function writemoduleMethodArgs(writer: Write, type: Args_moduleMethod): void {
  writer.writeMapLength(11);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeOptionalString(type.optStr);
  writer.context().pop();
  writer.context().push("en", "Types.CustomEnum", "writing property");
  writer.writeString("en");
  writer.writeInt32(type.en);
  writer.context().pop();
  writer.context().push("optEnum", "Box<Types.CustomEnum> | null", "writing property");
  writer.writeString("optEnum");
  writer.writeOptionalInt32(type.optEnum);
  writer.context().pop();
  writer.context().push("map", "Map<string, i32>", "writing property");
  writer.writeString("map");
  writer.writeExtGenericMap(type.map, (writer: Write, key: string) => {
    writer.writeString(key);
  }, (writer: Write, value: i32): void => {
    writer.writeInt32(value);
  });
  writer.context().pop();
  writer.context().push("mapOfArr", "Map<string, Array<i32>>", "writing property");
  writer.writeString("mapOfArr");
  writer.writeExtGenericMap(type.mapOfArr, (writer: Write, key: string) => {
    writer.writeString(key);
  }, (writer: Write, value: Array<i32>): void => {
    writer.writeArray(value, (writer: Write, item: i32): void => {
      writer.writeInt32(item);
    });
  });
  writer.context().pop();
  writer.context().push("mapOfObj", "Map<string, Types.AnotherType>", "writing property");
  writer.writeString("mapOfObj");
  writer.writeExtGenericMap(type.mapOfObj, (writer: Write, key: string) => {
    writer.writeString(key);
  }, (writer: Write, value: Types.AnotherType): void => {
    Types.AnotherType.write(writer, value);
  });
  writer.context().pop();
  writer.context().push("mapOfArrOfObj", "Map<string, Array<Types.AnotherType>>", "writing property");
  writer.writeString("mapOfArrOfObj");
  writer.writeExtGenericMap(type.mapOfArrOfObj, (writer: Write, key: string) => {
    writer.writeString(key);
  }, (writer: Write, value: Array<Types.AnotherType>): void => {
    writer.writeArray(value, (writer: Write, item: Types.AnotherType): void => {
      Types.AnotherType.write(writer, item);
    });
  });
  writer.context().pop();
}

export function serializemoduleMethodResult(result: i32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: moduleMethod Result");
  const sizer = new WriteSizer(sizerContext);
  writemoduleMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: moduleMethod Result");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemoduleMethodResult(encoder, result);
  return buffer;
}

export function writemoduleMethodResult(writer: Write, result: i32): void {
  writer.context().push("moduleMethod", "i32", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export function deserializemoduleMethodResult(buffer: ArrayBuffer): i32 {
  const context: Context = new Context("Deserializing module-type: moduleMethod Result");
  const reader = new ReadDecoder(buffer, context);
  return reader.readInt32();
}

export class Args_objectMethod {
  object: Types.AnotherType;
  optObject: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Array<Types.AnotherType | null> | null;
}

export function deserializeobjectMethodArgs(argsBuf: ArrayBuffer): Args_objectMethod {
  const context: Context = new Context("Deserializing module-type: objectMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _object: Types.AnotherType | null = null;
  let _objectSet: bool = false;
  let _optObject: Types.AnotherType | null = null;
  let _objectArray: Array<Types.AnotherType> = [];
  let _objectArraySet: bool = false;
  let _optObjectArray: Array<Types.AnotherType | null> | null = null;

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
      let object: Types.AnotherType | null = null;
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
      _optObjectArray = reader.readOptionalArray((reader: Read): Types.AnotherType | null => {
        let object: Types.AnotherType | null = null;
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

export function serializeobjectMethodArgs(type: Args_objectMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-method: Args_objectMethod");
  const sizer = new WriteSizer(sizerContext);
  writeobjectMethodArgs(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-method: Args_objectMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeobjectMethodArgs(encoder, type);
  return buffer;
}

export function writeobjectMethodArgs(writer: Write, type: Args_objectMethod): void {
  writer.writeMapLength(4);
  writer.context().push("object", "Types.AnotherType", "writing property");
  writer.writeString("object");
  Types.AnotherType.write(writer, type.object);
  writer.context().pop();
  writer.context().push("optObject", "Types.AnotherType | null", "writing property");
  writer.writeString("optObject");
  if (type.optObject) {
    Types.AnotherType.write(writer, type.optObject as Types.AnotherType);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("objectArray", "Array<Types.AnotherType>", "writing property");
  writer.writeString("objectArray");
  writer.writeArray(type.objectArray, (writer: Write, item: Types.AnotherType): void => {
    Types.AnotherType.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("optObjectArray", "Array<Types.AnotherType | null> | null", "writing property");
  writer.writeString("optObjectArray");
  writer.writeOptionalArray(type.optObjectArray, (writer: Write, item: Types.AnotherType | null): void => {
    if (item) {
      Types.AnotherType.write(writer, item as Types.AnotherType);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
}

export function serializeobjectMethodResult(result: Types.AnotherType | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: objectMethod Result");
  const sizer = new WriteSizer(sizerContext);
  writeobjectMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: objectMethod Result");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
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

export function deserializeobjectMethodResult(buffer: ArrayBuffer): Types.AnotherType | null {
  const context: Context = new Context("Deserializing module-type: objectMethod Result");
  const reader = new ReadDecoder(buffer, context);
  if (reader.isNextNil()) {
    return null;
  } else {
    return Types.AnotherType.read(reader);
  }
}

export class Args_optionalEnvMethod {
  object: Types.AnotherType;
  optObject: Types.AnotherType | null;
  objectArray: Array<Types.AnotherType>;
  optObjectArray: Array<Types.AnotherType | null> | null;
}

export function deserializeoptionalEnvMethodArgs(argsBuf: ArrayBuffer): Args_optionalEnvMethod {
  const context: Context = new Context("Deserializing module-type: optionalEnvMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _object: Types.AnotherType | null = null;
  let _objectSet: bool = false;
  let _optObject: Types.AnotherType | null = null;
  let _objectArray: Array<Types.AnotherType> = [];
  let _objectArraySet: bool = false;
  let _optObjectArray: Array<Types.AnotherType | null> | null = null;

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
      let object: Types.AnotherType | null = null;
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
      _optObjectArray = reader.readOptionalArray((reader: Read): Types.AnotherType | null => {
        let object: Types.AnotherType | null = null;
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

export function serializeoptionalEnvMethodArgs(type: Args_optionalEnvMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-method: Args_optionalEnvMethod");
  const sizer = new WriteSizer(sizerContext);
  writeoptionalEnvMethodArgs(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-method: Args_optionalEnvMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeoptionalEnvMethodArgs(encoder, type);
  return buffer;
}

export function writeoptionalEnvMethodArgs(writer: Write, type: Args_optionalEnvMethod): void {
  writer.writeMapLength(4);
  writer.context().push("object", "Types.AnotherType", "writing property");
  writer.writeString("object");
  Types.AnotherType.write(writer, type.object);
  writer.context().pop();
  writer.context().push("optObject", "Types.AnotherType | null", "writing property");
  writer.writeString("optObject");
  if (type.optObject) {
    Types.AnotherType.write(writer, type.optObject as Types.AnotherType);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("objectArray", "Array<Types.AnotherType>", "writing property");
  writer.writeString("objectArray");
  writer.writeArray(type.objectArray, (writer: Write, item: Types.AnotherType): void => {
    Types.AnotherType.write(writer, item);
  });
  writer.context().pop();
  writer.context().push("optObjectArray", "Array<Types.AnotherType | null> | null", "writing property");
  writer.writeString("optObjectArray");
  writer.writeOptionalArray(type.optObjectArray, (writer: Write, item: Types.AnotherType | null): void => {
    if (item) {
      Types.AnotherType.write(writer, item as Types.AnotherType);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
}

export function serializeoptionalEnvMethodResult(result: Types.AnotherType | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: optionalEnvMethod Result");
  const sizer = new WriteSizer(sizerContext);
  writeoptionalEnvMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: optionalEnvMethod Result");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeoptionalEnvMethodResult(encoder, result);
  return buffer;
}

export function writeoptionalEnvMethodResult(writer: Write, result: Types.AnotherType | null): void {
  writer.context().push("optionalEnvMethod", "Types.AnotherType | null", "writing property");
  if (result) {
    Types.AnotherType.write(writer, result as Types.AnotherType);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializeoptionalEnvMethodResult(buffer: ArrayBuffer): Types.AnotherType | null {
  const context: Context = new Context("Deserializing module-type: optionalEnvMethod Result");
  const reader = new ReadDecoder(buffer, context);
  if (reader.isNextNil()) {
    return null;
  } else {
    return Types.AnotherType.read(reader);
  }
}

export class Args__if {
  _if: Types._else;
}

export function deserializeifArgs(argsBuf: ArrayBuffer): Args__if {
  const context: Context = new Context("Deserializing module-type: if");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _if: Types._else | null = null;
  let _ifSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "if") {
      reader.context().push(field, "Types._else", "type found, reading property");
      const object = Types._else.read(reader);
      _if = object;
      _ifSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_if || !_ifSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'if: else'"));
  }

  return {
    _if: _if
  };
}

export function serializeifArgs(type: Args__if) {
  const sizerContext: Context = new Context("Serializing (sizing) module-method: Args__if");
  const sizer = new WriteSizer(sizerContext);
  writeifArgs(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-method: Args__if");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeifArgs(encoder, type);
  return buffer;
}

export function writeifArgs(writer: Write, type: Args__if): void {
  writer.writeMapLength(1);
  writer.context().push("if", "Types._else", "writing property");
  Types._else.write(writer, type._if);
  writer.context().pop();
}

export function serializeifResult(result: Types._else): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: if");
  const sizer = new WriteSizer(sizerContext);
  writeifResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: if");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeifResult(encoder, result);
  return buffer;
}

export function writeifResult(writer: Write, result: Types._else): void {
  writer.context().push("if", "Types._else", "writing property");
  Types._else.write(writer, result);
  writer.context().pop();
}

export function deserializeifResult(buffer: ArrayBuffer): Types._else {
  const context: Context = new Context("Deserializing module-type: if Result");
  const reader = new ReadDecoder(buffer, context);
  return Types._else.read(reader);
}
