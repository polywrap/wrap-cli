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

export class MsgMap {
  static toBuffer<K, V>(type: Map<K, V>, key_fn: (writer: Write, key: K) => void, value_fn: (writer: Write, value: V) => void): ArrayBuffer {
    const sizerContext: Context = new Context("Serializing (sizing) base-type: Map");
    const sizer = new WriteSizer(sizerContext);
    sizer.writeMapLength(type.size);
    const buffer = new ArrayBuffer(sizer.length);
    const encoderContext: Context = new Context("Serializing (encoding) base-type: Map");
    const encoder = new WriteEncoder(buffer, sizer, encoderContext);
    encoder.writeExtGenericMap(type, key_fn, value_fn);
    return buffer;
  }

  static fromBuffer<K, V>(buffer: ArrayBuffer, key_fn: (reader: Read) => K, value_fn: (reader: Read) => V): Map<K, V> {
    const context: Context = new Context("Deserializing base-type Map");
    const reader = new ReadDecoder(buffer, context);
    return reader.readExtGenericMap(key_fn, value_fn);
  }
}
