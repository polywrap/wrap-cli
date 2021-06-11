import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  Context
} from "@web3api/wasm-as";
import { AnotherType } from "./";
import * as Types from "..";

export function serializeAnotherType(type: AnotherType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: AnotherType");
  const sizer = new WriteSizer(sizerContext);
  writeAnotherType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: AnotherType");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeAnotherType(encoder, type);
  return buffer;
}

export function writeAnotherType(writer: Write, type: AnotherType): void {
  writer.writeMapLength(2);
  writer.context().push("prop", "string | null", "writing property");
  writer.writeString("prop");
  writer.writeNullableString(type.prop);
  writer.context().pop();
  writer.context().push("circular", "Types.CustomType | null", "writing property");
  writer.writeString("circular");
  if (type.circular) {
    Types.CustomType.write(writer, type.circular as Types.CustomType);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializeAnotherType(buffer: ArrayBuffer): AnotherType {
  const context: Context = new Context("Deserializing object-type AnotherType");
  const reader = new ReadDecoder(buffer, context);
  return readAnotherType(reader);
}

export function readAnotherType(reader: Read): AnotherType {
  var numFields = reader.readMapLength();

  var _prop: string | null = null;
  var _circular: Types.CustomType | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop") {
      reader.context().push(field, "string | null", "type found, reading property");
      _prop = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "circular") {
      reader.context().push(field, "Types.CustomType | null", "type found, reading property");
      var object: Types.CustomType | null = null;
      if (!reader.isNextNil()) {
        object = Types.CustomType.read(reader);
      }
      _circular = object;
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    prop: _prop,
    circular: _circular
  };
}
