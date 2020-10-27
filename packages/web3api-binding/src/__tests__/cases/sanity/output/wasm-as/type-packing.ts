import { Write, WriteSizer, WriteEncoder } from "@web3api/wasm-as";
import { CustomType } from "./";

function __write_CustomType(writer: Write, type: CustomType) {
  writer.writeMapSize(3);
  writer.writeString("str");
  writer.writeString(type.str);
  writer.writeString("strOpt");
  if (type.strOpt === null) {
    writer.writeNil();
  } else {
    const unboxed = type.prop2!;
    writer.writeString(unboxed.value);
  }
  writer.writeString("u8");
  writer.writeUInt8(type.u8);
}

export function __toBuffer_CustomType(): ArrayBuffer {
  const sizer = new WriteSizer();
  __write_CustomType(sizer);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new WriteEncoder(buffer);
  __write_CustomType(encoder);
  return buffer;
}
