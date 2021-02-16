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
  const sizer = new WriteSizer();
  writeTestImport_Object(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeTestImport_Object(encoder, type);
  return buffer;
}

export function writeTestImport_Object(writer: Write, type: TestImport_Object): void {
  writer.writeMapLength(4);
  writer.writeString("object");
  Objects.TestImport_AnotherObject.write(writer, type.object);
  writer.writeString("optObject");
  if (type.optObject) {
    Objects.TestImport_AnotherObject.write(writer, type.optObject);
  } else {
    writer.writeNil();
  }
  writer.writeString("objectArray");
  writer.writeArray(type.objectArray, (writer: Write, item: Objects.TestImport_AnotherObject): void => {
    Objects.TestImport_AnotherObject.write(writer, item);
  });
  writer.writeString("optObjectArray");
  writer.writeNullableArray(type.optObjectArray, (writer: Write, item: Objects.TestImport_AnotherObject | null): void => {
    if (item) {
      Objects.TestImport_AnotherObject.write(writer, item);
    } else {
      writer.writeNil();
    }
  });
}

export function deserializeTestImport_Object(buffer: ArrayBuffer): TestImport_Object {
  const reader = new ReadDecoder(buffer);
  return readTestImport_Object(reader);
}

export function readTestImport_Object(reader: Read): TestImport_Object {
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
      const object = Objects.TestImport_AnotherObject.read(reader);
      _object = object;
      _objectSet = true;
    }
    else if (field == "optObject") {
      var object: Objects.TestImport_AnotherObject | null = null;
      if (!reader.isNextNil()) {
        object = Objects.TestImport_AnotherObject.read(reader);
      }
      _optObject = object;
    }
    else if (field == "objectArray") {
      _objectArray = reader.readArray((reader: Read): Objects.TestImport_AnotherObject => {
        const object = Objects.TestImport_AnotherObject.read(reader);
        return object;
      });
      _objectArraySet = true;
    }
    else if (field == "optObjectArray") {
      _optObjectArray = reader.readNullableArray((reader: Read): Objects.TestImport_AnotherObject | null => {
        var object: Objects.TestImport_AnotherObject | null = null;
        if (!reader.isNextNil()) {
          object = Objects.TestImport_AnotherObject.read(reader);
        }
        return object;
      });
    }
  }

  if (!_object || !_objectSet) {
    throw new Error("Missing required property: 'object: TestImport_AnotherObject'");
  }
  if (!_objectArraySet) {
    throw new Error("Missing required property: 'objectArray: [TestImport_AnotherObject]'");
  }

  return {
    object: _object,
    optObject: _optObject,
    objectArray: _objectArray,
    optObjectArray: _optObjectArray
  };
}
