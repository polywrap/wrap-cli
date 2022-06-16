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

export class Input_requestSignTransactions {
  transactions: Array<Types.Transaction>;
  callbackUrl: string | null;
  meta: string | null;
}

export function deserializerequestSignTransactionsArgs(argsBuf: ArrayBuffer): Input_requestSignTransactions {
  const context: Context =  new Context("Deserializing query-type: requestSignTransactions");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _transactions: Array<Types.Transaction> = [];
  let _transactionsSet: bool = false;
  let _callbackUrl: string | null = null;
  let _meta: string | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "transactions") {
      reader.context().push(field, "Array<Types.Transaction>", "type found, reading property");
      _transactions = reader.readArray((reader: Read): Types.Transaction => {
        const object = Types.Transaction.read(reader);
        return object;
      });
      _transactionsSet = true;
      reader.context().pop();
    }
    else if (field == "callbackUrl") {
      reader.context().push(field, "string | null", "type found, reading property");
      _callbackUrl = reader.readNullableString();
      reader.context().pop();
    }
    else if (field == "meta") {
      reader.context().push(field, "string | null", "type found, reading property");
      _meta = reader.readNullableString();
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_transactionsSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'transactions: [Transaction]'"));
  }

  return {
    transactions: _transactions,
    callbackUrl: _callbackUrl,
    meta: _meta
  };
}

export function serializerequestSignTransactionsResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) query-type: requestSignTransactions");
  const sizer = new WriteSizer(sizerContext);
  writerequestSignTransactionsResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) query-type: requestSignTransactions");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writerequestSignTransactionsResult(encoder, result);
  return buffer;
}

export function writerequestSignTransactionsResult(writer: Write, result: bool): void {
  writer.context().push("requestSignTransactions", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}
