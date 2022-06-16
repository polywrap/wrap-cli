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
import { FinalExecutionOutcome } from "./";
import * as Types from "..";

export function serializeFinalExecutionOutcome(type: FinalExecutionOutcome): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: FinalExecutionOutcome");
  const sizer = new WriteSizer(sizerContext);
  writeFinalExecutionOutcome(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: FinalExecutionOutcome");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeFinalExecutionOutcome(encoder, type);
  return buffer;
}

export function writeFinalExecutionOutcome(writer: Write, type: FinalExecutionOutcome): void {
  writer.writeMapLength(4);
  writer.context().push("status", "Types.FinalExecutionStatus", "writing property");
  writer.writeString("status");
  Types.FinalExecutionStatus.write(writer, type.status);
  writer.context().pop();
  writer.context().push("transaction", "Types.Transaction", "writing property");
  writer.writeString("transaction");
  Types.Transaction.write(writer, type.transaction);
  writer.context().pop();
  writer.context().push("transaction_outcome", "Types.ExecutionOutcomeWithId", "writing property");
  writer.writeString("transaction_outcome");
  Types.ExecutionOutcomeWithId.write(writer, type.transaction_outcome);
  writer.context().pop();
  writer.context().push("receipts_outcome", "Array<Types.ExecutionOutcomeWithId>", "writing property");
  writer.writeString("receipts_outcome");
  writer.writeArray(type.receipts_outcome, (writer: Write, item: Types.ExecutionOutcomeWithId): void => {
    Types.ExecutionOutcomeWithId.write(writer, item);
  });
  writer.context().pop();
}

export function deserializeFinalExecutionOutcome(buffer: ArrayBuffer): FinalExecutionOutcome {
  const context: Context = new Context("Deserializing object-type FinalExecutionOutcome");
  const reader = new ReadDecoder(buffer, context);
  return readFinalExecutionOutcome(reader);
}

export function readFinalExecutionOutcome(reader: Read): FinalExecutionOutcome {
  let numFields = reader.readMapLength();

  let _status: Types.FinalExecutionStatus | null = null;
  let _statusSet: bool = false;
  let _transaction: Types.Transaction | null = null;
  let _transactionSet: bool = false;
  let _transaction_outcome: Types.ExecutionOutcomeWithId | null = null;
  let _transaction_outcomeSet: bool = false;
  let _receipts_outcome: Array<Types.ExecutionOutcomeWithId> = [];
  let _receipts_outcomeSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "status") {
      reader.context().push(field, "Types.FinalExecutionStatus", "type found, reading property");
      const object = Types.FinalExecutionStatus.read(reader);
      _status = object;
      _statusSet = true;
      reader.context().pop();
    }
    else if (field == "transaction") {
      reader.context().push(field, "Types.Transaction", "type found, reading property");
      const object = Types.Transaction.read(reader);
      _transaction = object;
      _transactionSet = true;
      reader.context().pop();
    }
    else if (field == "transaction_outcome") {
      reader.context().push(field, "Types.ExecutionOutcomeWithId", "type found, reading property");
      const object = Types.ExecutionOutcomeWithId.read(reader);
      _transaction_outcome = object;
      _transaction_outcomeSet = true;
      reader.context().pop();
    }
    else if (field == "receipts_outcome") {
      reader.context().push(field, "Array<Types.ExecutionOutcomeWithId>", "type found, reading property");
      _receipts_outcome = reader.readArray((reader: Read): Types.ExecutionOutcomeWithId => {
        const object = Types.ExecutionOutcomeWithId.read(reader);
        return object;
      });
      _receipts_outcomeSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_status || !_statusSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'status: FinalExecutionStatus'"));
  }
  if (!_transaction || !_transactionSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'transaction: Transaction'"));
  }
  if (!_transaction_outcome || !_transaction_outcomeSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'transaction_outcome: ExecutionOutcomeWithId'"));
  }
  if (!_receipts_outcomeSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'receipts_outcome: [ExecutionOutcomeWithId]'"));
  }

  return {
    status: _status,
    transaction: _transaction,
    transaction_outcome: _transaction_outcome,
    receipts_outcome: _receipts_outcome
  };
}
