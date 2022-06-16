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
import { MutationEnv } from "./";
import * as Types from "..";

export function serializeMutationEnv(type: MutationEnv): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: MutationEnv");
  const sizer = new WriteSizer(sizerContext);
  writeMutationEnv(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: MutationEnv");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeMutationEnv(encoder, type);
  return buffer;
}

export function writeMutationEnv(writer: Write, type: MutationEnv): void {
  writer.writeMapLength(3);
  writer.context().push("str", "string", "writing property");
  writer.writeString("str");
  writer.writeString(type.str);
  writer.context().pop();
  writer.context().push("optStr", "string | null", "writing property");
  writer.writeString("optStr");
  writer.writeNullableString(type.optStr);
  writer.context().pop();
  writer.context().push("defMutStr", "string", "writing property");
  writer.writeString("defMutStr");
  writer.writeString(type.defMutStr);
  writer.context().pop();
}

export function deserializeMutationEnv(buffer: ArrayBuffer): MutationEnv {
  const context: Context = new Context("Deserializing object-type MutationEnv");
  const reader = new ReadDecoder(buffer, context);
  return readMutationEnv(reader);
}

export function readMutationEnv(reader: Read): MutationEnv {
  let numFields = reader.readMapLength();

  let _str: string = "";
  let _strSet: bool = false;
  let _optStr: string | null = null;
  let _defMutStr: string = "";
  let _defMutStrSet: bool = false;

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
    else if (field == "optStr") {
      reader.context().push(field, "string | null", "type found, reading property");
      _optStr = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "defMutStr") {
      reader.context().push(field, "string", "type found, reading property");
      _defMutStr = reader.readString();
      _defMutStrSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_strSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'str: String'"));
  }
  if (!_defMutStrSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'defMutStr: String'"));
  }

  return {
    str: _str,
    optStr: _optStr,
    defMutStr: _defMutStr
  };
}
