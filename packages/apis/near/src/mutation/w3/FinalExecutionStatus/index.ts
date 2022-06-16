import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeFinalExecutionStatus,
  deserializeFinalExecutionStatus,
  writeFinalExecutionStatus,
  readFinalExecutionStatus
} from "./serialization";
import * as Types from "..";

export class FinalExecutionStatus {
  successValue: string | null;
  failure: Types.ExecutionError | null;

  static toBuffer(type: FinalExecutionStatus): ArrayBuffer {
    return serializeFinalExecutionStatus(type);
  }

  static fromBuffer(buffer: ArrayBuffer): FinalExecutionStatus {
    return deserializeFinalExecutionStatus(buffer);
  }

  static write(writer: Write, type: FinalExecutionStatus): void {
    writeFinalExecutionStatus(writer, type);
  }

  static read(reader: Read): FinalExecutionStatus {
    return readFinalExecutionStatus(reader);
  }
}
