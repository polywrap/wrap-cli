import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  Context
} from "@web3api/wasm-as";
import { CustomType } from "./";
import * as Types from "..";

export function serializeCustomType(type: CustomType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: CustomType");
  const sizer = new WriteSizer(sizerContext);
  writeCustomType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: CustomType");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeCustomType(encoder, type);
  return buffer;
}

export function writeCustomType(writer: Write, type: CustomType): void {
  writer.writeMapLength(35);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeNullableString(type.optStr);
  writer.context().pop();
  writer.context().push("u", "u32", "writing property");
  writer.writeString("u");
  writer.writeUInt32(type.u);
  writer.context().pop();
  writer.context().push("optU", "Nullable<u32>", "writing property");
  writer.writeString("optU");
  writer.writeNullableUInt32(type.optU);
  writer.context().pop();
  writer.context().push("u8", "u8", "writing property");
  writer.writeString("u8");
  writer.writeUInt8(type.u8);
  writer.context().pop();
  writer.context().push("u16", "u16", "writing property");
  writer.writeString("u16");
  writer.writeUInt16(type.u16);
  writer.context().pop();
  writer.context().push("u32", "u32", "writing property");
  writer.writeString("u32");
  writer.writeUInt32(type.u32);
  writer.context().pop();
  writer.context().push("u64", "u64", "writing property");
  writer.writeString("u64");
  writer.writeUInt64(type.u64);
  writer.context().pop();
  writer.context().push("i", "i32", "writing property");
  writer.writeString("i");
  writer.writeInt32(type.i);
  writer.context().pop();
  writer.context().push("i8", "i8", "writing property");
  writer.writeString("i8");
  writer.writeInt8(type.i8);
  writer.context().pop();
  writer.context().push("i16", "i16", "writing property");
  writer.writeString("i16");
  writer.writeInt16(type.i16);
  writer.context().pop();
  writer.context().push("i32", "i32", "writing property");
  writer.writeString("i32");
  writer.writeInt32(type.i32);
  writer.context().pop();
  writer.context().push("i64", "i64", "writing property");
  writer.writeString("i64");
  writer.writeInt64(type.i64);
  writer.context().pop();
  writer.context().push("bigint", "BigInt", "writing property");
  writer.writeString("bigint");
  writer.writeBigInt(type.bigint);
  writer.context().pop();
  writer.context().push("optBigint", "BigInt | null", "writing property");
  writer.writeString("optBigint");
  writer.writeNullableBigInt(type.optBigint);
  writer.context().pop();
  writer.context().push("bytes", "ArrayBuffer", "writing property");
  writer.writeString("bytes");
  writer.writeBytes(type.bytes);
  writer.context().pop();
  writer.context().push("optBytes", "ArrayBuffer | null", "writing property");
  writer.writeString("optBytes");
  writer.writeNullableBytes(type.optBytes);
  writer.context().pop();
  writer.context().push("boolean", "bool", "writing property");
  writer.writeString("boolean");
  writer.writeBool(type.boolean);
  writer.context().pop();
  writer.context().push("optBoolean", "Nullable<bool>", "writing property");
  writer.writeString("optBoolean");
  writer.writeNullableBool(type.optBoolean);
  writer.context().pop();
  writer.context().push("uArray", "Array<u32>", "writing property");
  writer.writeString("uArray");
  writer.writeArray(type.uArray, (writer: Write, item: u32): void => {
    writer.writeUInt32(item);
  });
  writer.context().pop();
  writer.context().push("uOptArray", "Array<u32> | null", "writing property");
  writer.writeString("uOptArray");
  writer.writeNullableArray(type.uOptArray, (writer: Write, item: u32): void => {
    writer.writeUInt32(item);
  });
  writer.context().pop();
  writer.context().push("optUOptArray", "Array<Nullable<u32>> | null", "writing property");
  writer.writeString("optUOptArray");
  writer.writeNullableArray(type.optUOptArray, (writer: Write, item: Nullable<u32>): void => {
    writer.writeNullableUInt32(item);
  });
  writer.context().pop();
  writer.context().push("optStrOptArray", "Array<string | null> | null", "writing property");
  writer.writeString("optStrOptArray");
  writer.writeNullableArray(type.optStrOptArray, (writer: Write, item: string | null): void => {
    writer.writeNullableString(item);
  });
  writer.context().pop();
  writer.context().push("uArrayArray", "Array<Array<u32>>", "writing property");
  writer.writeString("uArrayArray");
  writer.writeArray(type.uArrayArray, (writer: Write, item: Array<u32>): void => {
    writer.writeArray(item, (writer: Write, item: u32): void => {
      writer.writeUInt32(item);
    });
  });
  writer.context().pop();
  writer.context().push("uOptArrayOptArray", "Array<Array<Nullable<u64>> | null>", "writing property");
  writer.writeString("uOptArrayOptArray");
  writer.writeArray(type.uOptArrayOptArray, (writer: Write, item: Array<Nullable<u64>> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: Nullable<u64>): void => {
      writer.writeNullableUInt64(item);
    });
  });
  writer.context().pop();
  writer.context().push("uArrayOptArrayArray", "Array<Array<Array<u64>> | null>", "writing property");
  writer.writeString("uArrayOptArrayArray");
  writer.writeArray(type.uArrayOptArrayArray, (writer: Write, item: Array<Array<u64>> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: Array<u64>): void => {
      writer.writeArray(item, (writer: Write, item: u64): void => {
        writer.writeUInt64(item);
      });
    });
  });
  writer.context().pop();
  writer.context().push("crazyArray", "Array<Array<Array<Array<u64> | null>> | null> | null", "writing property");
  writer.writeString("crazyArray");
  writer.writeNullableArray(type.crazyArray, (writer: Write, item: Array<Array<Array<u64> | null>> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: Array<Array<u64> | null>): void => {
      writer.writeArray(item, (writer: Write, item: Array<u64> | null): void => {
        writer.writeNullableArray(item, (writer: Write, item: u64): void => {
          writer.writeUInt64(item);
        });
      });
    });
  });
  writer.context().pop();
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
  writer.writeNullableArray(type.optObjectArray, (writer: Write, item: Types.AnotherType | null): void => {
    if (item) {
      Types.AnotherType.write(writer, item as Types.AnotherType);
    } else {
      writer.writeNil();
    }
  });
  writer.context().pop();
  writer.context().push("en", "Types.CustomEnum", "writing property");
  writer.writeString("en");
  writer.writeInt32(type.en);
  writer.context().pop();
  writer.context().push("optEnum", "Nullable<Types.CustomEnum>", "writing property");
  writer.writeString("optEnum");
  writer.writeNullableInt32(type.optEnum);
  writer.context().pop();
  writer.context().push("enumArray", "Array<Types.CustomEnum>", "writing property");
  writer.writeString("enumArray");
  writer.writeArray(type.enumArray, (writer: Write, item: Types.CustomEnum): void => {
    writer.writeInt32(item);
  });
  writer.context().pop();
  writer.context().push("optEnumArray", "Array<Nullable<Types.CustomEnum>> | null", "writing property");
  writer.writeString("optEnumArray");
  writer.writeNullableArray(type.optEnumArray, (writer: Write, item: Nullable<Types.CustomEnum>): void => {
    writer.writeNullableInt32(item);
  });
  writer.context().pop();
}

export function deserializeCustomType(buffer: ArrayBuffer): CustomType {
  const context: Context = new Context("Deserializing object-type CustomType");
  const reader = new ReadDecoder(buffer, context);
  return readCustomType(reader);
}

export function readCustomType(reader: Read): CustomType {
  var numFields = reader.readMapLength();

  var _str: string = "";
  var _strSet: bool = false;
  var _optStr: string | null = null;
  var _u: u32 = 0;
  var _uSet: bool = false;
  var _optU: Nullable<u32> = new Nullable<u32>();
  var _u8: u8 = 0;
  var _u8Set: bool = false;
  var _u16: u16 = 0;
  var _u16Set: bool = false;
  var _u32: u32 = 0;
  var _u32Set: bool = false;
  var _u64: u64 = 0;
  var _u64Set: bool = false;
  var _i: i32 = 0;
  var _iSet: bool = false;
  var _i8: i8 = 0;
  var _i8Set: bool = false;
  var _i16: i16 = 0;
  var _i16Set: bool = false;
  var _i32: i32 = 0;
  var _i32Set: bool = false;
  var _i64: i64 = 0;
  var _i64Set: bool = false;
  var _bigint: BigInt = BigInt.fromUInt16(0);
  var _bigintSet: bool = false;
  var _optBigint: BigInt | null = null;
  var _bytes: ArrayBuffer = new ArrayBuffer(0);
  var _bytesSet: bool = false;
  var _optBytes: ArrayBuffer | null = null;
  var _boolean: bool = false;
  var _booleanSet: bool = false;
  var _optBoolean: Nullable<bool> = new Nullable<bool>();
  var _uArray: Array<u32> = [];
  var _uArraySet: bool = false;
  var _uOptArray: Array<u32> | null = null;
  var _optUOptArray: Array<Nullable<u32>> | null = null;
  var _optStrOptArray: Array<string | null> | null = null;
  var _uArrayArray: Array<Array<u32>> = [];
  var _uArrayArraySet: bool = false;
  var _uOptArrayOptArray: Array<Array<Nullable<u64>> | null> = [];
  var _uOptArrayOptArraySet: bool = false;
  var _uArrayOptArrayArray: Array<Array<Array<u64>> | null> = [];
  var _uArrayOptArrayArraySet: bool = false;
  var _crazyArray: Array<Array<Array<Array<u64> | null>> | null> | null = null;
  var _object: Types.AnotherType | null = null;
  var _objectSet: bool = false;
  var _optObject: Types.AnotherType | null = null;
  var _objectArray: Array<Types.AnotherType> = [];
  var _objectArraySet: bool = false;
  var _optObjectArray: Array<Types.AnotherType | null> | null = null;
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
    else if (field == "u") {
      reader.context().push(field, "u32", "type found, reading property");
      _u = reader.readUInt32();
      _uSet = true;
      reader.context().pop();
    }
    else if (field == "optU") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _optU = reader.readNullableUInt32();
      reader.context().pop();
    }
    else if (field == "u8") {
      reader.context().push(field, "u8", "type found, reading property");
      _u8 = reader.readUInt8();
      _u8Set = true;
      reader.context().pop();
    }
    else if (field == "u16") {
      reader.context().push(field, "u16", "type found, reading property");
      _u16 = reader.readUInt16();
      _u16Set = true;
      reader.context().pop();
    }
    else if (field == "u32") {
      reader.context().push(field, "u32", "type found, reading property");
      _u32 = reader.readUInt32();
      _u32Set = true;
      reader.context().pop();
    }
    else if (field == "u64") {
      reader.context().push(field, "u64", "type found, reading property");
      _u64 = reader.readUInt64();
      _u64Set = true;
      reader.context().pop();
    }
    else if (field == "i") {
      reader.context().push(field, "i32", "type found, reading property");
      _i = reader.readInt32();
      _iSet = true;
      reader.context().pop();
    }
    else if (field == "i8") {
      reader.context().push(field, "i8", "type found, reading property");
      _i8 = reader.readInt8();
      _i8Set = true;
      reader.context().pop();
    }
    else if (field == "i16") {
      reader.context().push(field, "i16", "type found, reading property");
      _i16 = reader.readInt16();
      _i16Set = true;
      reader.context().pop();
    }
    else if (field == "i32") {
      reader.context().push(field, "i32", "type found, reading property");
      _i32 = reader.readInt32();
      _i32Set = true;
      reader.context().pop();
    }
    else if (field == "i64") {
      reader.context().push(field, "i64", "type found, reading property");
      _i64 = reader.readInt64();
      _i64Set = true;
      reader.context().pop();
    }
    else if (field == "bigint") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _bigint = reader.readBigInt();
      _bigintSet = true;
      reader.context().pop();
    }
    else if (field == "optBigint") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _optBigint = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "bytes") {
      reader.context().push(field, "ArrayBuffer", "type found, reading property");
      _bytes = reader.readBytes();
      _bytesSet = true;
      reader.context().pop();
    }
    else if (field == "optBytes") {
      reader.context().push(field, "ArrayBuffer | null", "type found, reading property");
      _optBytes = reader.readNullableBytes();
      reader.context().pop();
    }
    else if (field == "boolean") {
      reader.context().push(field, "bool", "type found, reading property");
      _boolean = reader.readBool();
      _booleanSet = true;
      reader.context().pop();
    }
    else if (field == "optBoolean") {
      reader.context().push(field, "Nullable<bool>", "type found, reading property");
      _optBoolean = reader.readNullableBool();
      reader.context().pop();
    }
    else if (field == "uArray") {
      reader.context().push(field, "Array<u32>", "type found, reading property");
      _uArray = reader.readArray((reader: Read): u32 => {
        return reader.readUInt32();
      });
      _uArraySet = true;
      reader.context().pop();
    }
    else if (field == "uOptArray") {
      reader.context().push(field, "Array<u32> | null", "type found, reading property");
      _uOptArray = reader.readNullableArray((reader: Read): u32 => {
        return reader.readUInt32();
      });
      reader.context().pop();
    }
    else if (field == "optUOptArray") {
      reader.context().push(field, "Array<Nullable<u32>> | null", "type found, reading property");
      _optUOptArray = reader.readNullableArray((reader: Read): Nullable<u32> => {
        return reader.readNullableUInt32();
      });
      reader.context().pop();
    }
    else if (field == "optStrOptArray") {
      reader.context().push(field, "Array<string | null> | null", "type found, reading property");
      _optStrOptArray = reader.readNullableArray((reader: Read): string | null => {
        return reader.readNullableString();
      });
      reader.context().pop();
    }
    else if (field == "uArrayArray") {
      reader.context().push(field, "Array<Array<u32>>", "type found, reading property");
      _uArrayArray = reader.readArray((reader: Read): Array<u32> => {
        return reader.readArray((reader: Read): u32 => {
          return reader.readUInt32();
        });
      });
      _uArrayArraySet = true;
      reader.context().pop();
    }
    else if (field == "uOptArrayOptArray") {
      reader.context().push(field, "Array<Array<Nullable<u64>> | null>", "type found, reading property");
      _uOptArrayOptArray = reader.readArray((reader: Read): Array<Nullable<u64>> | null => {
        return reader.readNullableArray((reader: Read): Nullable<u64> => {
          return reader.readNullableUInt64();
        });
      });
      _uOptArrayOptArraySet = true;
      reader.context().pop();
    }
    else if (field == "uArrayOptArrayArray") {
      reader.context().push(field, "Array<Array<Array<u64>> | null>", "type found, reading property");
      _uArrayOptArrayArray = reader.readArray((reader: Read): Array<Array<u64>> | null => {
        return reader.readNullableArray((reader: Read): Array<u64> => {
          return reader.readArray((reader: Read): u64 => {
            return reader.readUInt64();
          });
        });
      });
      _uArrayOptArrayArraySet = true;
      reader.context().pop();
    }
    else if (field == "crazyArray") {
      reader.context().push(field, "Array<Array<Array<Array<u64> | null>> | null> | null", "type found, reading property");
      _crazyArray = reader.readNullableArray((reader: Read): Array<Array<Array<u64> | null>> | null => {
        return reader.readNullableArray((reader: Read): Array<Array<u64> | null> => {
          return reader.readArray((reader: Read): Array<u64> | null => {
            return reader.readNullableArray((reader: Read): u64 => {
              return reader.readUInt64();
            });
          });
        });
      });
      reader.context().pop();
    }
    else if (field == "object") {
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
    throw new Error(reader.context().printWithContext("Missing required property: 'str: String'"));
  }
  if (!_uSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'u: UInt'"));
  }
  if (!_u8Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'u8: UInt8'"));
  }
  if (!_u16Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'u16: UInt16'"));
  }
  if (!_u32Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'u32: UInt32'"));
  }
  if (!_u64Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'u64: UInt64'"));
  }
  if (!_iSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'i: Int'"));
  }
  if (!_i8Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'i8: Int8'"));
  }
  if (!_i16Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'i16: Int16'"));
  }
  if (!_i32Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'i32: Int32'"));
  }
  if (!_i64Set) {
    throw new Error(reader.context().printWithContext("Missing required property: 'i64: Int64'"));
  }
  if (!_bigintSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'bigint: BigInt'"));
  }
  if (!_bytesSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'bytes: Bytes'"));
  }
  if (!_booleanSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'boolean: Boolean'"));
  }
  if (!_uArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'uArray: [UInt]'"));
  }
  if (!_uArrayArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'uArrayArray: [[UInt]]'"));
  }
  if (!_uOptArrayOptArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'uOptArrayOptArray: [[UInt64]]'"));
  }
  if (!_uArrayOptArrayArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'uArrayOptArrayArray: [[[UInt64]]]'"));
  }
  if (!_object || !_objectSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'object: AnotherType'"));
  }
  if (!_objectArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'objectArray: [AnotherType]'"));
  }
  if (!_enSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'en: CustomEnum'"));
  }
  if (!_enumArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'enumArray: [CustomEnum]'"));
  }

  return {
    str: _str,
    optStr: _optStr,
    u: _u,
    optU: _optU,
    u8: _u8,
    u16: _u16,
    u32: _u32,
    u64: _u64,
    i: _i,
    i8: _i8,
    i16: _i16,
    i32: _i32,
    i64: _i64,
    bigint: _bigint,
    optBigint: _optBigint,
    bytes: _bytes,
    optBytes: _optBytes,
    boolean: _boolean,
    optBoolean: _optBoolean,
    uArray: _uArray,
    uOptArray: _uOptArray,
    optUOptArray: _optUOptArray,
    optStrOptArray: _optStrOptArray,
    uArrayArray: _uArrayArray,
    uOptArrayOptArray: _uOptArrayOptArray,
    uArrayOptArrayArray: _uArrayOptArrayArray,
    crazyArray: _crazyArray,
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
