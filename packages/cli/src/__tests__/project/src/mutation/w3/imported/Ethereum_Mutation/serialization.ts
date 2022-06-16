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
import * as Types from "../..";

export class Input_callContractMethod {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializecallContractMethodArgs(input: Input_callContractMethod): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractMethod");
  const sizer = new WriteSizer(sizerContext);
  writecallContractMethodArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractMethodArgs(encoder, input);
  return buffer;
}

export function writecallContractMethodArgs(
  writer: Write,
  input: Input_callContractMethod
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(input.address);
  writer.context().pop();
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(input.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeNullableArray(input.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("txOverrides", "Types.Ethereum_TxOverrides | null", "writing property");
  writer.writeString("txOverrides");
  if (input.txOverrides) {
    Types.Ethereum_TxOverrides.write(writer, input.txOverrides as Types.Ethereum_TxOverrides);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializecallContractMethodResult(buffer: ArrayBuffer): Types.Ethereum_TxResponse {
  const context: Context =  new Context("Deserializing imported module-type: callContractMethod");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractMethod", "Types.Ethereum_TxResponse", "reading function output");
  const object = Types.Ethereum_TxResponse.read(reader);
  const res: Types.Ethereum_TxResponse =  object;
  reader.context().pop();

  return res;
}

export class Input_callContractMethodAndWait {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializecallContractMethodAndWaitArgs(input: Input_callContractMethodAndWait): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractMethodAndWait");
  const sizer = new WriteSizer(sizerContext);
  writecallContractMethodAndWaitArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractMethodAndWait");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractMethodAndWaitArgs(encoder, input);
  return buffer;
}

export function writecallContractMethodAndWaitArgs(
  writer: Write,
  input: Input_callContractMethodAndWait
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(input.address);
  writer.context().pop();
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(input.method);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeNullableArray(input.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
  writer.context().push("txOverrides", "Types.Ethereum_TxOverrides | null", "writing property");
  writer.writeString("txOverrides");
  if (input.txOverrides) {
    Types.Ethereum_TxOverrides.write(writer, input.txOverrides as Types.Ethereum_TxOverrides);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializecallContractMethodAndWaitResult(buffer: ArrayBuffer): Types.Ethereum_TxReceipt {
  const context: Context =  new Context("Deserializing imported module-type: callContractMethodAndWait");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractMethodAndWait", "Types.Ethereum_TxReceipt", "reading function output");
  const object = Types.Ethereum_TxReceipt.read(reader);
  const res: Types.Ethereum_TxReceipt =  object;
  reader.context().pop();

  return res;
}

export class Input_sendTransaction {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function serializesendTransactionArgs(input: Input_sendTransaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: sendTransaction");
  const sizer = new WriteSizer(sizerContext);
  writesendTransactionArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: sendTransaction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendTransactionArgs(encoder, input);
  return buffer;
}

export function writesendTransactionArgs(
  writer: Write,
  input: Input_sendTransaction
): void {
  writer.writeMapLength(2);
  writer.context().push("tx", "Types.Ethereum_TxRequest", "writing property");
  writer.writeString("tx");
  Types.Ethereum_TxRequest.write(writer, input.tx);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesendTransactionResult(buffer: ArrayBuffer): Types.Ethereum_TxResponse {
  const context: Context =  new Context("Deserializing imported module-type: sendTransaction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("sendTransaction", "Types.Ethereum_TxResponse", "reading function output");
  const object = Types.Ethereum_TxResponse.read(reader);
  const res: Types.Ethereum_TxResponse =  object;
  reader.context().pop();

  return res;
}

export class Input_sendTransactionAndWait {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function serializesendTransactionAndWaitArgs(input: Input_sendTransactionAndWait): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: sendTransactionAndWait");
  const sizer = new WriteSizer(sizerContext);
  writesendTransactionAndWaitArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: sendTransactionAndWait");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendTransactionAndWaitArgs(encoder, input);
  return buffer;
}

export function writesendTransactionAndWaitArgs(
  writer: Write,
  input: Input_sendTransactionAndWait
): void {
  writer.writeMapLength(2);
  writer.context().push("tx", "Types.Ethereum_TxRequest", "writing property");
  writer.writeString("tx");
  Types.Ethereum_TxRequest.write(writer, input.tx);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesendTransactionAndWaitResult(buffer: ArrayBuffer): Types.Ethereum_TxReceipt {
  const context: Context =  new Context("Deserializing imported module-type: sendTransactionAndWait");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("sendTransactionAndWait", "Types.Ethereum_TxReceipt", "reading function output");
  const object = Types.Ethereum_TxReceipt.read(reader);
  const res: Types.Ethereum_TxReceipt =  object;
  reader.context().pop();

  return res;
}

export class Input_deployContract {
  abi: string;
  bytecode: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializedeployContractArgs(input: Input_deployContract): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: deployContract");
  const sizer = new WriteSizer(sizerContext);
  writedeployContractArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: deployContract");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writedeployContractArgs(encoder, input);
  return buffer;
}

export function writedeployContractArgs(
  writer: Write,
  input: Input_deployContract
): void {
  writer.writeMapLength(4);
  writer.context().push("abi", "string", "writing property");
  writer.writeString("abi");
  writer.writeString(input.abi);
  writer.context().pop();
  writer.context().push("bytecode", "string", "writing property");
  writer.writeString("bytecode");
  writer.writeString(input.bytecode);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeNullableArray(input.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializedeployContractResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: deployContract");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("deployContract", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_signMessage {
  message: string;
  connection: Types.Ethereum_Connection | null;
}

export function serializesignMessageArgs(input: Input_signMessage): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: signMessage");
  const sizer = new WriteSizer(sizerContext);
  writesignMessageArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: signMessage");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesignMessageArgs(encoder, input);
  return buffer;
}

export function writesignMessageArgs(
  writer: Write,
  input: Input_signMessage
): void {
  writer.writeMapLength(2);
  writer.context().push("message", "string", "writing property");
  writer.writeString("message");
  writer.writeString(input.message);
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesignMessageResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: signMessage");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("signMessage", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_sendRPC {
  method: string;
  params: Array<string>;
  connection: Types.Ethereum_Connection | null;
}

export function serializesendRPCArgs(input: Input_sendRPC): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: sendRPC");
  const sizer = new WriteSizer(sizerContext);
  writesendRPCArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: sendRPC");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesendRPCArgs(encoder, input);
  return buffer;
}

export function writesendRPCArgs(
  writer: Write,
  input: Input_sendRPC
): void {
  writer.writeMapLength(3);
  writer.context().push("method", "string", "writing property");
  writer.writeString("method");
  writer.writeString(input.method);
  writer.context().pop();
  writer.context().push("params", "Array<string>", "writing property");
  writer.writeString("params");
  writer.writeArray(input.params, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializesendRPCResult(buffer: ArrayBuffer): string | null {
  const context: Context =  new Context("Deserializing imported module-type: sendRPC");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("sendRPC", "string | null", "reading function output");
  const res: string | null = reader.readNullableString();
  reader.context().pop();

  return res;
}
