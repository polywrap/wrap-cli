import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeExecutionOutcome,
  deserializeExecutionOutcome,
  writeExecutionOutcome,
  readExecutionOutcome
} from "./serialization";
import * as Types from "..";

export class ExecutionOutcome {
  logs: Array<string>;
  receipt_ids: Array<string>;
  gas_burnt: BigInt;
  status: Types.ExecutionStatus;

  static toBuffer(type: ExecutionOutcome): ArrayBuffer {
    return serializeExecutionOutcome(type);
  }

  static fromBuffer(buffer: ArrayBuffer): ExecutionOutcome {
    return deserializeExecutionOutcome(buffer);
  }

  static write(writer: Write, type: ExecutionOutcome): void {
    writeExecutionOutcome(writer, type);
  }

  static read(reader: Read): ExecutionOutcome {
    return readExecutionOutcome(reader);
  }
}
