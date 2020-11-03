import { Nullable } from "./Nullable";

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

  readNullableBool(): Nullable<bool>;
  readNullableInt8(): Nullable<i8>;
  readNullableInt16(): Nullable<i16>;
  readNullableInt32(): Nullable<i32>;
  readNullableInt64(): Nullable<i64>;
  readNullableUInt8(): Nullable<u8>;
  readNullableUInt16(): Nullable<u16>;
  readNullableUInt32(): Nullable<u32>;
  readNullableUInt64(): Nullable<u64>;
  readNullableFloat32(): Nullable<f32>;
  readNullableFloat64(): Nullable<f64>;
  readNullableString(): string | null;
  readNullableBytes(): ArrayBuffer | null;
  readNullableArray<T>(fn: (decoder: Read) => T): Array<T> | null;
  readNullableMap<K, V>(
    keyFn: (reader: Read) => K,
    valueFn: (reader: Read) => V
  ): Map<K, V> | null;
}
