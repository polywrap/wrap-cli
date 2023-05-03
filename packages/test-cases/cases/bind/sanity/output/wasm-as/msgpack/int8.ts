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

export class Int8 {
  static toBuffer(type: i8): ArrayBuffer {
    const sizerContext: Context = new Context("Serializing (sizing) base-type: Int8");
    const sizer = new WriteSizer(sizerContext);
    sizer.writeInt8(type);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context("Serializing (encoding) base-type: Int8");
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    encoder.writeInt8(type);
    return buffer;
  }

  static fromBuffer(buffer: ArrayBuffer): i8 {
    const context: Context = new Context("Deserializing base-type Int");
    const reader = new ReadDecoder(buffer, context);
    return reader.readInt8();
  }
}
