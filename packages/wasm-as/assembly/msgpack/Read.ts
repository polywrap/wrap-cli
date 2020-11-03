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
  readStringLength(): u32;
  readString(): string;
  readBytesLength(): u32;
  readBytes(): ArrayBuffer;
  readArrayLength(): u32;
  readArray<T>(fn: (reader: Read) => T): Array<T>;
  readMapLength(): u32;
  readMap<K, V>(
    keyFn: (reader: Read) => K,
    valueFn: (reader: Read) => V
  ): Map<K, V>;

  readNullableBool(): bool | null;
  readNullableInt8(): i8 | null;
  readNullableInt16(): i16 | null;
  readNullableInt32(): i32 | null;
  readNullableInt64(): i64 | null;
  readNullableUInt8(): u8 | null;
  readNullableUInt16(): u16 | null;
  readNullableUInt32(): u32 | null;
  readNullableUInt64(): u64 | null;
  readNullableFloat32(): f32 | null;
  readNullableFloat64(): f64 | null;
  readNullableString(): string | null;
  readNullableBytes(): ArrayBuffer | null;
  readNullableArray<T>(fn: (decoder: Read) => T): Array<T> | null;
  readNullableMap<K, V>(
    keyFn: (reader: Read) => K,
    valueFn: (reader: Read) => V
  ): Map<K, V> | null;
}
