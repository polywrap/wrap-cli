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
import { ExecutionOutcomeWithId } from "./";
import * as Types from "..";

export function serializeExecutionOutcomeWithId(type: ExecutionOutcomeWithId): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: ExecutionOutcomeWithId");
  const sizer = new WriteSizer(sizerContext);
  writeExecutionOutcomeWithId(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: ExecutionOutcomeWithId");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeExecutionOutcomeWithId(encoder, type);
  return buffer;
}

export function writeExecutionOutcomeWithId(writer: Write, type: ExecutionOutcomeWithId): void {
  writer.writeMapLength(2);
  writer.context().push("id", "string", "writing property");
  writer.writeString("id");
  writer.writeString(type.id);
  writer.context().pop();
  writer.context().push("outcome", "Types.ExecutionOutcome", "writing property");
  writer.writeString("outcome");
  Types.ExecutionOutcome.write(writer, type.outcome);
  writer.context().pop();
}

export function deserializeExecutionOutcomeWithId(buffer: ArrayBuffer): ExecutionOutcomeWithId {
  const context: Context = new Context("Deserializing object-type ExecutionOutcomeWithId");
  const reader = new ReadDecoder(buffer, context);
  return readExecutionOutcomeWithId(reader);
}

export function readExecutionOutcomeWithId(reader: Read): ExecutionOutcomeWithId {
  let numFields = reader.readMapLength();

  let _id: string = "";
  let _idSet: bool = false;
  let _outcome: Types.ExecutionOutcome | null = null;
  let _outcomeSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "id") {
      reader.context().push(field, "string", "type found, reading property");
      _id = reader.readString();
      _idSet = true;
      reader.context().pop();
    }
    else if (field == "outcome") {
      reader.context().push(field, "Types.ExecutionOutcome", "type found, reading property");
      const object = Types.ExecutionOutcome.read(reader);
      _outcome = object;
      _outcomeSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_idSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'id: String'"));
  }
  if (!_outcome || !_outcomeSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'outcome: ExecutionOutcome'"));
  }

  return {
    id: _id,
    outcome: _outcome
  };
}
