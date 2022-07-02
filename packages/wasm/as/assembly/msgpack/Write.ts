import { BigInt, BigNumber, BigFraction, Fraction } from "../math";
import { Context } from "../debug";
import { JSON } from "../json";

import { Option } from "as-container";

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
  abstract writeBigFraction(value: BigFraction): void;
  abstract writeFraction<T extends number>(value: Fraction<T>): void;
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

  abstract writeOptionalBool(value: Option<bool>): void;
  abstract writeOptionalInt8(value: Option<i8>): void;
  abstract writeOptionalInt16(value: Option<i16>): void;
  abstract writeOptionalInt32(value: Option<i32>): void;
  abstract writeOptionalUInt8(value: Option<u8>): void;
  abstract writeOptionalUInt16(value: Option<u16>): void;
  abstract writeOptionalUInt32(value: Option<u32>): void;
  abstract writeOptionalFloat32(value: Option<f32>): void;
  abstract writeOptionalFloat64(value: Option<f64>): void;
  abstract writeOptionalString(value: string | null): void;
  abstract writeOptionalBytes(value: ArrayBuffer | null): void;
  abstract writeOptionalBigInt(value: BigInt | null): void;
  abstract writeOptionalBigNumber(value: BigNumber | null): void;
  abstract writeOptionalBigFraction(value: BigFraction | null): void;
  abstract writeOptionalFraction<T extends number>(
    value: Fraction<T> | null
  ): void;
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
    m: Map<K, V>,
    key_fn: (writer: Write, key: K) => void,
    value_fn: (writer: Write, value: V) => void
  ): void;

  abstract context(): Context;
}
