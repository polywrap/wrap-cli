import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import { CustomUnion } from "./";
import * as Types from "..";

export function serializeCustomUnion(type: CustomUnion): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) union-type: CustomUnion");
  const sizer = new WriteSizer(sizerContext);
  writeCustomUnion(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) union-type: CustomUnion");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeCustomUnion(encoder, type);
  return buffer;
}

export function writeCustomUnion(writer: Write, type: CustomUnion): void {
  if(type.isAnotherObject) {
    Types.AnotherObject.write(writer, type.AnotherObject)
  } else if(type.isYetAnotherObject) {
    Types.YetAnotherObject.write(writer, type.YetAnotherObject)
  } else {
    writer.writeNil();
  }
}

export function deserializeCustomUnion(buffer: ArrayBuffer): CustomUnion {
  const context: Context = new Context("Deserializing union-type CustomUnion");
  const reader = new ReadDecoder(buffer, context);
  return readCustomUnion(reader);
}

export function readCustomUnion(reader: Read): CustomUnion {
  let numFields = reader.readMapLength();

  let AnotherObject: Types.AnotherObject | null = null;
  let YetAnotherObject: Types.YetAnotherObject | null = null;

  let actualUnionType: string;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if(field == "type") {
      reader.context().push(field, "String", "type found, reading property");
      actualUnionType = reader.readString();
      reader.context().pop();
    }

    if(field == "value") {
      if (actualUnionType == "AnotherObject") {
        reader.context().push(field, "Types.AnotherObject | null", "type found, reading property");

        if (!reader.isNextNil()) {
          AnotherObject = Types.AnotherObject.read(reader);
        }

        reader.context().pop();
      }
      else if (actualUnionType == "YetAnotherObject") {
        reader.context().push(field, "Types.YetAnotherObject | null", "type found, reading property");

        if (!reader.isNextNil()) {
          YetAnotherObject = Types.YetAnotherObject.read(reader);
        }

        reader.context().pop();
      }
    }
  }

  if(AnotherObject) {
    return CustomUnion.create(AnotherObject)
  } else if(YetAnotherObject) {
    return CustomUnion.create(YetAnotherObject)
  } else {
    throw new Error(`All serialized member types for CustomUnion are null`)
  }
}
