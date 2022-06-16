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
  arg1: BigInt;
  arg2: BigInt | null;
  obj: Types.BigIntInput;
}

export function deserializemethodArgs(argsBuf: ArrayBuffer): Input_method {
  const context: Context =  new Context("Deserializing module-type: method");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _arg1: BigInt = BigInt.fromUInt16(0);
  let _arg1Set: bool = false;
  let _arg2: BigInt | null = null;
  let _obj: Types.BigIntInput | null = null;
  let _objSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "arg1") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _arg1 = reader.readBigInt();
      _arg1Set = true;
      reader.context().pop();
    }
    else if (field == "arg2") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _arg2 = reader.readNullableBigInt();
      reader.context().pop();
    }
    else if (field == "obj") {
      reader.context().push(field, "Types.BigIntInput", "type found, reading property");
      const object = Types.BigIntInput.read(reader);
      _obj = object;
      _objSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_arg1Set) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'arg1: BigInt'"));
  }
  if (!_obj || !_objSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'obj: BigIntInput'"));
  }

  return {
    arg1: _arg1,
    arg2: _arg2,
    obj: _obj
  };
}

export function serializemethodResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method");
  const sizer = new WriteSizer(sizerContext);
  writemethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethodResult(encoder, result);
  return buffer;
}

export function writemethodResult(writer: Write, result: BigInt): void {
  writer.context().push("method", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}
