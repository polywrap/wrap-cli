import { BigInt, BigNumber, BigFraction, Fraction } from "../math";
import { Context } from "../debug";
import { JSON } from "../json";

import { Option } from "as-container";

export abstract class Read {
  abstract readBool(): bool;
  abstract readInt8(): i8;
  abstract readInt16(): i16;
  abstract readInt32(): i32;
  abstract readUInt8(): u8;
  abstract readUInt16(): u16;
  abstract readUInt32(): u32;
  abstract readFloat32(): f32;
  abstract readFloat64(): f64;
  abstract readStringLength(): u32;
  abstract readString(): string;
  abstract readBytesLength(): u32;
  abstract readBytes(): ArrayBuffer;
  abstract readBigInt(): BigInt;
  abstract readBigNumber(): BigNumber;
  abstract readBigFraction(): BigFraction;
  abstract readFraction<T extends number>(): Fraction<T>;
  abstract readJSON(): JSON.Value;
  abstract readArrayLength(): u32;
  abstract readArray<T>(fn: (reader: Read) => T): Array<T>;
  abstract readMapLength(): u32;
  abstract readMap<K, V>(
    key_fn: (reader: Read) => K,
    value_fn: (reader: Read) => V
  ): Map<K, V>;
  abstract readExtGenericMap<K, V>(
    key_fn: (reader: Read) => K,
    value_fn: (reader: Read) => V
  ): Map<K, V>;

  abstract readOptionalBool(): Option<bool>;
  abstract readOptionalInt8(): Option<i8>;
  abstract readOptionalInt16(): Option<i16>;
  abstract readOptionalInt32(): Option<i32>;
  abstract readOptionalUInt8(): Option<u8>;
  abstract readOptionalUInt16(): Option<u16>;
  abstract readOptionalUInt32(): Option<u32>;
  abstract readOptionalFloat32(): Option<f32>;
  abstract readOptionalFloat64(): Option<f64>;
  abstract readOptionalString(): string | null;
  abstract readOptionalBytes(): ArrayBuffer | null;
  abstract readOptionalBigInt(): BigInt | null;
  abstract readOptionalBigNumber(): BigNumber | null;
  abstract readOptionalBigFraction(): BigFraction | null;
  abstract readOptionalFraction<T extends number>(): Fraction<T> | null;
  abstract readOptionalJSON(): JSON.Value | null;
  abstract readOptionalArray<T>(fn: (decoder: Read) => T): Array<T> | null;
  abstract readOptionalMap<K, V>(
    key_fn: (reader: Read) => K,
    value_fn: (reader: Read) => V
  ): Map<K, V> | null;
  abstract readOptionalExtGenericMap<K, V>(
    key_fn: (reader: Read) => K,
    value_fn: (reader: Read) => V
  ): Map<K, V> | null;

  abstract isNextNil(): bool;
  abstract isNextString(): bool;

  abstract context(): Context;
}
