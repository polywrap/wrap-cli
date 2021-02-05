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
    Objects.TestImport_AnotherObject.toBuffer(type.object),
    type.optObject ? Objects.TestImport_AnotherObject.toBuffer(type.optObject) : null,
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
    writer.writeBytes(Objects.TestImport_AnotherObject.toBuffer(item));
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(type.optObjectArray, (writer: Write, item: Objects.TestImport_AnotherObject | null): void => {
    writer.writeNullableBytes(item ? Objects.TestImport_AnotherObject.toBuffer(item) : null);
  });
}

export function deserializeTestImport_Object(buffer: ArrayBuffer): TestImport_Object {
  const reader = new ReadDecoder(buffer);
  var numFields = reader.readMapLength();

  var _object: Objects.TestImport_AnotherObject | null = null;
  var _objectSet: bool = false;
  var _optObject: Objects.TestImport_AnotherObject | null = null;
  var _objectArray: Array<Objects.TestImport_AnotherObject> = [];
  var _objectArraySet: bool = false;
  var _optObjectArray: Array<Objects.TestImport_AnotherObject | null> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "object") {
      const object = Objects.TestImport_AnotherObject.fromBuffer(reader.readBytes());
      _object = object;
      _objectSet = true;
    }
    else if (field == "optObject") {
      const bytes = reader.readNullableBytes();
      var object: Objects.TestImport_AnotherObject | null = null;
      if (bytes) {
        object = Objects.TestImport_AnotherObject.fromBuffer(bytes);
      }
      _optObject = object;
    }
    else if (field == "objectArray") {
      _objectArray = reader.readArray((reader: Read): Objects.TestImport_AnotherObject => {
        const object = Objects.TestImport_AnotherObject.fromBuffer(reader.readBytes());
        return object;
      });
      _objectArraySet = true;
    }
    else if (field == "optObjectArray") {
      _optObjectArray = reader.readNullableArray((reader: Read): Objects.TestImport_AnotherObject | null => {
        const bytes = reader.readNullableBytes();
        var object: Objects.TestImport_AnotherObject | null = null;
        if (bytes) {
          object = Objects.TestImport_AnotherObject.fromBuffer(bytes);
        }
        return object;
      });
    }
  }

  if (!_object || !_objectSet) {
    throw Error("Missing required property: 'object: TestImport_AnotherObject'");
  }
  if (!_objectArraySet) {
    throw Error("Missing required property: 'objectArray: [TestImport_AnotherObject]'");
  }

  return {
    object: _object,
    optObject: _optObject,
    objectArray: _objectArray,
    optObjectArray: _optObjectArray
  };
}
