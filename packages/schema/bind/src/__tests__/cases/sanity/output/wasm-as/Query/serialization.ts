import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write,
  Nullable
} from "@web3api/wasm-as";
import * as Enums from "../enums";

export class Input_queryMethod {
  str: string;
  optStr: string | null;
  en: Enums.CustomEnum;
  optEnum: Nullable<Enums.CustomEnum>;
  enumArray: Array<Enums.CustomEnum>;
  optEnumArray: Array<Nullable<Enums.CustomEnum>> | null;
}

export function deserializequeryMethodArgs(argsBuf: ArrayBuffer): Input_queryMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _str: string = "";
  var _strSet: boolean = false;
  var _optStr: string | null = null;
  var _en: Enums.CustomEnum = 0;
  var _enSet: boolean = false;
  var _optEnum: Nullable<Enums.CustomEnum> = new Nullable<Enums.CustomEnum>();
  var _enumArray: Array<Enums.CustomEnum> = [];
  var _enumArraySet: boolean = false;
  var _optEnumArray: Array<Nullable<Enums.CustomEnum>> | null = null;

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
      _en = reader.readInt32();
      _enSet = true;
    }
    else if (field == "optEnum") {
      _optEnum = reader.readNullableInt32();
    }
    else if (field == "enumArray") {
      _enumArray = reader.readArray((reader: Read): Enums.CustomEnum => {
        return reader.readInt32();
      });
      _enumArraySet = true;
    }
    else if (field == "optEnumArray") {
      _optEnumArray = reader.readNullableArray((reader: Read): Nullable<Enums.CustomEnum> => {
        return reader.readNullableInt32();
      });
    }
  }

  if (!_strSet) {
    throw Error("Missing required argument \"str: String\"");
  }
  if (!_enSet) {
    throw Error("Missing required argument \"en: CustomEnum\"");
  }
  if (!_enumArraySet) {
    throw Error("Missing required argument \"enumArray: [CustomEnum]\"");
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

function writequeryMethodResult(writer: Write, result: i32): void {
  writer.writeInt32(result);
}
