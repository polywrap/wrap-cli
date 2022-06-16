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

export class Input_callContractView {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
}

export function deserializecallContractViewArgs(argsBuf: ArrayBuffer): Input_callContractView {
  const context: Context =  new Context("Deserializing module-type: callContractView");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _method: string = "";
  let _methodSet: bool = false;
  let _args: Array<string> | null = null;
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
    else if (field == "method") {
      reader.context().push(field, "string", "type found, reading property");
      _method = reader.readString();
      _methodSet = true;
      reader.context().pop();
    }
    else if (field == "args") {
      reader.context().push(field, "Array<string> | null", "type found, reading property");
      _args = reader.readNullableArray((reader: Read): string => {
        return reader.readString();
      });
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
  if (!_methodSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'method: String'"));
  }

  return {
    address: _address,
    method: _method,
    args: _args,
    connection: _connection
  };
}

export function serializecallContractViewResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: callContractView");
  const sizer = new WriteSizer(sizerContext);
  writecallContractViewResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: callContractView");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractViewResult(encoder, result);
  return buffer;
}

export function writecallContractViewResult(writer: Write, result: string): void {
  writer.context().push("callContractView", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_callContractStatic {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function deserializecallContractStaticArgs(argsBuf: ArrayBuffer): Input_callContractStatic {
  const context: Context =  new Context("Deserializing module-type: callContractStatic");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _method: string = "";
  let _methodSet: bool = false;
  let _args: Array<string> | null = null;
  let _connection: Types.Ethereum_Connection | null = null;
  let _txOverrides: Types.Ethereum_TxOverrides | null = null;

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
    else if (field == "method") {
      reader.context().push(field, "string", "type found, reading property");
      _method = reader.readString();
      _methodSet = true;
      reader.context().pop();
    }
    else if (field == "args") {
      reader.context().push(field, "Array<string> | null", "type found, reading property");
      _args = reader.readNullableArray((reader: Read): string => {
        return reader.readString();
      });
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
    else if (field == "txOverrides") {
      reader.context().push(field, "Types.Ethereum_TxOverrides | null", "type found, reading property");
      let object: Types.Ethereum_TxOverrides | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_TxOverrides.read(reader);
      }
      _txOverrides = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }
  if (!_methodSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'method: String'"));
  }

  return {
    address: _address,
    method: _method,
    args: _args,
    connection: _connection,
    txOverrides: _txOverrides
  };
}

export function serializecallContractStaticResult(result: Types.Ethereum_StaticTxResult): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: callContractStatic");
  const sizer = new WriteSizer(sizerContext);
  writecallContractStaticResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: callContractStatic");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractStaticResult(encoder, result);
  return buffer;
}

export function writecallContractStaticResult(writer: Write, result: Types.Ethereum_StaticTxResult): void {
  writer.context().push("callContractStatic", "Types.Ethereum_StaticTxResult", "writing property");
  Types.Ethereum_StaticTxResult.write(writer, result);
  writer.context().pop();
}

export class Input_getBalance {
  address: string;
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetBalanceArgs(argsBuf: ArrayBuffer): Input_getBalance {
  const context: Context =  new Context("Deserializing module-type: getBalance");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _blockTag: BigInt | null = null;
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
    else if (field == "blockTag") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _blockTag = reader.readNullableBigInt();
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
    blockTag: _blockTag,
    connection: _connection
  };
}

export function serializegetBalanceResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getBalance");
  const sizer = new WriteSizer(sizerContext);
  writegetBalanceResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getBalance");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetBalanceResult(encoder, result);
  return buffer;
}

export function writegetBalanceResult(writer: Write, result: BigInt): void {
  writer.context().push("getBalance", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}

export class Input_encodeParams {
  types: Array<string>;
  values: Array<string>;
}

export function deserializeencodeParamsArgs(argsBuf: ArrayBuffer): Input_encodeParams {
  const context: Context =  new Context("Deserializing module-type: encodeParams");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _types: Array<string> = [];
  let _typesSet: bool = false;
  let _values: Array<string> = [];
  let _valuesSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "types") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _types = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _typesSet = true;
      reader.context().pop();
    }
    else if (field == "values") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _values = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _valuesSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_typesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'types: [String]'"));
  }
  if (!_valuesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'values: [String]'"));
  }

  return {
    types: _types,
    values: _values
  };
}

export function serializeencodeParamsResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: encodeParams");
  const sizer = new WriteSizer(sizerContext);
  writeencodeParamsResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: encodeParams");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeencodeParamsResult(encoder, result);
  return buffer;
}

export function writeencodeParamsResult(writer: Write, result: string): void {
  writer.context().push("encodeParams", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_encodeFunction {
  method: string;
  args: Array<string> | null;
}

export function deserializeencodeFunctionArgs(argsBuf: ArrayBuffer): Input_encodeFunction {
  const context: Context =  new Context("Deserializing module-type: encodeFunction");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _method: string = "";
  let _methodSet: bool = false;
  let _args: Array<string> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "method") {
      reader.context().push(field, "string", "type found, reading property");
      _method = reader.readString();
      _methodSet = true;
      reader.context().pop();
    }
    else if (field == "args") {
      reader.context().push(field, "Array<string> | null", "type found, reading property");
      _args = reader.readNullableArray((reader: Read): string => {
        return reader.readString();
      });
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_methodSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'method: String'"));
  }

  return {
    method: _method,
    args: _args
  };
}

export function serializeencodeFunctionResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: encodeFunction");
  const sizer = new WriteSizer(sizerContext);
  writeencodeFunctionResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: encodeFunction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeencodeFunctionResult(encoder, result);
  return buffer;
}

export function writeencodeFunctionResult(writer: Write, result: string): void {
  writer.context().push("encodeFunction", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_solidityPack {
  types: Array<string>;
  values: Array<string>;
}

export function deserializesolidityPackArgs(argsBuf: ArrayBuffer): Input_solidityPack {
  const context: Context =  new Context("Deserializing module-type: solidityPack");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _types: Array<string> = [];
  let _typesSet: bool = false;
  let _values: Array<string> = [];
  let _valuesSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "types") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _types = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _typesSet = true;
      reader.context().pop();
    }
    else if (field == "values") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _values = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _valuesSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_typesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'types: [String]'"));
  }
  if (!_valuesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'values: [String]'"));
  }

  return {
    types: _types,
    values: _values
  };
}

export function serializesolidityPackResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: solidityPack");
  const sizer = new WriteSizer(sizerContext);
  writesolidityPackResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: solidityPack");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesolidityPackResult(encoder, result);
  return buffer;
}

export function writesolidityPackResult(writer: Write, result: string): void {
  writer.context().push("solidityPack", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_solidityKeccak256 {
  types: Array<string>;
  values: Array<string>;
}

export function deserializesolidityKeccak256Args(argsBuf: ArrayBuffer): Input_solidityKeccak256 {
  const context: Context =  new Context("Deserializing module-type: solidityKeccak256");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _types: Array<string> = [];
  let _typesSet: bool = false;
  let _values: Array<string> = [];
  let _valuesSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "types") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _types = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _typesSet = true;
      reader.context().pop();
    }
    else if (field == "values") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _values = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _valuesSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_typesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'types: [String]'"));
  }
  if (!_valuesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'values: [String]'"));
  }

  return {
    types: _types,
    values: _values
  };
}

export function serializesolidityKeccak256Result(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: solidityKeccak256");
  const sizer = new WriteSizer(sizerContext);
  writesolidityKeccak256Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: solidityKeccak256");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesolidityKeccak256Result(encoder, result);
  return buffer;
}

export function writesolidityKeccak256Result(writer: Write, result: string): void {
  writer.context().push("solidityKeccak256", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_soliditySha256 {
  types: Array<string>;
  values: Array<string>;
}

export function deserializesoliditySha256Args(argsBuf: ArrayBuffer): Input_soliditySha256 {
  const context: Context =  new Context("Deserializing module-type: soliditySha256");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _types: Array<string> = [];
  let _typesSet: bool = false;
  let _values: Array<string> = [];
  let _valuesSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "types") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _types = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _typesSet = true;
      reader.context().pop();
    }
    else if (field == "values") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _values = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _valuesSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_typesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'types: [String]'"));
  }
  if (!_valuesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'values: [String]'"));
  }

  return {
    types: _types,
    values: _values
  };
}

export function serializesoliditySha256Result(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: soliditySha256");
  const sizer = new WriteSizer(sizerContext);
  writesoliditySha256Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: soliditySha256");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesoliditySha256Result(encoder, result);
  return buffer;
}

export function writesoliditySha256Result(writer: Write, result: string): void {
  writer.context().push("soliditySha256", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_getSignerAddress {
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetSignerAddressArgs(argsBuf: ArrayBuffer): Input_getSignerAddress {
  const context: Context =  new Context("Deserializing module-type: getSignerAddress");
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

export function serializegetSignerAddressResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getSignerAddress");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerAddressResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getSignerAddress");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerAddressResult(encoder, result);
  return buffer;
}

export function writegetSignerAddressResult(writer: Write, result: string): void {
  writer.context().push("getSignerAddress", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_getSignerBalance {
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetSignerBalanceArgs(argsBuf: ArrayBuffer): Input_getSignerBalance {
  const context: Context =  new Context("Deserializing module-type: getSignerBalance");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _blockTag: BigInt | null = null;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "blockTag") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _blockTag = reader.readNullableBigInt();
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


  return {
    blockTag: _blockTag,
    connection: _connection
  };
}

export function serializegetSignerBalanceResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getSignerBalance");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerBalanceResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getSignerBalance");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerBalanceResult(encoder, result);
  return buffer;
}

export function writegetSignerBalanceResult(writer: Write, result: BigInt): void {
  writer.context().push("getSignerBalance", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}

export class Input_getSignerTransactionCount {
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetSignerTransactionCountArgs(argsBuf: ArrayBuffer): Input_getSignerTransactionCount {
  const context: Context =  new Context("Deserializing module-type: getSignerTransactionCount");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _blockTag: BigInt | null = null;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "blockTag") {
      reader.context().push(field, "BigInt | null", "type found, reading property");
      _blockTag = reader.readNullableBigInt();
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


  return {
    blockTag: _blockTag,
    connection: _connection
  };
}

export function serializegetSignerTransactionCountResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getSignerTransactionCount");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerTransactionCountResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getSignerTransactionCount");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerTransactionCountResult(encoder, result);
  return buffer;
}

export function writegetSignerTransactionCountResult(writer: Write, result: BigInt): void {
  writer.context().push("getSignerTransactionCount", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}

export class Input_getGasPrice {
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetGasPriceArgs(argsBuf: ArrayBuffer): Input_getGasPrice {
  const context: Context =  new Context("Deserializing module-type: getGasPrice");
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

export function serializegetGasPriceResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getGasPrice");
  const sizer = new WriteSizer(sizerContext);
  writegetGasPriceResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getGasPrice");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetGasPriceResult(encoder, result);
  return buffer;
}

export function writegetGasPriceResult(writer: Write, result: BigInt): void {
  writer.context().push("getGasPrice", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}

export class Input_estimateTransactionGas {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function deserializeestimateTransactionGasArgs(argsBuf: ArrayBuffer): Input_estimateTransactionGas {
  const context: Context =  new Context("Deserializing module-type: estimateTransactionGas");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _tx: Types.Ethereum_TxRequest | null = null;
  let _txSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "tx") {
      reader.context().push(field, "Types.Ethereum_TxRequest", "type found, reading property");
      const object = Types.Ethereum_TxRequest.read(reader);
      _tx = object;
      _txSet = true;
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

  if (!_tx || !_txSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'tx: Ethereum_TxRequest'"));
  }

  return {
    tx: _tx,
    connection: _connection
  };
}

export function serializeestimateTransactionGasResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: estimateTransactionGas");
  const sizer = new WriteSizer(sizerContext);
  writeestimateTransactionGasResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: estimateTransactionGas");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeestimateTransactionGasResult(encoder, result);
  return buffer;
}

export function writeestimateTransactionGasResult(writer: Write, result: BigInt): void {
  writer.context().push("estimateTransactionGas", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}

export class Input_estimateContractCallGas {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function deserializeestimateContractCallGasArgs(argsBuf: ArrayBuffer): Input_estimateContractCallGas {
  const context: Context =  new Context("Deserializing module-type: estimateContractCallGas");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _method: string = "";
  let _methodSet: bool = false;
  let _args: Array<string> | null = null;
  let _connection: Types.Ethereum_Connection | null = null;
  let _txOverrides: Types.Ethereum_TxOverrides | null = null;

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
    else if (field == "method") {
      reader.context().push(field, "string", "type found, reading property");
      _method = reader.readString();
      _methodSet = true;
      reader.context().pop();
    }
    else if (field == "args") {
      reader.context().push(field, "Array<string> | null", "type found, reading property");
      _args = reader.readNullableArray((reader: Read): string => {
        return reader.readString();
      });
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
    else if (field == "txOverrides") {
      reader.context().push(field, "Types.Ethereum_TxOverrides | null", "type found, reading property");
      let object: Types.Ethereum_TxOverrides | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_TxOverrides.read(reader);
      }
      _txOverrides = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }
  if (!_methodSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'method: String'"));
  }

  return {
    address: _address,
    method: _method,
    args: _args,
    connection: _connection,
    txOverrides: _txOverrides
  };
}

export function serializeestimateContractCallGasResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: estimateContractCallGas");
  const sizer = new WriteSizer(sizerContext);
  writeestimateContractCallGasResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: estimateContractCallGas");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeestimateContractCallGasResult(encoder, result);
  return buffer;
}

export function writeestimateContractCallGasResult(writer: Write, result: BigInt): void {
  writer.context().push("estimateContractCallGas", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}

export class Input_checkAddress {
  address: string;
}

export function deserializecheckAddressArgs(argsBuf: ArrayBuffer): Input_checkAddress {
  const context: Context =  new Context("Deserializing module-type: checkAddress");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;

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
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }

  return {
    address: _address
  };
}

export function serializecheckAddressResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: checkAddress");
  const sizer = new WriteSizer(sizerContext);
  writecheckAddressResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: checkAddress");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecheckAddressResult(encoder, result);
  return buffer;
}

export function writecheckAddressResult(writer: Write, result: bool): void {
  writer.context().push("checkAddress", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_toWei {
  eth: string;
}

export function deserializetoWeiArgs(argsBuf: ArrayBuffer): Input_toWei {
  const context: Context =  new Context("Deserializing module-type: toWei");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _eth: string = "";
  let _ethSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "eth") {
      reader.context().push(field, "string", "type found, reading property");
      _eth = reader.readString();
      _ethSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_ethSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'eth: String'"));
  }

  return {
    eth: _eth
  };
}

export function serializetoWeiResult(result: BigInt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: toWei");
  const sizer = new WriteSizer(sizerContext);
  writetoWeiResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: toWei");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetoWeiResult(encoder, result);
  return buffer;
}

export function writetoWeiResult(writer: Write, result: BigInt): void {
  writer.context().push("toWei", "BigInt", "writing property");
  writer.writeBigInt(result);
  writer.context().pop();
}

export class Input_toEth {
  wei: BigInt;
}

export function deserializetoEthArgs(argsBuf: ArrayBuffer): Input_toEth {
  const context: Context =  new Context("Deserializing module-type: toEth");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _wei: BigInt = BigInt.fromUInt16(0);
  let _weiSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "wei") {
      reader.context().push(field, "BigInt", "type found, reading property");
      _wei = reader.readBigInt();
      _weiSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_weiSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'wei: BigInt'"));
  }

  return {
    wei: _wei
  };
}

export function serializetoEthResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: toEth");
  const sizer = new WriteSizer(sizerContext);
  writetoEthResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: toEth");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetoEthResult(encoder, result);
  return buffer;
}

export function writetoEthResult(writer: Write, result: string): void {
  writer.context().push("toEth", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_awaitTransaction {
  txHash: string;
  confirmations: u32;
  timeout: u32;
  connection: Types.Ethereum_Connection | null;
}

export function deserializeawaitTransactionArgs(argsBuf: ArrayBuffer): Input_awaitTransaction {
  const context: Context =  new Context("Deserializing module-type: awaitTransaction");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _txHash: string = "";
  let _txHashSet: bool = false;
  let _confirmations: u32 = 0;
  let _confirmationsSet: bool = false;
  let _timeout: u32 = 0;
  let _timeoutSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "txHash") {
      reader.context().push(field, "string", "type found, reading property");
      _txHash = reader.readString();
      _txHashSet = true;
      reader.context().pop();
    }
    else if (field == "confirmations") {
      reader.context().push(field, "u32", "type found, reading property");
      _confirmations = reader.readUInt32();
      _confirmationsSet = true;
      reader.context().pop();
    }
    else if (field == "timeout") {
      reader.context().push(field, "u32", "type found, reading property");
      _timeout = reader.readUInt32();
      _timeoutSet = true;
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

  if (!_txHashSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'txHash: String'"));
  }
  if (!_confirmationsSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'confirmations: UInt32'"));
  }
  if (!_timeoutSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'timeout: UInt32'"));
  }

  return {
    txHash: _txHash,
    confirmations: _confirmations,
    timeout: _timeout,
    connection: _connection
  };
}

export function serializeawaitTransactionResult(result: Types.Ethereum_TxReceipt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: awaitTransaction");
  const sizer = new WriteSizer(sizerContext);
  writeawaitTransactionResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: awaitTransaction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeawaitTransactionResult(encoder, result);
  return buffer;
}

export function writeawaitTransactionResult(writer: Write, result: Types.Ethereum_TxReceipt): void {
  writer.context().push("awaitTransaction", "Types.Ethereum_TxReceipt", "writing property");
  Types.Ethereum_TxReceipt.write(writer, result);
  writer.context().pop();
}

export class Input_waitForEvent {
  address: string;
  event: string;
  args: Array<string> | null;
  timeout: Nullable<u32>;
  connection: Types.Ethereum_Connection | null;
}

export function deserializewaitForEventArgs(argsBuf: ArrayBuffer): Input_waitForEvent {
  const context: Context =  new Context("Deserializing module-type: waitForEvent");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _event: string = "";
  let _eventSet: bool = false;
  let _args: Array<string> | null = null;
  let _timeout: Nullable<u32> = new Nullable<u32>();
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
    else if (field == "event") {
      reader.context().push(field, "string", "type found, reading property");
      _event = reader.readString();
      _eventSet = true;
      reader.context().pop();
    }
    else if (field == "args") {
      reader.context().push(field, "Array<string> | null", "type found, reading property");
      _args = reader.readNullableArray((reader: Read): string => {
        return reader.readString();
      });
      reader.context().pop();
    }
    else if (field == "timeout") {
      reader.context().push(field, "Nullable<u32>", "type found, reading property");
      _timeout = reader.readNullableUInt32();
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
  if (!_eventSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'event: String'"));
  }

  return {
    address: _address,
    event: _event,
    args: _args,
    timeout: _timeout,
    connection: _connection
  };
}

export function serializewaitForEventResult(result: Types.Ethereum_EventNotification): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: waitForEvent");
  const sizer = new WriteSizer(sizerContext);
  writewaitForEventResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: waitForEvent");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writewaitForEventResult(encoder, result);
  return buffer;
}

export function writewaitForEventResult(writer: Write, result: Types.Ethereum_EventNotification): void {
  writer.context().push("waitForEvent", "Types.Ethereum_EventNotification", "writing property");
  Types.Ethereum_EventNotification.write(writer, result);
  writer.context().pop();
}

export class Input_getNetwork {
  connection: Types.Ethereum_Connection | null;
}

export function deserializegetNetworkArgs(argsBuf: ArrayBuffer): Input_getNetwork {
  const context: Context =  new Context("Deserializing module-type: getNetwork");
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

export function serializegetNetworkResult(result: Types.Ethereum_Network): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getNetwork");
  const sizer = new WriteSizer(sizerContext);
  writegetNetworkResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getNetwork");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetNetworkResult(encoder, result);
  return buffer;
}

export function writegetNetworkResult(writer: Write, result: Types.Ethereum_Network): void {
  writer.context().push("getNetwork", "Types.Ethereum_Network", "writing property");
  Types.Ethereum_Network.write(writer, result);
  writer.context().pop();
}
