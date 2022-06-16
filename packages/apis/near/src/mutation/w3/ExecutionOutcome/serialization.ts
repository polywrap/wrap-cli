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
import { ExecutionOutcome } from "./";
import * as Types from "..";

export function serializeExecutionOutcome(type: ExecutionOutcome): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: ExecutionOutcome");
  const sizer = new WriteSizer(sizerContext);
  writeExecutionOutcome(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: ExecutionOutcome");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeExecutionOutcome(encoder, type);
  return buffer;
}

export function writeExecutionOutcome(writer: Write, type: ExecutionOutcome): void {
  writer.writeMapLength(4);
  writer.context().push("logs", "Array<string>", "writing property");
  writer.writeString("logs");
  writer.writeArray(type.logs, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("receipt_ids", "Array<string>", "writing property");
  writer.writeString("receipt_ids");
  writer.writeArray(type.receipt_ids, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("gas_burnt", "BigInt", "writing property");
  writer.writeString("gas_burnt");
  writer.writeBigInt(type.gas_burnt);
  writer.context().pop();
  writer.context().push("status", "Types.ExecutionStatus", "writing property");
  writer.writeString("status");
  Types.ExecutionStatus.write(writer, type.status);
  writer.context().pop();
}

export function deserializeExecutionOutcome(buffer: ArrayBuffer): ExecutionOutcome {
  const context: Context = new Context("Deserializing object-type ExecutionOutcome");
  const reader = new ReadDecoder(buffer, context);
  return readExecutionOutcome(reader);
}

export function readExecutionOutcome(reader: Read): ExecutionOutcome {
  let numFields = reader.readMapLength();

  let _logs: Array<string> = [];
  let _logsSet: bool = false;
  let _receipt_ids: Array<string> = [];
  let _receipt_idsSet: bool = false;
  let _gas_burnt: BigInt = BigInt.fromUInt16(0);
  let _gas_burntSet: bool = false;
  let _status: Types.ExecutionStatus | null = null;
  let _statusSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "logs") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _logs = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _logsSet = true;
      reader.context().pop();
    }
    else if (field == "receipt_ids") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _receipt_ids = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _receipt_idsSet = true;
      reader.context().pop();
    }
    else if (field == "gas_burnt") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _gas_burnt = reader.readBigInt();
      _gas_burntSet = true;
      reader.context().pop();
    }
    else if (field == "status") {
      reader.context().push(field, "Types.ExecutionStatus", "type found, reading property");
      const object = Types.ExecutionStatus.read(reader);
      _status = object;
      _statusSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_logsSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'logs: [String]'"));
  }
  if (!_receipt_idsSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'receipt_ids: [String]'"));
  }
  if (!_gas_burntSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'gas_burnt: BigInt'"));
  }
  if (!_status || !_statusSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'status: ExecutionStatus'"));
  }

  return {
    logs: _logs,
    receipt_ids: _receipt_ids,
    gas_burnt: _gas_burnt,
    status: _status
  };
}
