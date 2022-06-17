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
import { SetDataResult } from "./";
import * as Types from "..";

export function serializeSetDataResult(type: SetDataResult): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: SetDataResult");
  const sizer = new WriteSizer(sizerContext);
  writeSetDataResult(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: SetDataResult");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeSetDataResult(encoder, type);
  return buffer;
}

export function writeSetDataResult(writer: Write, type: SetDataResult): void {
  writer.writeMapLength(2);
  writer.context().push("txReceipt", "string", "writing property");
  writer.writeString("txReceipt");
  writer.writeString(type.txReceipt);
  writer.context().pop();
  writer.context().push("value", "u32", "writing property");
  writer.writeString("value");
  writer.writeUInt32(type.value);
  writer.context().pop();
}

export function deserializeSetDataResult(buffer: ArrayBuffer): SetDataResult {
  const context: Context = new Context("Deserializing object-type SetDataResult");
  const reader = new ReadDecoder(buffer, context);
  return readSetDataResult(reader);
}

export function readSetDataResult(reader: Read): SetDataResult {
  let numFields = reader.readMapLength();

  let _txReceipt: string = "";
  let _txReceiptSet: bool = false;
  let _value: u32 = 0;
  let _valueSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "txReceipt") {
      reader.context().push(field, "string", "type found, reading property");
      _txReceipt = reader.readString();
      _txReceiptSet = true;
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "u32", "type found, reading property");
      _value = reader.readUInt32();
      _valueSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_txReceiptSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'txReceipt: String'"));
  }
  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'value: UInt32'"));
  }

  return {
    txReceipt: _txReceipt,
    value: _value
  };
}
