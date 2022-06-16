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

export class Input_setData {
  options: Types.SetDataOptions;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesetDataArgs(argsBuf: ArrayBuffer): Input_setData {
  const context: Context =  new Context("Deserializing module-type: setData");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _options: Types.SetDataOptions | null = null;
  let _optionsSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "options") {
      reader.context().push(field, "Types.SetDataOptions", "type found, reading property");
      const object = Types.SetDataOptions.read(reader);
      _options = object;
      _optionsSet = true;
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

  if (!_options || !_optionsSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'options: SetDataOptions'"));
  }

  return {
    options: _options,
    connection: _connection
  };
}

export function serializesetDataResult(result: Types.SetDataResult): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: setData");
  const sizer = new WriteSizer(sizerContext);
  writesetDataResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: setData");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesetDataResult(encoder, result);
  return buffer;
}

export function writesetDataResult(writer: Write, result: Types.SetDataResult): void {
  writer.context().push("setData", "Types.SetDataResult", "writing property");
  Types.SetDataResult.write(writer, result);
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
