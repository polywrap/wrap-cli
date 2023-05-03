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

export class Boolean {
  result: boolean;

  static toBuffer(type: boolean): ArrayBuffer {
    const sizerContext: Context = new Context("Serializing (sizing) base-type: Boolean");
    const sizer = new WriteSizer(sizerContext);
    sizer.writeBool(type);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context("Serializing (encoding) base-type: Boolean");
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    encoder.writeBool(type);
    return buffer;
  }

  static fromBuffer(buffer: ArrayBuffer): boolean {
    const context: Context = new Context("Deserializing base-type Boolean");
    const reader = new ReadDecoder(buffer, context);
    return reader.readBool();
  }
}
