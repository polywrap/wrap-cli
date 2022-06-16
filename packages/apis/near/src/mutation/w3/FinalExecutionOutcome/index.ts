import {
  Read,
  Write,
  Nullable,
  BigInt,
  JSON
} from "@web3api/wasm-as";
import {
  serializeFinalExecutionOutcome,
  deserializeFinalExecutionOutcome,
  writeFinalExecutionOutcome,
  readFinalExecutionOutcome
} from "./serialization";
import * as Types from "..";

export class FinalExecutionOutcome {
  status: Types.FinalExecutionStatus;
  transaction: Types.Transaction;
  transaction_outcome: Types.ExecutionOutcomeWithId;
  receipts_outcome: Array<Types.ExecutionOutcomeWithId>;

  static toBuffer(type: FinalExecutionOutcome): ArrayBuffer {
    return serializeFinalExecutionOutcome(type);
  }

  static fromBuffer(buffer: ArrayBuffer): FinalExecutionOutcome {
    return deserializeFinalExecutionOutcome(buffer);
  }

  static write(writer: Write, type: FinalExecutionOutcome): void {
    writeFinalExecutionOutcome(writer, type);
  }

  static read(reader: Read): FinalExecutionOutcome {
    return readFinalExecutionOutcome(reader);
  }
}
