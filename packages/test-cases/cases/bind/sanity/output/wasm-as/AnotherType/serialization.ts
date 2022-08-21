import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Option,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";
import { AnotherType } from "./";
import * as Types from "..";

export function serializeAnotherType(type: AnotherType): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: AnotherType");
  const sizer = new WriteSizer(sizerContext);
  writeAnotherType(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: AnotherType");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeAnotherType(encoder, type);
  return buffer;
}

export function writeAnotherType(writer: Write, type: AnotherType): void {
  writer.writeMapLength(3);
  writer.context().push("prop", "string | null", "writing property");
  writer.writeString("prop");
  writer.writeOptionalString(type.prop);
  writer.context().pop();
  writer.context().push("circular", "Types.CustomType | null", "writing property");
  writer.writeString("circular");
  if (type.circular) {
    Types.CustomType.write(writer, type.circular as Types.CustomType);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("const", "string | null", "writing property");
  writer.writeString("const");
  writer.writeOptionalString(type._const);
  writer.context().pop();
}

export function deserializeAnotherType(buffer: ArrayBuffer): AnotherType {
  const context: Context = new Context("Deserializing object-type AnotherType");
  const reader = new ReadDecoder(buffer, context);
  return readAnotherType(reader);
}

export function readAnotherType(reader: Read): AnotherType {
  let numFields = reader.readMapLength();

  let _prop: string | null = null;
  let _circular: Types.CustomType | null = null;
  let _const: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "prop") {
      reader.context().push(field, "string | null", "type found, reading property");
      _prop = reader.readOptionalString();
      reader.context().pop();
    }
    else if (field == "circular") {
      reader.context().push(field, "Types.CustomType | null", "type found, reading property");
      let object: Types.CustomType | null = null;
      if (!reader.isNextNil()) {
        object = Types.CustomType.read(reader);
      }
      _circular = object;
      reader.context().pop();
    }
    else if (field == "const") {
      reader.context().push(field, "string | null", "type found, reading property");
      _const = reader.readOptionalString();
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    prop: _prop,
    circular: _circular,
    _const: _const
  };
}
