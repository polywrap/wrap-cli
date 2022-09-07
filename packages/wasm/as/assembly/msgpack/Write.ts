import { BigInt, BigNumber } from "../math";
import { Context } from "../debug";
import { JSON } from "../json";
import { Box } from "../containers";

export abstract class Write {
  abstract writeNil(): void;
  abstract writeBool(value: bool): void;
  abstract writeInt8(value: i8): void;
  abstract writeInt16(value: i16): void;
  abstract writeInt32(value: i32): void;
  abstract writeUInt8(value: u8): void;
  abstract writeUInt16(value: u16): void;
  abstract writeUInt32(value: u32): void;
  abstract writeFloat32(value: f32): void;
  abstract writeFloat64(value: f64): void;
  abstract writeStringLength(length: u32): void;
  abstract writeString(value: string): void;
  abstract writeBytesLength(length: u32): void;
  abstract writeBytes(value: ArrayBuffer): void;
  abstract writeBigInt(value: BigInt): void;
  abstract writeBigNumber(value: BigNumber): void;
  abstract writeJSON(value: JSON.Value): void;
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
  abstract writeExtGenericMap<K, V>(
    m: Map<K, V>,
    key_fn: (writer: Write, key: K) => void,
    value_fn: (writer: Write, value: V) => void
  ): void;

  abstract writeOptionalBool(value: Box<bool> | null): void;
  abstract writeOptionalInt8(value: Box<i8> | null): void;
  abstract writeOptionalInt16(value: Box<i16> | null): void;
  abstract writeOptionalInt32(value: Box<i32> | null): void;
  abstract writeOptionalUInt8(value: Box<u8> | null): void;
  abstract writeOptionalUInt16(value: Box<u16> | null): void;
  abstract writeOptionalUInt32(value: Box<u32> | null): void;
  abstract writeOptionalFloat32(value: Box<f32> | null): void;
  abstract writeOptionalFloat64(value: Box<f64> | null): void;
  abstract writeOptionalString(value: string | null): void;
  abstract writeOptionalBytes(value: ArrayBuffer | null): void;
  abstract writeOptionalBigInt(value: BigInt | null): void;
  abstract writeOptionalBigNumber(value: BigNumber | null): void;
  abstract writeOptionalJSON(value: JSON.Value | null): void;
  abstract writeOptionalArray<T>(
    a: Array<T> | null,
    fn: (writer: Write, item: T) => void
  ): void;
  abstract writeOptionalMap<K, V>(
    m: Map<K, V> | null,
    key_fn: (writer: Write, key: K) => void,
    value_fn: (writer: Write, value: V) => void
  ): void;
  abstract writeOptionalExtGenericMap<K, V>(
    m: Map<K, V> | null,
    key_fn: (writer: Write, key: K) => void,
    value_fn: (writer: Write, value: V) => void
  ): void;

  abstract context(): Context;
}
