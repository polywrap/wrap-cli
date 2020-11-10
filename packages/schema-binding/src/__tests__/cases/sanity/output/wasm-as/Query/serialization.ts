import {
  ReadDecoder,
  WriteSizer,
  WriteEncoder,
  Write
} from "@web3api/wasm-as"

export function deserializequeryMethodArgs(argsBuf: ArrayBuffer): {
  arg: string
} {
  const reader = new ReadDecoder(argsBuf);
  var numFields = reader.readMapLength();

  var _arg: string | undefined;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "arg") {
      _arg = reader.readString();
    }
  }

  if (!_arg) {
    throw Error("queryMethod: missing required argument \"arg: String\"");
  }

  return {
    arg: _arg
  };
}

export function serializequeryMethodResult(result: string): ArrayBuffer {
  const sizer = new WriteSizer();
  writequeryMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writequeryMethodResult(encoder, result);
  return buffer;
}

function writequeryMethodResult(writer: Write, result: string) {
  writer.writeString(result);
}
