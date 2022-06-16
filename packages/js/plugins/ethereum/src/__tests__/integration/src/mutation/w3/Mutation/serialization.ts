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

export class Input_callContractMethod {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function deserializecallContractMethodArgs(argsBuf: ArrayBuffer): Input_callContractMethod {
  const context: Context =  new Context("Deserializing module-type: callContractMethod");
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

export function serializecallContractMethodResult(result: Types.Ethereum_TxResponse): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: callContractMethod");
  const sizer = new WriteSizer(sizerContext);
  writecallContractMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: callContractMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractMethodResult(encoder, result);
  return buffer;
}

export function writecallContractMethodResult(writer: Write, result: Types.Ethereum_TxResponse): void {
  writer.context().push("callContractMethod", "Types.Ethereum_TxResponse", "writing property");
  Types.Ethereum_TxResponse.write(writer, result);
  writer.context().pop();
}

export class Input_callContractMethodAndWait {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function deserializecallContractMethodAndWaitArgs(argsBuf: ArrayBuffer): Input_callContractMethodAndWait {
  const context: Context =  new Context("Deserializing module-type: callContractMethodAndWait");
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

export function serializecallContractMethodAndWaitResult(result: Types.Ethereum_TxReceipt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: callContractMethodAndWait");
  const sizer = new WriteSizer(sizerContext);
  writecallContractMethodAndWaitResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: callContractMethodAndWait");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractMethodAndWaitResult(encoder, result);
  return buffer;
}

export function writecallContractMethodAndWaitResult(writer: Write, result: Types.Ethereum_TxReceipt): void {
  writer.context().push("callContractMethodAndWait", "Types.Ethereum_TxReceipt", "writing property");
  Types.Ethereum_TxReceipt.write(writer, result);
  writer.context().pop();
}

export class Input_sendTransaction {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesendTransactionArgs(argsBuf: ArrayBuffer): Input_sendTransaction {
  const context: Context =  new Context("Deserializing module-type: sendTransaction");
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

export function serializesendTransactionResult(result: Types.Ethereum_TxResponse): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: sendTransaction");
  const sizer = new WriteSizer(sizerContext);
  writesendTransactionResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: sendTransaction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendTransactionResult(encoder, result);
  return buffer;
}

export function writesendTransactionResult(writer: Write, result: Types.Ethereum_TxResponse): void {
  writer.context().push("sendTransaction", "Types.Ethereum_TxResponse", "writing property");
  Types.Ethereum_TxResponse.write(writer, result);
  writer.context().pop();
}

export class Input_sendTransactionAndWait {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesendTransactionAndWaitArgs(argsBuf: ArrayBuffer): Input_sendTransactionAndWait {
  const context: Context =  new Context("Deserializing module-type: sendTransactionAndWait");
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

export function serializesendTransactionAndWaitResult(result: Types.Ethereum_TxReceipt): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: sendTransactionAndWait");
  const sizer = new WriteSizer(sizerContext);
  writesendTransactionAndWaitResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: sendTransactionAndWait");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendTransactionAndWaitResult(encoder, result);
  return buffer;
}

export function writesendTransactionAndWaitResult(writer: Write, result: Types.Ethereum_TxReceipt): void {
  writer.context().push("sendTransactionAndWait", "Types.Ethereum_TxReceipt", "writing property");
  Types.Ethereum_TxReceipt.write(writer, result);
  writer.context().pop();
}

export class Input_deployContract {
  abi: string;
  bytecode: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
}

export function deserializedeployContractArgs(argsBuf: ArrayBuffer): Input_deployContract {
  const context: Context =  new Context("Deserializing module-type: deployContract");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _abi: string = "";
  let _abiSet: bool = false;
  let _bytecode: string = "";
  let _bytecodeSet: bool = false;
  let _args: Array<string> | null = null;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "abi") {
      reader.context().push(field, "string", "type found, reading property");
      _abi = reader.readString();
      _abiSet = true;
      reader.context().pop();
    }
    else if (field == "bytecode") {
      reader.context().push(field, "string", "type found, reading property");
      _bytecode = reader.readString();
      _bytecodeSet = true;
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

  if (!_abiSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'abi: String'"));
  }
  if (!_bytecodeSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'bytecode: String'"));
  }

  return {
    abi: _abi,
    bytecode: _bytecode,
    args: _args,
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

export class Input_signMessage {
  message: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesignMessageArgs(argsBuf: ArrayBuffer): Input_signMessage {
  const context: Context =  new Context("Deserializing module-type: signMessage");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _message: string = "";
  let _messageSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "message") {
      reader.context().push(field, "string", "type found, reading property");
      _message = reader.readString();
      _messageSet = true;
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

  if (!_messageSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'message: String'"));
  }

  return {
    message: _message,
    connection: _connection
  };
}

export function serializesignMessageResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: signMessage");
  const sizer = new WriteSizer(sizerContext);
  writesignMessageResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: signMessage");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesignMessageResult(encoder, result);
  return buffer;
}

export function writesignMessageResult(writer: Write, result: string): void {
  writer.context().push("signMessage", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_sendRPC {
  method: string;
  params: Array<string>;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesendRPCArgs(argsBuf: ArrayBuffer): Input_sendRPC {
  const context: Context =  new Context("Deserializing module-type: sendRPC");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _method: string = "";
  let _methodSet: bool = false;
  let _params: Array<string> = [];
  let _paramsSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

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
    else if (field == "params") {
      reader.context().push(field, "Array<string>", "type found, reading property");
      _params = reader.readArray((reader: Read): string => {
        return reader.readString();
      });
      _paramsSet = true;
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

  if (!_methodSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'method: String'"));
  }
  if (!_paramsSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'params: [String]'"));
  }

  return {
    method: _method,
    params: _params,
    connection: _connection
  };
}

export function serializesendRPCResult(result: string | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: sendRPC");
  const sizer = new WriteSizer(sizerContext);
  writesendRPCResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: sendRPC");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendRPCResult(encoder, result);
  return buffer;
}

export function writesendRPCResult(writer: Write, result: string | null): void {
  writer.context().push("sendRPC", "string | null", "writing property");
  writer.writeNullableString(result);
  writer.context().pop();
}
