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
import { Ethereum_StaticTxResult } from "./";
import * as Types from "../..";

export function serializeEthereum_StaticTxResult(type: Ethereum_StaticTxResult): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_StaticTxResult");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_StaticTxResult(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_StaticTxResult");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_StaticTxResult(encoder, type);
  return buffer;
}

export function writeEthereum_StaticTxResult(writer: Write, type: Ethereum_StaticTxResult): void {
  writer.writeMapLength(2);
  writer.context().push("result", "string", "writing property");
  writer.writeString("result");
  writer.writeString(type.result);
  writer.context().pop();
  writer.context().push("error", "bool", "writing property");
  writer.writeString("error");
  writer.writeBool(type.error);
  writer.context().pop();
}

export function deserializeEthereum_StaticTxResult(buffer: ArrayBuffer): Ethereum_StaticTxResult {
  const context: Context = new Context("Deserializing imported object-type Ethereum_StaticTxResult");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_StaticTxResult(reader);
}

export function readEthereum_StaticTxResult(reader: Read): Ethereum_StaticTxResult {
  let numFields = reader.readMapLength();

  let _result: string = "";
  let _resultSet: bool = false;
  let _error: bool = false;
  let _errorSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "result") {
      reader.context().push(field, "string", "type found, reading property");
      _result = reader.readString();
      _resultSet = true;
      reader.context().pop();
    }
    else if (field == "error") {
      reader.context().push(field, "bool", "type found, reading property");
      _error = reader.readBool();
      _errorSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_resultSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'result: String'"));
  }
  if (!_errorSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'error: Boolean'"));
  }

  return {
    result: _result,
    error: _error
  };
}
