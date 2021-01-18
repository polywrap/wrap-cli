import {
  Read,
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write
} from "@web3api/wasm-as";

export class Input_queryMethod {
  arg: string;
}

export function deserializequeryMethodArgs(argsBuf: ArrayBuffer): Input_queryMethod {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _arg: string = "";
  var _argSet: boolean = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "arg") {
      _arg = reader.readString();
      _argSet = true;
    }
  }

  if (!_argSet) {
    throw Error("Missing required argument \"arg: String\"");
  }

  return {
    arg: _arg
  };
}

export function serializequeryMethodResult(result: i32): ArrayBuffer {
  const sizer = new WriteSizer();
  writequeryMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writequeryMethodResult(encoder, result);
  return buffer;
}

function writequeryMethodResult(writer: Write, result: i32): void {
  writer.writeInt32(result);
}
