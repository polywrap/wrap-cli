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
import { Ethereum_EventNotification } from "./";
import * as Types from "../..";

export function serializeEthereum_EventNotification(type: Ethereum_EventNotification): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing)  imported object-type: Ethereum_EventNotification");
  const sizer = new WriteSizer(sizerContext);
  writeEthereum_EventNotification(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) import object-type: Ethereum_EventNotification");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeEthereum_EventNotification(encoder, type);
  return buffer;
}

export function writeEthereum_EventNotification(writer: Write, type: Ethereum_EventNotification): void {
  writer.writeMapLength(3);
  writer.context().push("data", "string", "writing property");
  writer.writeString("data");
  writer.writeString(type.data);
  writer.context().pop();
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(type.address);
  writer.context().pop();
  writer.context().push("log", "Types.Ethereum_Log", "writing property");
  writer.writeString("log");
  Types.Ethereum_Log.write(writer, type.log);
  writer.context().pop();
}

export function deserializeEthereum_EventNotification(buffer: ArrayBuffer): Ethereum_EventNotification {
  const context: Context = new Context("Deserializing imported object-type Ethereum_EventNotification");
  const reader = new ReadDecoder(buffer, context);
  return readEthereum_EventNotification(reader);
}

export function readEthereum_EventNotification(reader: Read): Ethereum_EventNotification {
  let numFields = reader.readMapLength();

  let _data: string = "";
  let _dataSet: bool = false;
  let _address: string = "";
  let _addressSet: bool = false;
  let _log: Types.Ethereum_Log | null = null;
  let _logSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "data") {
      reader.context().push(field, "string", "type found, reading property");
      _data = reader.readString();
      _dataSet = true;
      reader.context().pop();
    }
    else if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "log") {
      reader.context().push(field, "Types.Ethereum_Log", "type found, reading property");
      const object = Types.Ethereum_Log.read(reader);
      _log = object;
      _logSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_dataSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'data: String'"));
  }
  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'address: String'"));
  }
  if (!_log || !_logSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'log: Ethereum_Log'"));
  }

  return {
    data: _data,
    address: _address,
    log: _log
  };
}
