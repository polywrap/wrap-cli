import {
  Write,
  WriteSizer,
  WriteEncoder,
  ReadDecoder
} from "@web3api/wasm-as";

export function serializecallViewInput(input: {
  address: string,
  method: string,
  args: string[]
}): ArrayBuffer {
  const sizer = new WriteSizer();
  writecallView(sizer, input);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  writecallView(encoder, input);
  return buffer;
}

function writecallView(
  writer: Write,
  input: {
    address: string,
    method: string,
    args: string[]
  }
) {
  writer.writeMapLength(3);
  writer.writeString("address");
  writer.writeString(input.address);
  writer.writeString("method");
  writer.writeString(input.method);
  writer.writeString("args");
  writer.writeArrayLength(input.args.length);
  writer.writeArray(input.args, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
}

export function deserializecallViewOutput(buffer: ArrayBuffer): string {
  const reader = new ReadDecoder(buffer);
  return reader.readString();
}
