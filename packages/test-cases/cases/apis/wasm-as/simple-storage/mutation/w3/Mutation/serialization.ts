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

export class Input_setData {
  address: string;
  value: i32;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesetDataArgs(argsBuf: ArrayBuffer): Input_setData {
  const context: Context =  new Context("Deserializing module-type: setData");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _value: i32 = 0;
  let _valueSet: bool = false;
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
    else if (field == "value") {
      reader.context().push(field, "i32", "type found, reading property");
      _value = reader.readInt32();
      _valueSet = true;
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
  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'value: Int'"));
  }

  return {
    address: _address,
    value: _value,
    connection: _connection
  };
}

export function serializesetDataResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: setData");
  const sizer = new WriteSizer(sizerContext);
  writesetDataResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: setData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesetDataResult(encoder, result);
  return buffer;
}

export function writesetDataResult(writer: Write, result: string): void {
  writer.context().push("setData", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_deployContract {
  connection: Types.Ethereum_Connection | null;
}

export function deserializedeployContractArgs(argsBuf: ArrayBuffer): Input_deployContract {
  const context: Context =  new Context("Deserializing module-type: deployContract");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "connection") {
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


  return {
    connection: _connection
  };
}

export function serializedeployContractResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: deployContract");
  const sizer = new WriteSizer(sizerContext);
  writedeployContractResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: deployContract");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writedeployContractResult(encoder, result);
  return buffer;
}

export function writedeployContractResult(writer: Write, result: string): void {
  writer.context().push("deployContract", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}
