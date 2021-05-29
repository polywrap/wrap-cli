import { Nullable } from "./Nullable";
import { BigInt } from "../BigInt";
import { Context } from "./Context";

export abstract class Write {
  abstract writeNil(): void;
  abstract writeBool(value: bool): void;
  abstract writeInt8(value: i8): void;
  abstract writeInt16(value: i16): void;
  abstract writeInt32(value: i32): void;
  abstract writeInt64(value: i64): void;
  abstract writeUInt8(value: u8): void;
  abstract writeUInt16(value: u16): void;
  abstract writeUInt32(value: u32): void;
  abstract writeUInt64(value: u64): void;
  abstract writeFloat32(value: f32): void;
  abstract writeFloat64(value: f64): void;
  abstract writeStringLength(length: u32): void;
  abstract writeString(value: string): void;
  abstract writeBytesLength(length: u32): void;
  abstract writeBytes(value: ArrayBuffer): void;
  abstract writeBigInt(value: BigInt): void;
  abstract writeArrayLength(length: u32): void;
  abstract writeArray<T>(
    a: Array<T>,
    fn: (writer: Write, item: T) => void
  ): void;
  abstract writeMapLength(length: u32): void;
  abstract writeMap<K, V>(
    m: Map<K, V>,
    key_fn: (writer: Write, key: K) => void,
    value_fn: (writer: Write, value: V) => void
  ): void;

  abstract writeNullableBool(value: Nullable<bool>): void;
  abstract writeNullableInt8(value: Nullable<i8>): void;
  abstract writeNullableInt16(value: Nullable<i16>): void;
  abstract writeNullableInt32(value: Nullable<i32>): void;
  abstract writeNullableInt64(value: Nullable<i64>): void;
  abstract writeNullableUInt8(value: Nullable<u8>): void;
  abstract writeNullableUInt16(value: Nullable<u16>): void;
  abstract writeNullableUInt32(value: Nullable<u32>): void;
  abstract writeNullableUInt64(value: Nullable<u64>): void;
  abstract writeNullableFloat32(value: Nullable<f32>): void;
  abstract writeNullableFloat64(value: Nullable<f64>): void;
  abstract writeNullableString(value: string | null): void;
  abstract writeNullableBytes(value: ArrayBuffer | null): void;
  abstract writeNullableBigInt(value: BigInt | null): void;
  abstract writeNullableArray<T>(
    a: Array<T> | null,
    fn: (writer: Write, item: T) => void
  ): void;
  abstract writeNullableMap<K, V>(
    m: Map<K, V> | null,
    key_fn: (writer: Write, key: K) => void,
    value_fn: (writer: Write, value: V) => void
  ): void;

  abstract context(): Context;
}
