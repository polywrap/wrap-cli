import {
  Read,
  ReadDecoder,
  Nullable
} from "@web3api/wasm-as";
import { CustomType } from "./";

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
