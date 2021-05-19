import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt
} from "@web3api/wasm-as";
import { CustomType } from "./";
import * as Types from "..";

export function serializeCustomType(type: CustomType): ArrayBuffer {
  const sizer = new WriteSizer();
  writeCustomType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeCustomType(encoder, type);
  return buffer;
}

export function writeCustomType(writer: Write, type: CustomType): void {
  writer.writeMapLength(35);
  writer.writeString("str");
  writer.writeString(type.str);
  writer.writeString("optStr");
  writer.writeNullableString(type.optStr);
  writer.writeString("u");
  writer.writeUInt32(type.u);
  writer.writeString("optU");
  writer.writeNullableUInt32(type.optU);
  writer.writeString("u8");
  writer.writeUInt8(type.u8);
  writer.writeString("u16");
  writer.writeUInt16(type.u16);
  writer.writeString("u32");
  writer.writeUInt32(type.u32);
  writer.writeString("u64");
  writer.writeUInt64(type.u64);
  writer.writeString("i");
  writer.writeInt32(type.i);
  writer.writeString("i8");
  writer.writeInt8(type.i8);
  writer.writeString("i16");
  writer.writeInt16(type.i16);
  writer.writeString("i32");
  writer.writeInt32(type.i32);
  writer.writeString("i64");
  writer.writeInt64(type.i64);
  writer.writeString("bigint");
  writer.writeBigInt(type.bigint);
  writer.writeString("optBigint");
  writer.writeNullableBigInt(type.optBigint);
  writer.writeString("bytes");
  writer.writeBytes(type.bytes);
  writer.writeString("optBytes");
  writer.writeNullableBytes(type.optBytes);
  writer.writeString("boolean");
  writer.writeBool(type.boolean);
  writer.writeString("optBoolean");
  writer.writeNullableBool(type.optBoolean);
  writer.writeString("uArray");
  writer.writeArray(type.uArray, (writer: Write, item: u32): void => {
    writer.writeUInt32(item);
  });
  writer.writeString("uOptArray");
  writer.writeNullableArray(type.uOptArray, (writer: Write, item: u32): void => {
    writer.writeUInt32(item);
  });
  writer.writeString("optUOptArray");
  writer.writeNullableArray(type.optUOptArray, (writer: Write, item: Nullable<u32>): void => {
    writer.writeNullableUInt32(item);
  });
  writer.writeString("optStrOptArray");
  writer.writeNullableArray(type.optStrOptArray, (writer: Write, item: string | null): void => {
    writer.writeNullableString(item);
  });
  writer.writeString("uArrayArray");
  writer.writeArray(type.uArrayArray, (writer: Write, item: Array<u32>): void => {
    writer.writeArray(item, (writer: Write, item: u32): void => {
      writer.writeUInt32(item);
    });
  });
  writer.writeString("uOptArrayOptArray");
  writer.writeArray(type.uOptArrayOptArray, (writer: Write, item: Array<Nullable<u64>> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: Nullable<u64>): void => {
      writer.writeNullableUInt64(item);
    });
  });
  writer.writeString("uArrayOptArrayArray");
  writer.writeArray(type.uArrayOptArrayArray, (writer: Write, item: Array<Array<u64>> | null): void => {
    writer.writeNullableArray(item, (writer: Write, item: Array<u64>): void => {
      writer.writeArray(item, (writer: Write, item: u64): void => {
        writer.writeUInt64(item);
      });
    });
  });
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
  writer.writeString("object");
  Types.AnotherType.write(writer, type.object);
  writer.writeString("optObject");
  if (type.optObject) {
    Types.AnotherType.write(writer, type.optObject as Types.AnotherType);
  } else {
    writer.writeNil();
  }
  writer.writeString("objectArray");
  writer.writeArray(type.objectArray, (writer: Write, item: Types.AnotherType): void => {
    Types.AnotherType.write(writer, item);
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(type.optObjectArray, (writer: Write, item: Types.AnotherType | null): void => {
    if (item) {
      Types.AnotherType.write(writer, item as Types.AnotherType);
    } else {
      writer.writeNil();
    }
  });
  writer.writeString("en");
  writer.writeInt32(type.en);
  writer.writeString("optEnum");
  writer.writeNullableInt32(type.optEnum);
  writer.writeString("enumArray");
  writer.writeArray(type.enumArray, (writer: Write, item: Types.CustomEnum): void => {
    writer.writeInt32(item);
  });
  writer.writeString("optEnumArray");
  writer.writeNullableArray(type.optEnumArray, (writer: Write, item: Nullable<Types.CustomEnum>): void => {
    writer.writeNullableInt32(item);
  });
}

export function deserializeCustomType(buffer: ArrayBuffer): CustomType {
  const reader = new ReadDecoder(buffer);
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

    if (field == "str") {
      _str = reader.readString();
      _strSet = true;
    }
    else if (field == "optStr") {
      _optStr = reader.readNullableString();
    }
    else if (field == "u") {
      _u = reader.readUInt32();
      _uSet = true;
    }
    else if (field == "optU") {
      _optU = reader.readNullableUInt32();
    }
    else if (field == "u8") {
      _u8 = reader.readUInt8();
      _u8Set = true;
    }
    else if (field == "u16") {
      _u16 = reader.readUInt16();
      _u16Set = true;
    }
    else if (field == "u32") {
      _u32 = reader.readUInt32();
      _u32Set = true;
    }
    else if (field == "u64") {
      _u64 = reader.readUInt64();
      _u64Set = true;
    }
    else if (field == "i") {
      _i = reader.readInt32();
      _iSet = true;
    }
    else if (field == "i8") {
      _i8 = reader.readInt8();
      _i8Set = true;
    }
    else if (field == "i16") {
      _i16 = reader.readInt16();
      _i16Set = true;
    }
    else if (field == "i32") {
      _i32 = reader.readInt32();
      _i32Set = true;
    }
    else if (field == "i64") {
      _i64 = reader.readInt64();
      _i64Set = true;
    }
    else if (field == "bigint") {
      _bigint = reader.readBigInt();
      _bigintSet = true;
    }
    else if (field == "optBigint") {
      _optBigint = reader.readNullableBigInt();
    }
    else if (field == "bytes") {
      _bytes = reader.readBytes();
      _bytesSet = true;
    }
    else if (field == "optBytes") {
      _optBytes = reader.readNullableBytes();
    }
    else if (field == "boolean") {
      _boolean = reader.readBool();
      _booleanSet = true;
    }
    else if (field == "optBoolean") {
      _optBoolean = reader.readNullableBool();
    }
    else if (field == "uArray") {
      _uArray = reader.readArray((reader: Read): u32 => {
        return reader.readUInt32();
      });
      _uArraySet = true;
    }
    else if (field == "uOptArray") {
      _uOptArray = reader.readNullableArray((reader: Read): u32 => {
        return reader.readUInt32();
      });
    }
    else if (field == "optUOptArray") {
      _optUOptArray = reader.readNullableArray((reader: Read): Nullable<u32> => {
        return reader.readNullableUInt32();
      });
    }
    else if (field == "optStrOptArray") {
      _optStrOptArray = reader.readNullableArray((reader: Read): string | null => {
        return reader.readNullableString();
      });
    }
    else if (field == "uArrayArray") {
      _uArrayArray = reader.readArray((reader: Read): Array<u32> => {
        return reader.readArray((reader: Read): u32 => {
          return reader.readUInt32();
        });
      });
      _uArrayArraySet = true;
    }
    else if (field == "uOptArrayOptArray") {
      _uOptArrayOptArray = reader.readArray((reader: Read): Array<Nullable<u64>> | null => {
        return reader.readNullableArray((reader: Read): Nullable<u64> => {
          return reader.readNullableUInt64();
        });
      });
      _uOptArrayOptArraySet = true;
    }
    else if (field == "uArrayOptArrayArray") {
      _uArrayOptArrayArray = reader.readArray((reader: Read): Array<Array<u64>> | null => {
        return reader.readNullableArray((reader: Read): Array<u64> => {
          return reader.readArray((reader: Read): u64 => {
            return reader.readUInt64();
          });
        });
      });
      _uArrayOptArrayArraySet = true;
    }
    else if (field == "crazyArray") {
      _crazyArray = reader.readNullableArray((reader: Read): Array<Array<Array<u64> | null>> | null => {
        return reader.readNullableArray((reader: Read): Array<Array<u64> | null> => {
          return reader.readArray((reader: Read): Array<u64> | null => {
            return reader.readNullableArray((reader: Read): u64 => {
              return reader.readUInt64();
            });
          });
        });
      });
    }
    else if (field == "object") {
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
    throw new Error("Missing required property: 'str: String'");
  }
  if (!_uSet) {
    throw new Error("Missing required property: 'u: UInt'");
  }
  if (!_u8Set) {
    throw new Error("Missing required property: 'u8: UInt8'");
  }
  if (!_u16Set) {
    throw new Error("Missing required property: 'u16: UInt16'");
  }
  if (!_u32Set) {
    throw new Error("Missing required property: 'u32: UInt32'");
  }
  if (!_u64Set) {
    throw new Error("Missing required property: 'u64: UInt64'");
  }
  if (!_iSet) {
    throw new Error("Missing required property: 'i: Int'");
  }
  if (!_i8Set) {
    throw new Error("Missing required property: 'i8: Int8'");
  }
  if (!_i16Set) {
    throw new Error("Missing required property: 'i16: Int16'");
  }
  if (!_i32Set) {
    throw new Error("Missing required property: 'i32: Int32'");
  }
  if (!_i64Set) {
    throw new Error("Missing required property: 'i64: Int64'");
  }
  if (!_bigintSet) {
    throw new Error("Missing required property: 'bigint: BigInt'");
  }
  if (!_bytesSet) {
    throw new Error("Missing required property: 'bytes: Bytes'");
  }
  if (!_booleanSet) {
    throw new Error("Missing required property: 'boolean: Boolean'");
  }
  if (!_uArraySet) {
    throw new Error("Missing required property: 'uArray: [UInt]'");
  }
  if (!_uArrayArraySet) {
    throw new Error("Missing required property: 'uArrayArray: [[UInt]]'");
  }
  if (!_uOptArrayOptArraySet) {
    throw new Error("Missing required property: 'uOptArrayOptArray: [[UInt64]]'");
  }
  if (!_uArrayOptArrayArraySet) {
    throw new Error("Missing required property: 'uArrayOptArrayArray: [[[UInt64]]]'");
  }
  if (!_object || !_objectSet) {
    throw new Error("Missing required property: 'object: AnotherType'");
  }
  if (!_objectArraySet) {
    throw new Error("Missing required property: 'objectArray: [AnotherType]'");
  }
  if (!_enSet) {
    throw new Error("Missing required property: 'en: CustomEnum'");
  }
  if (!_enumArraySet) {
    throw new Error("Missing required property: 'enumArray: [CustomEnum]'");
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
