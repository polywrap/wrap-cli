import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@web3api/wasm-as";
import { LargeCollection } from "./";
import * as Types from "..";

export function serializeLargeCollection(type: LargeCollection): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: LargeCollection");
  const sizer = new WriteSizer(sizerContext);
  writeLargeCollection(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: LargeCollection");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeLargeCollection(encoder, type);
  return buffer;
}

export function writeLargeCollection(writer: Write, type: LargeCollection): void {
  writer.writeMapLength(4);
  writer.context().push("largeStr", "string", "writing property");
  writer.writeString("largeStr");
  writer.writeString(type.largeStr);
  writer.context().pop();
  writer.context().push("largeBytes", "ArrayBuffer", "writing property");
  writer.writeString("largeBytes");
  writer.writeBytes(type.largeBytes);
  writer.context().pop();
  writer.context().push("largeStrArray", "Array<string>", "writing property");
  writer.writeString("largeStrArray");
  writer.writeArray(type.largeStrArray, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("largeBytesArray", "Array<ArrayBuffer>", "writing property");
  writer.writeString("largeBytesArray");
  writer.writeArray(type.largeBytesArray, (writer: Write, item: ArrayBuffer): void => {
    writer.writeBytes(item);
  });
  writer.context().pop();
}

export function deserializeLargeCollection(buffer: ArrayBuffer): LargeCollection {
  const context: Context = new Context("Deserializing object-type LargeCollection");
  const reader = new ReadDecoder(buffer, context);
  return readLargeCollection(reader);
}

export function readLargeCollection(reader: Read): LargeCollection {
  let numFields = reader.readMapLength();

  let _largeStr: string = "";
  let _largeStrSet: bool = false;
  let _largeBytes: ArrayBuffer = new ArrayBuffer(0);
  let _largeBytesSet: bool = false;
  let _largeStrArray: Array<string> = [];
  let _largeStrArraySet: bool = false;
  let _largeBytesArray: Array<ArrayBuffer> = [];
  let _largeBytesArraySet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "largeStr") {
      reader.context().push(field, "string", "type found, reading property");
      _largeStr = reader.readString();
      _largeStrSet = true;
      reader.context().pop();
    }
    else if (field == "largeBytes") {
      reader.context().push(field, "ArrayBuffer", "type found, reading property");
      _largeBytes = reader.readBytes();
      _largeBytesSet = true;
      reader.context().pop();
    }
    else if (field == "largeStrArray") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _largeStrArray = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _largeStrArraySet = true;
      reader.context().pop();
    }
    else if (field == "largeBytesArray") {
      reader.context().push(field, "Array<ArrayBuffer>", "type found, reading property");
      _largeBytesArray = reader.readArray((reader: Read): ArrayBuffer => {
        return reader.readBytes();
      });
      _largeBytesArraySet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_largeStrSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'largeStr: String'"));
  }
  if (!_largeBytesSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'largeBytes: Bytes'"));
  }
  if (!_largeStrArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'largeStrArray: [String]'"));
  }
  if (!_largeBytesArraySet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'largeBytesArray: [Bytes]'"));
  }

  return {
    largeStr: _largeStr,
    largeBytes: _largeBytes,
    largeStrArray: _largeStrArray,
    largeBytesArray: _largeBytesArray
  };
}
