export interface Read {
  readBool(): bool;
  readInt8(): i8;
  readInt16(): i16;
  readInt32(): i32;
  readInt64(): i64;
  readUInt8(): u8;
  readUInt16(): u16;
  readUInt32(): u32;
  readUInt64(): u64;
  readFloat32(): f32;
  readFloat64(): f64;
  readString(): string;
  readStringLength(): u32;
  readByteArray(): ArrayBuffer;
  readBinLength(): u32;
  readArraySize(): u32;
  readMapSize(): u32;
  readArray<T>(fn: (decoder: Decoder) => T): Array<T>;
  readNullableArray<T>(fn: (decoder: Decoder) => T): Array<T> | null;
  readMap<K, V>(
    keyFn: (reader: Read) => K,
    valueFn: (reader: Read) => V
  ): Map<K, V>;
  readNullableMap<K, V>(
    keyFn: (reader: Read) => K,
    valueFn: (reader: Read) => V
  ): Map<K, V> | null;
}
