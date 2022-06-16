import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeExecutionStatus,
  deserializeExecutionStatus,
  writeExecutionStatus,
  readExecutionStatus
} from "./serialization";
import * as Types from "..";

export class ExecutionStatus {
  successValue: string | null;
  successReceiptId: string | null;
  failure: Types.ExecutionError | null;

  static toBuffer(type: ExecutionStatus): ArrayBuffer {
    return serializeExecutionStatus(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ExecutionStatus {
    return deserializeExecutionStatus(buffer);
  }

  static write(writer: Write, type: ExecutionStatus): void {
    writeExecutionStatus(writer, type);
  }

  static read(reader: Read): ExecutionStatus {
    return readExecutionStatus(reader);
  }
}
