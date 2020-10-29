export interface Write {
  writeNil(): void;
  writeBool(value: bool): void;
  writeInt8(value: i8): void;
  writeInt16(value: i16): void;
  writeInt32(value: i32): void;
  writeInt64(value: i64): void;
  writeUInt8(value: u8): void;
  writeUInt16(value: u16): void;
  writeUInt32(value: u32): void;
  writeUInt64(value: u64): void;
  writeFloat32(value: f32): void;
  writeFloat64(value: f64): void;
  writeStringLength(length: u32): void;
  writeString(value: string): void;
  writeBytesLength(length: u32): void;
  writeBytes(ab: ArrayBuffer): void;
  writeArraySize(length: u32): void;
  writeArray<T>(
    a: Array<T>,
    fn: (writer: Write, item: T) => void
  ): void;
  writeMapSize(length: u32): void;
  writeMap<K, V>(
    m: Map<K, V>,
    keyFn: (writer: Write, key: K) => void,
    valueFn: (writer: Write, value: V) => void
  ): void;

  writeNullableBool(value: bool | null): void;
  writeNullableInt8(value: i8 | null): void;
  writeNullableInt16(value: i16 | null): void;
  writeNullableInt32(value: i32 | null): void;
  writeNullableInt64(value: i64 | null): void;
  writeNullableUInt8(value: u8 | null): void;
  writeNullableUInt16(value: u16 | null): void;
  writeNullableUInt32(value: u32 | null): void;
  writeNullableUInt64(value: u64 | null): void;
  writeNullableFloat32(value: f32 | null): void;
  writeNullableFloat64(value: f64 | null): void;
  writeNullableString(value: string | null): void;
  writeNullableBytes(ab: ArrayBuffer | null): void;
  writeNullableArray<T>(
    a: Array<T> | null,
    fn: (writer: Write, item: T) => void
  ): void;
  writeNullableMap<K, V>(
    m: Map<K, V> | null,
    keyFn: (writer: Write, key: K) => void,
    valueFn: (writer: Write, value: V) => void
  ): void;
}
