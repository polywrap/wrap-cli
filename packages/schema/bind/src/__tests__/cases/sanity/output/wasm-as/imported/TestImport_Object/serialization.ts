import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable
} from "@web3api/wasm-as";
import { TestImport_Object } from "./";
import * as Objects from "../..";

export function serializeTestImport_Object(type: TestImport_Object): ArrayBuffer {
  const objects: (ArrayBuffer | null)[] = [
    type.object.toBuffer(),
    type.optObject ? type.optObject.toBuffer() : null,
  ];
  const sizer = new WriteSizer();
  writeTestImport_Object(sizer, type, objects);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeTestImport_Object(encoder, type, objects);
  return buffer;
}

function writeTestImport_Object(writer: Write, type: TestImport_Object, objects: (ArrayBuffer | null)[]): void {
  let objectsIdx = 0;
  writer.writeMapLength(4);
  writer.writeString("object");
  writer.writeNullableBytes(objects[objectsIdx++]);
  writer.writeString("optObject");
  writer.writeNullableBytes(objects[objectsIdx++]);
  writer.writeString("objectArray");
  writer.writeArray(type.objectArray, (writer: Write, item: Objects.TestImport_AnotherObject): void => {
    writer.writeBytes(item.toBuffer());
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(type.optObjectArray, (writer: Write, item: Objects.TestImport_AnotherObject | null): void => {
    writer.writeNullableBytes(item ? item.toBuffer() : null);
  });
}

export function deserializeTestImport_Object(buffer: ArrayBuffer, type: TestImport_Object): void {
  const reader = new ReadDecoder(buffer);
  var numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "object") {
      const object = new Objects.TestImport_AnotherObject();
      object.fromBuffer(reader.readBytes());
      type.object = object;
    }
    else if (field == "optObject") {
      const bytes = reader.readNullableBytes();
      var object: Objects.TestImport_AnotherObject | null = null;
      if (bytes) {
        object = new Objects.TestImport_AnotherObject();
        object.fromBuffer(bytes);
      }
      type.optObject = object;
    }
    else if (field == "objectArray") {
      type.objectArray = reader.readArray((reader: Read): Objects.TestImport_AnotherObject => {
        const object = new Objects.TestImport_AnotherObject();
        object.fromBuffer(reader.readBytes());
        return object;
      });
    }
    else if (field == "optObjectArray") {
      type.optObjectArray = reader.readNullableArray((reader: Read): Objects.TestImport_AnotherObject | null => {
        const bytes = reader.readNullableBytes();
        var object: Objects.TestImport_AnotherObject | null = null;
        if (bytes) {
          object = new Objects.TestImport_AnotherObject();
          object.fromBuffer(bytes);
        }
        return object;
      });
    }
  }
}
