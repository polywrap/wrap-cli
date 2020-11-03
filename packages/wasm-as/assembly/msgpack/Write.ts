import { Nullable } from "./Nullable";

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
  writeArrayLength(length: u32): void;
  writeArray<T>(
    a: Array<T>,
    fn: (writer: Write, item: T) => void
  ): void;
  writeMapLength(length: u32): void;
  writeMap<K, V>(
    m: Map<K, V>,
    keyFn: (writer: Write, key: K) => void,
    valueFn: (writer: Write, value: V) => void
  ): void;

  writeNullableBool(value: Nullable<bool>): void;
  writeNullableInt8(value: Nullable<i8>): void;
  writeNullableInt16(value: Nullable<i16>): void;
  writeNullableInt32(value: Nullable<i32>): void;
  writeNullableInt64(value: Nullable<i64>): void;
  writeNullableUInt8(value: Nullable<u8>): void;
  writeNullableUInt16(value: Nullable<u16>): void;
  writeNullableUInt32(value: Nullable<u32>): void;
  writeNullableUInt64(value: Nullable<u64>): void;
  writeNullableFloat32(value: Nullable<f32>): void;
  writeNullableFloat64(value: Nullable<f64>): void;
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
