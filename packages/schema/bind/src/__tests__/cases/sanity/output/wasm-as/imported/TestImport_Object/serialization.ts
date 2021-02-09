import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable
} from "@web3api/wasm-as";
import { TestImport_Object } from "./";
import * as Enums from "../../enums";

export function serializeTestImport_Object(type: TestImport_Object): ArrayBuffer {
  const sizer = new WriteSizer();
  writeTestImport_Object(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writeTestImport_Object(encoder, type);
  return buffer;
}

function writeTestImport_Object(writer: Write, type: TestImport_Object): void {
  writer.writeMapLength(4);
  writer.writeString("enum");
  writer.writeInt32(type.enum);
  writer.writeString("optEnum");
  writer.writeNullableInt32(type.optEnum);
  writer.writeString("enumArray");
  writer.writeArray(type.enumArray, (writer: Write, item: Enums.TestImport_Enum): void => {
    writer.writeInt32(item);
  });
  writer.writeString("optEnumArray");
  writer.writeNullableArray(type.optEnumArray, (writer: Write, item: Nullable<Enums.TestImport_Enum>): void => {
    writer.writeNullableInt32(item);
  });
}

export function deserializeTestImport_Object(buffer: ArrayBuffer, type: TestImport_Object) {
  const reader = new ReadDecoder(buffer);
  var numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "prop") {
      type.prop = reader.readString();
    }
    else if (field == "enum") {
      type.enum = reader.readInt32();
    }
    else if (field == "optEnum") {
      type.optEnum = reader.readNullableInt32();
    }
    else if (field == "enumArray") {
      type.enumArray = reader.readArray((reader: Read): Enums.TestImport_Enum => {
        return reader.readInt32();
      });
    }
    else if (field == "optEnumArray") {
      type.optEnumArray = reader.readNullableArray((reader: Read): Nullable<Enums.TestImport_Enum> => {
        return reader.readNullableInt32();
      });
    }
  }
}
