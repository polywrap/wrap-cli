import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable
} from "@web3api/wasm-as";
import { AnotherType } from "./";
import * as Objects from "../";

export function serializeAnotherType(type: AnotherType): ArrayBuffer {
  const objects: (ArrayBuffer | null)[] = [
    type.circular.toBuffer(),
  ];
  const sizer = new WriteSizer();
  writeAnotherType(sizer, type, objects);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeAnotherType(encoder, type, objects);
  return buffer;
}

function writeAnotherType(writer: Write, type: AnotherType, objects: (ArrayBuffer | null)[]) {
  let objectsIdx = 0;
  writer.writeMapLength(2);
  writer.writeString("prop");
  writer.writeNullableString(type.prop);
  writer.writeString("circular");
  writer.writeNullableBytes(objects[objectsIdx++]);
}

export function deserializeAnotherType(buffer: ArrayBuffer, type: AnotherType) {
  const reader = new ReadDecoder(buffer);
  var numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "prop") {
      type.prop = reader.readNullableString();
    }
    else if (field == "circular") {
      type.circular = new Objects.CustomType();
      type.circular.fromBuffer(reader.readBytes());
    }
  }
}
