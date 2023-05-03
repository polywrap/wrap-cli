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

export class UInt16 {
  static toBuffer(type: u16): ArrayBuffer {
    const sizerContext: Context = new Context("Serializing (sizing) base-type: UInt16");
    const sizer = new WriteSizer(sizerContext);
    sizer.writeUInt16(type);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context("Serializing (encoding) base-type: UInt16");
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    encoder.writeUInt16(type);
    return buffer;
  }

  static fromBuffer(buffer: ArrayBuffer): u16 {
    const context: Context = new Context("Deserializing base-type UInt16");
    const reader = new ReadDecoder(buffer, context);
    return reader.readUInt16();
  }
}
