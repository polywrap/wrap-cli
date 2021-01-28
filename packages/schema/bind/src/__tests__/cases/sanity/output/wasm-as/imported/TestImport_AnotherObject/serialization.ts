import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable
} from "@web3api/wasm-as";
import { TestImport_AnotherObject } from "./";
import * as Objects from "../..";

export function serializeTestImport_AnotherObject(type: TestImport_AnotherObject): ArrayBuffer {
  const objects: (ArrayBuffer | null)[] = [
  ];
  const sizer = new WriteSizer();
  writeTestImport_AnotherObject(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeTestImport_AnotherObject(encoder, type);
  return buffer;
}

function writeTestImport_AnotherObject(writer: Write, type: TestImport_AnotherObject, objects: (ArrayBuffer | null)[]): void {
  let objectsIdx = 0;
  writer.writeMapLength(1);
  writer.writeString("prop");
  writer.writeString(type.prop);
}

export function deserializeTestImport_AnotherObject(buffer: ArrayBuffer, type: TestImport_AnotherObject): void {
  const reader = new ReadDecoder(buffer);
  var numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "prop") {
      type.prop = reader.readString();
    }
  }
}
