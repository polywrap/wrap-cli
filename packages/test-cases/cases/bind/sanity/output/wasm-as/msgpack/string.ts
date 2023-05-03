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

export class MsgString {
  static toBuffer(type: string): ArrayBuffer {
    const sizerContext: Context = new Context(
      "Serializing (sizing) base-type: String"
    );
    const sizer = new WriteSizer(sizerContext);
    sizer.writeString(type);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context(
      "Serializing (encoding) base-type: String"
    );
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    encoder.writeString(type);
    return buffer;
  }

  static fromBuffer(buffer: ArrayBuffer): string {
    const context: Context = new Context("Deserializing base-type String");
    const reader = new ReadDecoder(buffer, context);
    return reader.readString();
  }
}