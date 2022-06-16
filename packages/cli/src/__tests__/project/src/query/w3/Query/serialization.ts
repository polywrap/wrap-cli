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
import * as Types from "..";

export class Input_getData {
  address: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetDataArgs(argsBuf: ArrayBuffer): Input_getData {
  const context: Context =  new Context("Deserializing module-type: getData");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }

  return {
    address: _address,
    connection: _connection
  };
}

export function serializegetDataResult(result: u32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getData");
  const sizer = new WriteSizer(sizerContext);
  writegetDataResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetDataResult(encoder, result);
  return buffer;
}

export function writegetDataResult(writer: Write, result: u32): void {
  writer.context().push("getData", "u32", "writing property");
  writer.writeUInt32(result);
  writer.context().pop();
}
