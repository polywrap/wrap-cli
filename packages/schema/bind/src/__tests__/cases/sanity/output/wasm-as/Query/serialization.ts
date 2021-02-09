import { Nullable } from "@web3api/wasm-as";
import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write
} from "@web3api/wasm-as";
import * as Objects from "..";

export class Input_queryMethod {
  arg: string;
}

export function deserializequeryMethodArgs(argsBuf: ArrayBuffer): Input_queryMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _arg: string = "";
  var _argSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "arg") {
      _arg = reader.readString();
      _argSet = true;
    }
  }

  if (!_argSet) {
    throw new Error("Missing required argument: 'arg: String'");
  }

  return {
    arg: _arg
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

export function writequeryMethodResult(writer: Write, result: i32): void {
  writer.writeInt32(result);
}

export class Input_objectMethod {
  object: Objects.AnotherType;
  optObject: Objects.AnotherType | null;
  objectArray: Array<Objects.AnotherType>;
  optObjectArray: Array<Objects.AnotherType | null> | null;
}

export function deserializeobjectMethodArgs(argsBuf: ArrayBuffer): Input_objectMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _object: Objects.AnotherType | null = null;
  var _objectSet: bool = false;
  var _optObject: Objects.AnotherType | null = null;
  var _objectArray: Array<Objects.AnotherType> = [];
  var _objectArraySet: bool = false;
  var _optObjectArray: Array<Objects.AnotherType | null> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "object") {
      const object = Objects.AnotherType.read(reader);
      _object = object;
      _objectSet = true;
    }
    else if (field == "optObject") {
      var object: Objects.AnotherType | null = null;
      if (!reader.isNextNil()) {
        object = Objects.AnotherType.read(reader);
      }
      _optObject = object;
    }
    else if (field == "objectArray") {
      _objectArray = reader.readArray((reader: Read): Objects.AnotherType => {
        const object = Objects.AnotherType.read(reader);
        return object;
      });
      _objectArraySet = true;
    }
    else if (field == "optObjectArray") {
      _optObjectArray = reader.readNullableArray((reader: Read): Objects.AnotherType | null => {
        var object: Objects.AnotherType | null = null;
        if (!reader.isNextNil()) {
          object = Objects.AnotherType.read(reader);
        }
        return object;
      });
    }
  }

  if (!_object || !_objectSet) {
    throw new Error("Missing required argument: 'object: AnotherType'");
  }
  if (!_objectArraySet) {
    throw new Error("Missing required argument: 'objectArray: [AnotherType]'");
  }

  return {
    object: _object,
    optObject: _optObject,
    objectArray: _objectArray,
    optObjectArray: _optObjectArray
  };
}

export function serializeobjectMethodResult(result: Objects.AnotherType | null): ArrayBuffer {
  const sizer = new WriteSizer();
  writeobjectMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeobjectMethodResult(encoder, result);
  return buffer;
}

export function writeobjectMethodResult(writer: Write, result: Objects.AnotherType | null): void {
  if (result) {
    Objects.AnotherType.write(writer, result);
  } else {
    writer.writeNil();
  }
}
