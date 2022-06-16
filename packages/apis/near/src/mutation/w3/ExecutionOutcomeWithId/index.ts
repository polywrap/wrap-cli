import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeExecutionOutcomeWithId,
  deserializeExecutionOutcomeWithId,
  writeExecutionOutcomeWithId,
  readExecutionOutcomeWithId
} from "./serialization";
import * as Types from "..";

export class ExecutionOutcomeWithId {
  id: string;
  outcome: Types.ExecutionOutcome;

  static toBuffer(type: ExecutionOutcomeWithId): ArrayBuffer {
    return serializeExecutionOutcomeWithId(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ExecutionOutcomeWithId {
    return deserializeExecutionOutcomeWithId(buffer);
  }

  static write(writer: Write, type: ExecutionOutcomeWithId): void {
    writeExecutionOutcomeWithId(writer, type);
  }

  static read(reader: Read): ExecutionOutcomeWithId {
    return readExecutionOutcomeWithId(reader);
  }
}
