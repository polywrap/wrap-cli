import {
  Nullable,
  Write,
  WriteSizer,
  WriteEncoder,
  ReadDecoder,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import * as Types from "../..";

export class Input_requestSignIn {
  contractId: string | null;
  methodNames: Array<string> | null;
  successUrl: string | null;
  failureUrl: string | null;
}

export function serializerequestSignInArgs(input: Input_requestSignIn): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: requestSignIn");
  const sizer = new WriteSizer(sizerContext);
  writerequestSignInArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: requestSignIn");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writerequestSignInArgs(encoder, input);
  return buffer;
}

export function writerequestSignInArgs(
  writer: Write,
  input: Input_requestSignIn
): void {
  writer.writeMapLength(4);
  writer.context().push("contractId", "string | null", "writing property");
  writer.writeString("contractId");
  writer.writeNullableString(input.contractId);
  writer.context().pop();
  writer.context().push("methodNames", "Array<string> | null", "writing property");
  writer.writeString("methodNames");
  writer.writeNullableArray(input.methodNames, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
  writer.context().push("successUrl", "string | null", "writing property");
  writer.writeString("successUrl");
  writer.writeNullableString(input.successUrl);
  writer.context().pop();
  writer.context().push("failureUrl", "string | null", "writing property");
  writer.writeString("failureUrl");
  writer.writeNullableString(input.failureUrl);
  writer.context().pop();
}

export function deserializerequestSignInResult(buffer: ArrayBuffer): bool {
  const context: Context =  new Context("Deserializing imported query-type: requestSignIn");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("requestSignIn", "bool", "reading function output");
  const res: bool = reader.readBool();
  reader.context().pop();

  return res;
}

export class Input_signOut {
}

export function serializesignOutArgs(input: Input_signOut): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: signOut");
  const sizer = new WriteSizer(sizerContext);
  writesignOutArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: signOut");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writesignOutArgs(encoder, input);
  return buffer;
}

export function writesignOutArgs(
  writer: Write,
  input: Input_signOut
): void {
  writer.writeMapLength(0);
}

export function deserializesignOutResult(buffer: ArrayBuffer): bool {
  const context: Context =  new Context("Deserializing imported query-type: signOut");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("signOut", "bool", "reading function output");
  const res: bool = reader.readBool();
  reader.context().pop();

  return res;
}

export class Input_isSignedIn {
}

export function serializeisSignedInArgs(input: Input_isSignedIn): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: isSignedIn");
  const sizer = new WriteSizer(sizerContext);
  writeisSignedInArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: isSignedIn");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeisSignedInArgs(encoder, input);
  return buffer;
}

export function writeisSignedInArgs(
  writer: Write,
  input: Input_isSignedIn
): void {
  writer.writeMapLength(0);
}

export function deserializeisSignedInResult(buffer: ArrayBuffer): bool {
  const context: Context =  new Context("Deserializing imported query-type: isSignedIn");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("isSignedIn", "bool", "reading function output");
  const res: bool = reader.readBool();
  reader.context().pop();

  return res;
}

export class Input_getAccountId {
}

export function serializegetAccountIdArgs(input: Input_getAccountId): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: getAccountId");
  const sizer = new WriteSizer(sizerContext);
  writegetAccountIdArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: getAccountId");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writegetAccountIdArgs(encoder, input);
  return buffer;
}

export function writegetAccountIdArgs(
  writer: Write,
  input: Input_getAccountId
): void {
  writer.writeMapLength(0);
}

export function deserializegetAccountIdResult(buffer: ArrayBuffer): string | null {
  const context: Context =  new Context("Deserializing imported query-type: getAccountId");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("getAccountId", "string | null", "reading function output");
  const res: string | null = reader.readNullableString();
  reader.context().pop();

  return res;
}

export class Input_accountState {
}

export function serializeaccountStateArgs(input: Input_accountState): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: accountState");
  const sizer = new WriteSizer(sizerContext);
  writeaccountStateArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: accountState");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeaccountStateArgs(encoder, input);
  return buffer;
}

export function writeaccountStateArgs(
  writer: Write,
  input: Input_accountState
): void {
  writer.writeMapLength(0);
}

export function deserializeaccountStateResult(buffer: ArrayBuffer): Types.Near_AccountView | null {
  const context: Context =  new Context("Deserializing imported query-type: accountState");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("accountState", "Types.Near_AccountView | null", "reading function output");
  let object: Types.Near_AccountView | null = null;
  if (!reader.isNextNil()) {
    object = Types.Near_AccountView.read(reader);
  }
  const res: Types.Near_AccountView | null =  object;
  reader.context().pop();

  return res;
}

export class Input_createTransaction {
  senderId: string;
  receiverId: string;
  actions: Array<Types.Near_Action>;
}

export function serializecreateTransactionArgs(input: Input_createTransaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: createTransaction");
  const sizer = new WriteSizer(sizerContext);
  writecreateTransactionArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: createTransaction");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writecreateTransactionArgs(encoder, input);
  return buffer;
}

export function writecreateTransactionArgs(
  writer: Write,
  input: Input_createTransaction
): void {
  writer.writeMapLength(3);
  writer.context().push("senderId", "string", "writing property");
  writer.writeString("senderId");
  writer.writeString(input.senderId);
  writer.context().pop();
  writer.context().push("receiverId", "string", "writing property");
  writer.writeString("receiverId");
  writer.writeString(input.receiverId);
  writer.context().pop();
  writer.context().push("actions", "Array<Types.Near_Action>", "writing property");
  writer.writeString("actions");
  writer.writeArray(input.actions, (writer: Write, item: Types.Near_Action): void => {
    Types.Near_Action.write(writer, item);
  });
  writer.context().pop();
}

export function deserializecreateTransactionResult(buffer: ArrayBuffer): Types.Near_Transaction {
  const context: Context =  new Context("Deserializing imported query-type: createTransaction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("createTransaction", "Types.Near_Transaction", "reading function output");
  const object = Types.Near_Transaction.read(reader);
  const res: Types.Near_Transaction =  object;
  reader.context().pop();

  return res;
}

export class Input_signTransaction {
  transaction: Types.Near_Transaction;
}

export function serializesignTransactionArgs(input: Input_signTransaction): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) imported query-type: signTransaction");
  const sizer = new WriteSizer(sizerContext);
  writesignTransactionArgs(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) imported query-type: signTransaction");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writesignTransactionArgs(encoder, input);
  return buffer;
}

export function writesignTransactionArgs(
  writer: Write,
  input: Input_signTransaction
): void {
  writer.writeMapLength(1);
  writer.context().push("transaction", "Types.Near_Transaction", "writing property");
  writer.writeString("transaction");
  Types.Near_Transaction.write(writer, input.transaction);
  writer.context().pop();
}

export function deserializesignTransactionResult(buffer: ArrayBuffer): Types.Near_SignTransactionResult {
  const context: Context =  new Context("Deserializing imported query-type: signTransaction");
  const reader = new ReadDecoder(buffer, context);

  reader.context().push("signTransaction", "Types.Near_SignTransactionResult", "reading function output");
  const object = Types.Near_SignTransactionResult.read(reader);
  const res: Types.Near_SignTransactionResult =  object;
  reader.context().pop();

  return res;
}
