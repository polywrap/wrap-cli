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
import * as Types from "../..";

export class Input_callContractView {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializecallContractViewArgs(input: Input_callContractView): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractView");
  const sizer = new WriteSizer(sizerContext);
  writecallContractViewArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractView");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractViewArgs(encoder, input);
  return buffer;
}

export function writecallContractViewArgs(
  writer: Write,
  input: Input_callContractView
): void {
  writer.writeMapLength(4);
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
}

export function deserializecallContractViewResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: callContractView");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractView", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_callContractStatic {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializecallContractStaticArgs(input: Input_callContractStatic): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: callContractStatic");
  const sizer = new WriteSizer(sizerContext);
  writecallContractStaticArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: callContractStatic");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecallContractStaticArgs(encoder, input);
  return buffer;
}

export function writecallContractStaticArgs(
  writer: Write,
  input: Input_callContractStatic
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

export function deserializecallContractStaticResult(buffer: ArrayBuffer): Types.Ethereum_StaticTxResult {
  const context: Context =  new Context("Deserializing imported module-type: callContractStatic");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("callContractStatic", "Types.Ethereum_StaticTxResult", "reading function output");
  const object = Types.Ethereum_StaticTxResult.read(reader);
  const res: Types.Ethereum_StaticTxResult =  object;
  reader.context().pop();

  return res;
}

export class Input_getBalance {
  address: string;
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializegetBalanceArgs(input: Input_getBalance): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getBalance");
  const sizer = new WriteSizer(sizerContext);
  writegetBalanceArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getBalance");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetBalanceArgs(encoder, input);
  return buffer;
}

export function writegetBalanceArgs(
  writer: Write,
  input: Input_getBalance
): void {
  writer.writeMapLength(3);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(input.address);
  writer.context().pop();
  writer.context().push("blockTag", "BigInt | null", "writing property");
  writer.writeString("blockTag");
  writer.writeNullableBigInt(input.blockTag);
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

export function deserializegetBalanceResult(buffer: ArrayBuffer): BigInt {
  const context: Context =  new Context("Deserializing imported module-type: getBalance");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getBalance", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Input_encodeParams {
  types: Array<string>;
  values: Array<string>;
}

export function serializeencodeParamsArgs(input: Input_encodeParams): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: encodeParams");
  const sizer = new WriteSizer(sizerContext);
  writeencodeParamsArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: encodeParams");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeencodeParamsArgs(encoder, input);
  return buffer;
}

export function writeencodeParamsArgs(
  writer: Write,
  input: Input_encodeParams
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(input.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(input.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializeencodeParamsResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: encodeParams");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("encodeParams", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_encodeFunction {
  method: string;
  args: Array<string> | null;
}

export function serializeencodeFunctionArgs(input: Input_encodeFunction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: encodeFunction");
  const sizer = new WriteSizer(sizerContext);
  writeencodeFunctionArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: encodeFunction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeencodeFunctionArgs(encoder, input);
  return buffer;
}

export function writeencodeFunctionArgs(
  writer: Write,
  input: Input_encodeFunction
): void {
  writer.writeMapLength(2);
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
}

export function deserializeencodeFunctionResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: encodeFunction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("encodeFunction", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_solidityPack {
  types: Array<string>;
  values: Array<string>;
}

export function serializesolidityPackArgs(input: Input_solidityPack): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: solidityPack");
  const sizer = new WriteSizer(sizerContext);
  writesolidityPackArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: solidityPack");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesolidityPackArgs(encoder, input);
  return buffer;
}

export function writesolidityPackArgs(
  writer: Write,
  input: Input_solidityPack
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(input.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(input.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializesolidityPackResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: solidityPack");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("solidityPack", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_solidityKeccak256 {
  types: Array<string>;
  values: Array<string>;
}

export function serializesolidityKeccak256Args(input: Input_solidityKeccak256): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: solidityKeccak256");
  const sizer = new WriteSizer(sizerContext);
  writesolidityKeccak256Args(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: solidityKeccak256");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesolidityKeccak256Args(encoder, input);
  return buffer;
}

export function writesolidityKeccak256Args(
  writer: Write,
  input: Input_solidityKeccak256
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(input.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(input.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializesolidityKeccak256Result(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: solidityKeccak256");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("solidityKeccak256", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_soliditySha256 {
  types: Array<string>;
  values: Array<string>;
}

export function serializesoliditySha256Args(input: Input_soliditySha256): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: soliditySha256");
  const sizer = new WriteSizer(sizerContext);
  writesoliditySha256Args(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: soliditySha256");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesoliditySha256Args(encoder, input);
  return buffer;
}

export function writesoliditySha256Args(
  writer: Write,
  input: Input_soliditySha256
): void {
  writer.writeMapLength(2);
  writer.context().push("types", "Array<string>", "writing property");
  writer.writeString("types");
  writer.writeArray(input.types, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("values", "Array<string>", "writing property");
  writer.writeString("values");
  writer.writeArray(input.values, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}

export function deserializesoliditySha256Result(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: soliditySha256");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("soliditySha256", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_getSignerAddress {
  connection: Types.Ethereum_Connection | null;
}

export function serializegetSignerAddressArgs(input: Input_getSignerAddress): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getSignerAddress");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerAddressArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getSignerAddress");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerAddressArgs(encoder, input);
  return buffer;
}

export function writegetSignerAddressArgs(
  writer: Write,
  input: Input_getSignerAddress
): void {
  writer.writeMapLength(1);
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetSignerAddressResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: getSignerAddress");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getSignerAddress", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_getSignerBalance {
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializegetSignerBalanceArgs(input: Input_getSignerBalance): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getSignerBalance");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerBalanceArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getSignerBalance");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerBalanceArgs(encoder, input);
  return buffer;
}

export function writegetSignerBalanceArgs(
  writer: Write,
  input: Input_getSignerBalance
): void {
  writer.writeMapLength(2);
  writer.context().push("blockTag", "BigInt | null", "writing property");
  writer.writeString("blockTag");
  writer.writeNullableBigInt(input.blockTag);
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

export function deserializegetSignerBalanceResult(buffer: ArrayBuffer): BigInt {
  const context: Context =  new Context("Deserializing imported module-type: getSignerBalance");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getSignerBalance", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Input_getSignerTransactionCount {
  blockTag: BigInt | null;
  connection: Types.Ethereum_Connection | null;
}

export function serializegetSignerTransactionCountArgs(input: Input_getSignerTransactionCount): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getSignerTransactionCount");
  const sizer = new WriteSizer(sizerContext);
  writegetSignerTransactionCountArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getSignerTransactionCount");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetSignerTransactionCountArgs(encoder, input);
  return buffer;
}

export function writegetSignerTransactionCountArgs(
  writer: Write,
  input: Input_getSignerTransactionCount
): void {
  writer.writeMapLength(2);
  writer.context().push("blockTag", "BigInt | null", "writing property");
  writer.writeString("blockTag");
  writer.writeNullableBigInt(input.blockTag);
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

export function deserializegetSignerTransactionCountResult(buffer: ArrayBuffer): BigInt {
  const context: Context =  new Context("Deserializing imported module-type: getSignerTransactionCount");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getSignerTransactionCount", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Input_getGasPrice {
  connection: Types.Ethereum_Connection | null;
}

export function serializegetGasPriceArgs(input: Input_getGasPrice): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getGasPrice");
  const sizer = new WriteSizer(sizerContext);
  writegetGasPriceArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getGasPrice");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetGasPriceArgs(encoder, input);
  return buffer;
}

export function writegetGasPriceArgs(
  writer: Write,
  input: Input_getGasPrice
): void {
  writer.writeMapLength(1);
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetGasPriceResult(buffer: ArrayBuffer): BigInt {
  const context: Context =  new Context("Deserializing imported module-type: getGasPrice");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getGasPrice", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Input_estimateTransactionGas {
  tx: Types.Ethereum_TxRequest;
  connection: Types.Ethereum_Connection | null;
}

export function serializeestimateTransactionGasArgs(input: Input_estimateTransactionGas): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: estimateTransactionGas");
  const sizer = new WriteSizer(sizerContext);
  writeestimateTransactionGasArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: estimateTransactionGas");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeestimateTransactionGasArgs(encoder, input);
  return buffer;
}

export function writeestimateTransactionGasArgs(
  writer: Write,
  input: Input_estimateTransactionGas
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

export function deserializeestimateTransactionGasResult(buffer: ArrayBuffer): BigInt {
  const context: Context =  new Context("Deserializing imported module-type: estimateTransactionGas");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("estimateTransactionGas", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Input_estimateContractCallGas {
  address: string;
  method: string;
  args: Array<string> | null;
  connection: Types.Ethereum_Connection | null;
  txOverrides: Types.Ethereum_TxOverrides | null;
}

export function serializeestimateContractCallGasArgs(input: Input_estimateContractCallGas): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: estimateContractCallGas");
  const sizer = new WriteSizer(sizerContext);
  writeestimateContractCallGasArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: estimateContractCallGas");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeestimateContractCallGasArgs(encoder, input);
  return buffer;
}

export function writeestimateContractCallGasArgs(
  writer: Write,
  input: Input_estimateContractCallGas
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

export function deserializeestimateContractCallGasResult(buffer: ArrayBuffer): BigInt {
  const context: Context =  new Context("Deserializing imported module-type: estimateContractCallGas");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("estimateContractCallGas", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Input_checkAddress {
  address: string;
}

export function serializecheckAddressArgs(input: Input_checkAddress): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: checkAddress");
  const sizer = new WriteSizer(sizerContext);
  writecheckAddressArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: checkAddress");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writecheckAddressArgs(encoder, input);
  return buffer;
}

export function writecheckAddressArgs(
  writer: Write,
  input: Input_checkAddress
): void {
  writer.writeMapLength(1);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(input.address);
  writer.context().pop();
}

export function deserializecheckAddressResult(buffer: ArrayBuffer): bool {
  const context: Context =  new Context("Deserializing imported module-type: checkAddress");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("checkAddress", "bool", "reading function output");
  const res: bool = reader.readBool();
  reader.context().pop();

  return res;
}

export class Input_toWei {
  eth: string;
}

export function serializetoWeiArgs(input: Input_toWei): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: toWei");
  const sizer = new WriteSizer(sizerContext);
  writetoWeiArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: toWei");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetoWeiArgs(encoder, input);
  return buffer;
}

export function writetoWeiArgs(
  writer: Write,
  input: Input_toWei
): void {
  writer.writeMapLength(1);
  writer.context().push("eth", "string", "writing property");
  writer.writeString("eth");
  writer.writeString(input.eth);
  writer.context().pop();
}

export function deserializetoWeiResult(buffer: ArrayBuffer): BigInt {
  const context: Context =  new Context("Deserializing imported module-type: toWei");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("toWei", "BigInt", "reading function output");
  const res: BigInt = reader.readBigInt();
  reader.context().pop();

  return res;
}

export class Input_toEth {
  wei: BigInt;
}

export function serializetoEthArgs(input: Input_toEth): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: toEth");
  const sizer = new WriteSizer(sizerContext);
  writetoEthArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: toEth");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetoEthArgs(encoder, input);
  return buffer;
}

export function writetoEthArgs(
  writer: Write,
  input: Input_toEth
): void {
  writer.writeMapLength(1);
  writer.context().push("wei", "BigInt", "writing property");
  writer.writeString("wei");
  writer.writeBigInt(input.wei);
  writer.context().pop();
}

export function deserializetoEthResult(buffer: ArrayBuffer): string {
  const context: Context =  new Context("Deserializing imported module-type: toEth");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("toEth", "string", "reading function output");
  const res: string = reader.readString();
  reader.context().pop();

  return res;
}

export class Input_awaitTransaction {
  txHash: string;
  confirmations: u32;
  timeout: u32;
  connection: Types.Ethereum_Connection | null;
}

export function serializeawaitTransactionArgs(input: Input_awaitTransaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: awaitTransaction");
  const sizer = new WriteSizer(sizerContext);
  writeawaitTransactionArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: awaitTransaction");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeawaitTransactionArgs(encoder, input);
  return buffer;
}

export function writeawaitTransactionArgs(
  writer: Write,
  input: Input_awaitTransaction
): void {
  writer.writeMapLength(4);
  writer.context().push("txHash", "string", "writing property");
  writer.writeString("txHash");
  writer.writeString(input.txHash);
  writer.context().pop();
  writer.context().push("confirmations", "u32", "writing property");
  writer.writeString("confirmations");
  writer.writeUInt32(input.confirmations);
  writer.context().pop();
  writer.context().push("timeout", "u32", "writing property");
  writer.writeString("timeout");
  writer.writeUInt32(input.timeout);
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

export function deserializeawaitTransactionResult(buffer: ArrayBuffer): Types.Ethereum_TxReceipt {
  const context: Context =  new Context("Deserializing imported module-type: awaitTransaction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("awaitTransaction", "Types.Ethereum_TxReceipt", "reading function output");
  const object = Types.Ethereum_TxReceipt.read(reader);
  const res: Types.Ethereum_TxReceipt =  object;
  reader.context().pop();

  return res;
}

export class Input_waitForEvent {
  address: string;
  event: string;
  args: Array<string> | null;
  timeout: Nullable<u32>;
  connection: Types.Ethereum_Connection | null;
}

export function serializewaitForEventArgs(input: Input_waitForEvent): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: waitForEvent");
  const sizer = new WriteSizer(sizerContext);
  writewaitForEventArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: waitForEvent");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writewaitForEventArgs(encoder, input);
  return buffer;
}

export function writewaitForEventArgs(
  writer: Write,
  input: Input_waitForEvent
): void {
  writer.writeMapLength(5);
  writer.context().push("address", "string", "writing property");
  writer.writeString("address");
  writer.writeString(input.address);
  writer.context().pop();
  writer.context().push("event", "string", "writing property");
  writer.writeString("event");
  writer.writeString(input.event);
  writer.context().pop();
  writer.context().push("args", "Array<string> | null", "writing property");
  writer.writeString("args");
  writer.writeNullableArray(input.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("timeout", "Nullable<u32>", "writing property");
  writer.writeString("timeout");
  writer.writeNullableUInt32(input.timeout);
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

export function deserializewaitForEventResult(buffer: ArrayBuffer): Types.Ethereum_EventNotification {
  const context: Context =  new Context("Deserializing imported module-type: waitForEvent");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("waitForEvent", "Types.Ethereum_EventNotification", "reading function output");
  const object = Types.Ethereum_EventNotification.read(reader);
  const res: Types.Ethereum_EventNotification =  object;
  reader.context().pop();

  return res;
}

export class Input_getNetwork {
  connection: Types.Ethereum_Connection | null;
}

export function serializegetNetworkArgs(input: Input_getNetwork): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported module-type: getNetwork");
  const sizer = new WriteSizer(sizerContext);
  writegetNetworkArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported module-type: getNetwork");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetNetworkArgs(encoder, input);
  return buffer;
}

export function writegetNetworkArgs(
  writer: Write,
  input: Input_getNetwork
): void {
  writer.writeMapLength(1);
  writer.context().push("connection", "Types.Ethereum_Connection | null", "writing property");
  writer.writeString("connection");
  if (input.connection) {
    Types.Ethereum_Connection.write(writer, input.connection as Types.Ethereum_Connection);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}

export function deserializegetNetworkResult(buffer: ArrayBuffer): Types.Ethereum_Network {
  const context: Context =  new Context("Deserializing imported module-type: getNetwork");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getNetwork", "Types.Ethereum_Network", "reading function output");
  const object = Types.Ethereum_Network.read(reader);
  const res: Types.Ethereum_Network =  object;
  reader.context().pop();

  return res;
}
