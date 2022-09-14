import { BigInt, BigNumber } from "../math";
import { Context } from "../debug";
import { JSON } from "../json";
import { Box } from "../containers";

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

  abstract readOptionalBool(): Box<bool> | null;
  abstract readOptionalInt8(): Box<i8> | null;
  abstract readOptionalInt16(): Box<i16> | null;
  abstract readOptionalInt32(): Box<i32> | null;
  abstract readOptionalUInt8(): Box<u8> | null;
  abstract readOptionalUInt16(): Box<u16> | null;
  abstract readOptionalUInt32(): Box<u32> | null;
  abstract readOptionalFloat32(): Box<f32> | null;
  abstract readOptionalFloat64(): Box<f64> | null;
  abstract readOptionalString(): string | null;
  abstract readOptionalBytes(): ArrayBuffer | null;
  abstract readOptionalBigInt(): BigInt | null;
  abstract readOptionalBigNumber(): BigNumber | null;
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
