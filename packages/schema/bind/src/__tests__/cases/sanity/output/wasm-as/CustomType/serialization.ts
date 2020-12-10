import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable
} from "@web3api/wasm-as";
import { CustomType } from "./";

export function serializeCustomType(type: CustomType): ArrayBuffer {
  const sizer = new WriteSizer();
  writeCustomType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeCustomType(encoder, type);
  return buffer;
}

function writeCustomType(writer: Write, type: CustomType) {
  writer.writeMapLength(21);
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
}

export function deserializeCustomType(buffer: ArrayBuffer, type: CustomType) {
  const reader = new ReadDecoder(buffer);
  var numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "str") {
      type.str = reader.readString();
    }
    else if (field == "optStr") {
      type.optStr = reader.readNullableString();
    }
    else if (field == "u") {
      type.u = reader.readUInt32();
    }
    else if (field == "optU") {
      type.optU = reader.readNullableUInt32();
    }
    else if (field == "u8") {
      type.u8 = reader.readUInt8();
    }
    else if (field == "u16") {
      type.u16 = reader.readUInt16();
    }
    else if (field == "u32") {
      type.u32 = reader.readUInt32();
    }
    else if (field == "u64") {
      type.u64 = reader.readUInt64();
    }
    else if (field == "i") {
      type.i = reader.readInt32();
    }
    else if (field == "i8") {
      type.i8 = reader.readInt8();
    }
    else if (field == "i16") {
      type.i16 = reader.readInt16();
    }
    else if (field == "i32") {
      type.i32 = reader.readInt32();
    }
    else if (field == "i64") {
      type.i64 = reader.readInt64();
    }
    else if (field == "uArray") {
      type.uArray = reader.readArray((reader: Read): u32 => {
        return reader.readUInt32();
      });
    }
    else if (field == "uOptArray") {
      type.uOptArray = reader.readNullableArray((reader: Read): u32 => {
        return reader.readUInt32();
      });
    }
    else if (field == "optUOptArray") {
      type.optUOptArray = reader.readNullableArray((reader: Read): Nullable<u32> => {
        return reader.readNullableUInt32();
      });
    }
    else if (field == "optStrOptArray") {
      type.optStrOptArray = reader.readNullableArray((reader: Read): string | null => {
        return reader.readNullableString();
      });
    }
    else if (field == "uArrayArray") {
      type.uArrayArray = reader.readArray((reader: Read): Array<u32> => {
        return reader.readArray((reader: Read): u32 => {
          return reader.readUInt32();
        });
      });
    }
    else if (field == "uOptArrayOptArray") {
      type.uOptArrayOptArray = reader.readArray((reader: Read): Array<Nullable<u64>> | null => {
        return reader.readNullableArray((reader: Read): Nullable<u64> => {
          return reader.readNullableUInt64();
        });
      });
    }
    else if (field == "uArrayOptArrayArray") {
      type.uArrayOptArrayArray = reader.readArray((reader: Read): Array<Array<u64>> | null => {
        return reader.readNullableArray((reader: Read): Array<u64> => {
          return reader.readArray((reader: Read): u64 => {
            return reader.readUInt64();
          });
        });
      });
    }
    else if (field == "crazyArray") {
      type.crazyArray = reader.readNullableArray((reader: Read): Array<Array<Array<u64> | null>> | null => {
        return reader.readNullableArray((reader: Read): Array<Array<u64> | null> => {
          return reader.readArray((reader: Read): Array<u64> | null => {
            return reader.readNullableArray((reader: Read): u64 => {
              return reader.readUInt64();
            });
          });
        });
      });
    }
  }
}
