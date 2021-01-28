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
  var _argSet: boolean = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "arg") {
      _arg = reader.readString();
      _argSet = true;
    }
  }

  if (!_argSet) {
    throw Error("Missing required argument 'arg: String'");
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

function writequeryMethodResult(writer: Write, result: i32): void {
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

  var _object: Objects.AnotherType = new Objects.AnotherType();
  var _objectSet: boolean = false;
  var _optObject: Objects.AnotherType | null = new Objects.AnotherType();
  var _objectArray: Array<Objects.AnotherType> = [];
  var _objectArraySet: boolean = false;
  var _optObjectArray: Array<Objects.AnotherType | null> | null = [];

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "object") {
      _object.fromBuffer(reader.readBytes());
      _objectSet = true;
    }
    else if (field == "optObject") {
      _optObject.fromBuffer(reader.readBytes());
    }
    else if (field == "objectArray") {
      _objectArray = reader.readArray((reader: Read): Objects.AnotherType => {
        const object = new Objects.AnotherType();
        object.fromBuffer(reader.readBytes());
        return object;
      });
      _objectArraySet = true;
    }
    else if (field == "optObjectArray") {
      _optObjectArray = reader.readNullableArray((reader: Read): Objects.AnotherType | null => {
        var bytes = reader.readNullableBytes();
        var object: Objects.AnotherType | null;
        if (bytes) {
          object = new Objects.AnotherType();
          object.fromBuffer(bytes);
        } else {
          object = null;
        }
        return object;
      });
    }
  }

  if (!_objectSet) {
    throw Error("Missing required argument 'object: AnotherType'");
  }
  if (!_objectArraySet) {
    throw Error("Missing required argument 'objectArray: [AnotherType]'");
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

function writeobjectMethodResult(writer: Write, result: Objects.AnotherType | null): void {
  writer.writeNullableBytes(result ? result.toBuffer() : null);
}
