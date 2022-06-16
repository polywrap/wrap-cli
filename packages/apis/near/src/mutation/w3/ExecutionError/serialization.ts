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
import { ExecutionError } from "./";
import * as Types from "..";

export function serializeExecutionError(type: ExecutionError): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: ExecutionError");
  const sizer = new WriteSizer(sizerContext);
  writeExecutionError(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: ExecutionError");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeExecutionError(encoder, type);
  return buffer;
}

export function writeExecutionError(writer: Write, type: ExecutionError): void {
  writer.writeMapLength(2);
  writer.context().push("error_message", "string", "writing property");
  writer.writeString("error_message");
  writer.writeString(type.error_message);
  writer.context().pop();
  writer.context().push("error_type", "string", "writing property");
  writer.writeString("error_type");
  writer.writeString(type.error_type);
  writer.context().pop();
}

export function deserializeExecutionError(buffer: ArrayBuffer): ExecutionError {
  const context: Context = new Context("Deserializing object-type ExecutionError");
  const reader = new ReadDecoder(buffer, context);
  return readExecutionError(reader);
}

export function readExecutionError(reader: Read): ExecutionError {
  let numFields = reader.readMapLength();

  let _error_message: string = "";
  let _error_messageSet: bool = false;
  let _error_type: string = "";
  let _error_typeSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "error_message") {
      reader.context().push(field, "string", "type found, reading property");
      _error_message = reader.readString();
      _error_messageSet = true;
      reader.context().pop();
    }
    else if (field == "error_type") {
      reader.context().push(field, "string", "type found, reading property");
      _error_type = reader.readString();
      _error_typeSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_error_messageSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'error_message: String'"));
  }
  if (!_error_typeSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'error_type: String'"));
  }

  return {
    error_message: _error_message,
    error_type: _error_type
  };
}
