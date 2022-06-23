import { BigInt, BigNumber } from "../math";
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

  abstract readNullableBool(): Option<bool>;
  abstract readNullableInt8(): Option<i8>;
  abstract readNullableInt16(): Option<i16>;
  abstract readNullableInt32(): Option<i32>;
  abstract readNullableUInt8(): Option<u8>;
  abstract readNullableUInt16(): Option<u16>;
  abstract readNullableUInt32(): Option<u32>;
  abstract readNullableFloat32(): Option<f32>;
  abstract readNullableFloat64(): Option<f64>;
  abstract readNullableString(): string | null;
  abstract readNullableBytes(): ArrayBuffer | null;
  abstract readNullableBigInt(): BigInt | null;
  abstract readNullableBigNumber(): BigNumber | null;
  abstract readNullableJSON(): JSON.Value | null;
  abstract readNullableArray<T>(fn: (decoder: Read) => T): Array<T> | null;
  abstract readNullableMap<K, V>(
    key_fn: (reader: Read) => K,
    value_fn: (reader: Read) => V
  ): Map<K, V> | null;
  abstract readNullableExtGenericMap<K, V>(
    key_fn: (reader: Read) => K,
    value_fn: (reader: Read) => V
  ): Map<K, V> | null;

  abstract isNextNil(): bool;
  abstract isNextString(): bool;

  abstract context(): Context;
}
