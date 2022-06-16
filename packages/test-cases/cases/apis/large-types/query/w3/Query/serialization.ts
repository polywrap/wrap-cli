import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@web3api/wasm-as";
import * as Types from "..";

export class Input_method {
  largeCollection: Types.LargeCollection;
}

export function deserializemethodArgs(argsBuf: ArrayBuffer): Input_method {
  const context: Context =  new Context("Deserializing module-type: method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _largeCollection: Types.LargeCollection | null = null;
  let _largeCollectionSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "largeCollection") {
      reader.context().push(field, "Types.LargeCollection", "type found, reading property");
      const object = Types.LargeCollection.read(reader);
      _largeCollection = object;
      _largeCollectionSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_largeCollection || !_largeCollectionSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'largeCollection: LargeCollection'"));
  }

  return {
    largeCollection: _largeCollection
  };
}

export function serializemethodResult(result: Types.LargeCollection): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method");
  const sizer = new WriteSizer(sizerContext);
  writemethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodResult(encoder, result);
  return buffer;
}

export function writemethodResult(writer: Write, result: Types.LargeCollection): void {
  writer.context().push("method", "Types.LargeCollection", "writing property");
  Types.LargeCollection.write(writer, result);
  writer.context().pop();
}
