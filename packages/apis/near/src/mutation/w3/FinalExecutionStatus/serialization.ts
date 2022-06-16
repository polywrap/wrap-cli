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
import { FinalExecutionStatus } from "./";
import * as Types from "..";

export function serializeFinalExecutionStatus(type: FinalExecutionStatus): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: FinalExecutionStatus");
  const sizer = new WriteSizer(sizerContext);
  writeFinalExecutionStatus(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: FinalExecutionStatus");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeFinalExecutionStatus(encoder, type);
  return buffer;
}

export function writeFinalExecutionStatus(writer: Write, type: FinalExecutionStatus): void {
  writer.writeMapLength(2);
  writer.context().push("successValue", "string | null", "writing property");
  writer.writeString("successValue");
  writer.writeNullableString(type.successValue);
  writer.context().pop();
  writer.context().push("failure", "Types.ExecutionError | null", "writing property");
  writer.writeString("failure");
  if (type.failure) {
    Types.ExecutionError.write(writer, type.failure as Types.ExecutionError);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializeFinalExecutionStatus(buffer: ArrayBuffer): FinalExecutionStatus {
  const context: Context = new Context("Deserializing object-type FinalExecutionStatus");
  const reader = new ReadDecoder(buffer, context);
  return readFinalExecutionStatus(reader);
}

export function readFinalExecutionStatus(reader: Read): FinalExecutionStatus {
  let numFields = reader.readMapLength();

  let _successValue: string | null = null;
  let _failure: Types.ExecutionError | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "successValue") {
      reader.context().push(field, "string | null", "type found, reading property");
      _successValue = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "failure") {
      reader.context().push(field, "Types.ExecutionError | null", "type found, reading property");
      let object: Types.ExecutionError | null = null;
      if (!reader.isNextNil()) {
        object = Types.ExecutionError.read(reader);
      }
      _failure = object;
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    successValue: _successValue,
    failure: _failure
  };
}
