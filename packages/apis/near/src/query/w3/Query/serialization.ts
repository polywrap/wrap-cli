import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write,
  Nullable,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import * as Types from "..";

export class Input_requestSignIn {
  contractId: string | null;
  methodNames: Array<string> | null;
  successUrl: string | null;
  failureUrl: string | null;
}

export function deserializerequestSignInArgs(argsBuf: ArrayBuffer): Input_requestSignIn {
  const context: Context =  new Context("Deserializing query-type: requestSignIn");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _contractId: string | null = null;
  let _methodNames: Array<string> | null = null;
  let _successUrl: string | null = null;
  let _failureUrl: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "contractId") {
      reader.context().push(field, "string | null", "type found, reading property");
      _contractId = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "methodNames") {
      reader.context().push(field, "Array<string> | null", "type found, reading property");
      _methodNames = reader.readNullableArray((reader: Read): string => {
        return reader.readString();
      });
      reader.context().pop();
    }
    else if (field == "successUrl") {
      reader.context().push(field, "string | null", "type found, reading property");
      _successUrl = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "failureUrl") {
      reader.context().push(field, "string | null", "type found, reading property");
      _failureUrl = reader.readNullableString();
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    contractId: _contractId,
    methodNames: _methodNames,
    successUrl: _successUrl,
    failureUrl: _failureUrl
  };
}

export function serializerequestSignInResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: requestSignIn");
  const sizer = new WriteSizer(sizerContext);
  writerequestSignInResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: requestSignIn");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writerequestSignInResult(encoder, result);
  return buffer;
}

export function writerequestSignInResult(writer: Write, result: bool): void {
  writer.context().push("requestSignIn", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_signOut {
}

export function deserializesignOutArgs(argsBuf: ArrayBuffer): Input_signOut {
  const context: Context =  new Context("Deserializing query-type: signOut");

  return {
  };
}

export function serializesignOutResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: signOut");
  const sizer = new WriteSizer(sizerContext);
  writesignOutResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: signOut");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writesignOutResult(encoder, result);
  return buffer;
}

export function writesignOutResult(writer: Write, result: bool): void {
  writer.context().push("signOut", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_isSignedIn {
}

export function deserializeisSignedInArgs(argsBuf: ArrayBuffer): Input_isSignedIn {
  const context: Context =  new Context("Deserializing query-type: isSignedIn");

  return {
  };
}

export function serializeisSignedInResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: isSignedIn");
  const sizer = new WriteSizer(sizerContext);
  writeisSignedInResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: isSignedIn");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeisSignedInResult(encoder, result);
  return buffer;
}

export function writeisSignedInResult(writer: Write, result: bool): void {
  writer.context().push("isSignedIn", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_getAccountId {
}

export function deserializegetAccountIdArgs(argsBuf: ArrayBuffer): Input_getAccountId {
  const context: Context =  new Context("Deserializing query-type: getAccountId");

  return {
  };
}

export function serializegetAccountIdResult(result: string | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: getAccountId");
  const sizer = new WriteSizer(sizerContext);
  writegetAccountIdResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: getAccountId");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writegetAccountIdResult(encoder, result);
  return buffer;
}

export function writegetAccountIdResult(writer: Write, result: string | null): void {
  writer.context().push("getAccountId", "string | null", "writing property");
  writer.writeNullableString(result);
  writer.context().pop();
}

export class Input_accountState {
}

export function deserializeaccountStateArgs(argsBuf: ArrayBuffer): Input_accountState {
  const context: Context =  new Context("Deserializing query-type: accountState");

  return {
  };
}

export function serializeaccountStateResult(result: Types.AccountView | null): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: accountState");
  const sizer = new WriteSizer(sizerContext);
  writeaccountStateResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: accountState");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeaccountStateResult(encoder, result);
  return buffer;
}

export function writeaccountStateResult(writer: Write, result: Types.AccountView | null): void {
  writer.context().push("accountState", "Types.AccountView | null", "writing property");
  if (result) {
    Types.AccountView.write(writer, result as Types.AccountView);
  } else {
    writer.writeNil();
  }
  writer.context().pop();
}
