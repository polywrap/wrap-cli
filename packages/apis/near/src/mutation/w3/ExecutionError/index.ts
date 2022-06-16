import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeExecutionError,
  deserializeExecutionError,
  writeExecutionError,
  readExecutionError
} from "./serialization";
import * as Types from "..";

export class ExecutionError {
  error_message: string;
  error_type: string;

  static toBuffer(type: ExecutionError): ArrayBuffer {
    return serializeExecutionError(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ExecutionError {
    return deserializeExecutionError(buffer);
  }

  static write(writer: Write, type: ExecutionError): void {
    writeExecutionError(writer, type);
  }

  static read(reader: Read): ExecutionError {
    return readExecutionError(reader);
  }
}
