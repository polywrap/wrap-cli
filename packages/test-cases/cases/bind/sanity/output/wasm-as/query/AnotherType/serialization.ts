import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt
} from "@web3api/wasm-as";
import { AnotherType } from "./";
import * as Types from "..";

export function serializeAnotherType(type: AnotherType): ArrayBuffer {
  const sizer = new WriteSizer();
  writeAnotherType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeAnotherType(encoder, type);
  return buffer;
}

export function writeAnotherType(writer: Write, type: AnotherType): void {
  writer.writeMapLength(2);
  writer.writeString("prop");
  writer.writeNullableString(type.prop);
  writer.writeString("circular");
  if (type.circular) {
    Types.CustomType.write(writer, type.circular as Types.CustomType);
  } else {
    writer.writeNil();
  }
}

export function deserializeAnotherType(buffer: ArrayBuffer): AnotherType {
  const reader = new ReadDecoder(buffer);
  return readAnotherType(reader);
}

export function readAnotherType(reader: Read): AnotherType {
  var numFields = reader.readMapLength();

  var _prop: string | null = null;
  var _circular: Types.CustomType | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "prop") {
      _prop = reader.readNullableString();
    }
    else if (field == "circular") {
      var object: Types.CustomType | null = null;
      if (!reader.isNextNil()) {
        object = Types.CustomType.read(reader);
      }
      _circular = object;
    }
  }


  return {
    prop: _prop,
    circular: _circular
  };
}
