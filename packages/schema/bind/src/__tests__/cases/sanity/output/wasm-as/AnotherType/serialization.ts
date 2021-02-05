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
  const objects: (ArrayBuffer | null)[] = [
    Objects.CustomType.toBuffer(type.circular),
  ];
  const sizer = new WriteSizer();
  writeAnotherType(sizer, type, objects);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeAnotherType(encoder, type, objects);
  return buffer;
}

function writeAnotherType(writer: Write, type: AnotherType, objects: (ArrayBuffer | null)[]): void {
  let objectsIdx = 0;
  writer.writeMapLength(2);
  writer.writeString("prop");
  writer.writeNullableString(type.prop);
  writer.writeString("circular");
  writer.writeNullableBytes(objects[objectsIdx++]);
}

export function deserializeAnotherType(buffer: ArrayBuffer): AnotherType {
  const reader = new ReadDecoder(buffer);
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
      const object = Objects.CustomType.fromBuffer(reader.readBytes());
      _circular = object;
      _circularSet = true;
    }
  }

  if (!_circular || !_circularSet) {
    throw Error("Missing required property: 'circular: CustomType'");
  }

  return {
    prop: _prop,
    circular: _circular
  };
}
