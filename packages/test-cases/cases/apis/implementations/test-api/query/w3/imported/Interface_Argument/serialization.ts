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
import { Interface_Argument } from "./";
import * as Types from "../..";

export function serializeInterface_Argument(type: Interface_Argument): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Interface_Argument");
  const sizer = new WriteSizer(sizerContext);
  writeInterface_Argument(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Interface_Argument");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeInterface_Argument(encoder, type);
  return buffer;
}

export function writeInterface_Argument(writer: Write, type: Interface_Argument): void {
  writer.writeMapLength(1);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
}

export function deserializeInterface_Argument(buffer: ArrayBuffer): Interface_Argument {
  const context: Context = new Context("Deserializing imported object-type Interface_Argument");
  const reader = new ReadDecoder(buffer, context);
  return readInterface_Argument(reader);
}

export function readInterface_Argument(reader: Read): Interface_Argument {
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "str") {
      reader.context().push(field, "string", "type found, reading property");
      _str = reader.readString();
      _strSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'str: String'"));
  }

  return {
    str: _str
  };
}
