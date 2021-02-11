import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable
} from "@web3api/wasm-as";
import { AnotherType } from "./";
import * as Objects from "..";

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
  Objects.CustomType.write(writer, type.circular);
}

export function deserializeAnotherType(buffer: ArrayBuffer): AnotherType {
  const reader = new ReadDecoder(buffer);
  return readAnotherType(reader);
}

export function readAnotherType(reader: Read): AnotherType {
  var numFields = reader.readMapLength();

  var _prop: string | null = null;
  var _circular: Objects.CustomType | null = null;
  var _circularSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "prop") {
      _prop = reader.readNullableString();
    }
    else if (field == "circular") {
      const object = Objects.CustomType.read(reader);
      _circular = object;
      _circularSet = true;
    }
  }

  if (!_circular || !_circularSet) {
    throw new Error("Missing required property: 'circular: CustomType'");
  }

  return {
    prop: _prop,
    circular: _circular
  };
}
