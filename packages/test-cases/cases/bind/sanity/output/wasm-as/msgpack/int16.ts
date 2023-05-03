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

export class Int16 {
  static toBuffer(type: i16): ArrayBuffer {
    const sizerContext: Context = new Context("Serializing (sizing) base-type: Int16");
    const sizer = new WriteSizer(sizerContext);
    sizer.writeInt16(type);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context("Serializing (encoding) base-type: Int16");
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    encoder.writeInt16(type);
    return buffer;
  }

  static fromBuffer(buffer: ArrayBuffer): i16 {
    const context: Context = new Context("Deserializing base-type Int");
    const reader = new ReadDecoder(buffer, context);
    return reader.readInt16();
  }
}
