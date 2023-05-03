import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Box,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@polywrap/wasm-as";

export class Bytes {
  static toBuffer(type: ArrayBuffer): ArrayBuffer {
    const sizerContext: Context = new Context("Serializing (sizing) base-type: Bytes");
    const sizer = new WriteSizer(sizerContext);
    sizer.writeBytes(type);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context("Serializing (encoding) base-type: Bytes");
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    encoder.writeBytes(type);
    return buffer;
  }

  static fromBuffer(buffer: ArrayBuffer): ArrayBuffer {
    const context: Context = new Context("Deserializing base-type Bytes");
    const reader = new ReadDecoder(buffer, context);
    return reader.readBytes();
  }
}
