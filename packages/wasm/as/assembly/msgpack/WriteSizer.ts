import { Write } from "./Write";
import { BigInt, BigNumber, BigFraction, Fraction } from "../math";
import { Context } from "../debug";
import { JSON } from "../json";

import { Option } from "as-container";

export class WriteSizer extends Write {
  length: i32;
  extByteLengths: Array<u32>;
  private readonly _context: Context;

  constructor(context: Context = new Context()) {
    super();
    this._context = context;
    this.extByteLengths = new Array<u32>();
  }

  context(): Context {
    return this._context;
  }

  writeNil(): void {
    this.length++;
  }

  writeBool(_value: bool): void {
    this.length++;
  }

  writeInt8(value: i8): void {
    this.writeInt32(<i32>value);
  }

  writeInt16(value: i16): void {
    this.writeInt32(<i32>value);
  }

  writeInt32(value: i32): void {
    if (value >= -(1 << 5) && value < 1 << 7) {
      this.length++;
    } else if (value < 1 << 7 && value >= -(1 << 7)) {
      this.length += 2;
    } else if (value < 1 << 15 && value >= -(1 << 15)) {
      this.length += 3;
    } else {
      this.length += 5;
    }
  }

  writeUInt8(value: u8): void {
    this.writeUInt32(<u32>value);
  }

  writeUInt16(value: u16): void {
    this.writeUInt32(<u32>value);
  }

  writeUInt32(value: u32): void {
    if (value < 1 << 7) {
      this.length++;
    } else if (value < 1 << 8) {
      this.length += 2;
    } else if (value < 1 << 16) {
      this.length += 3;
    } else {
      this.length += 5;
    }
  }

  writeFloat32(_value: f32): void {
    this.length += 5;
  }

  writeFloat64(_value: f64): void {
    this.length += 9;
  }

  writeStringLength(length: u32): void {
    if (length < 32) {
      this.length++;
    } else if (length <= <u32>u8.MAX_VALUE) {
      this.length += 2;
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.length += 3;
    } else {
      this.length += 5;
    }
  }

  writeString(value: string): void {
    const buf = String.UTF8.encode(value);
    this.writeStringLength(buf.byteLength);
    this.length += buf.byteLength;
  }

  writeBytesLength(length: u32): void {
    if (length <= <u32>u8.MAX_VALUE) {
      this.length += 2;
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.length += 3;
    } else {
      this.length += 5;
    }
  }

  writeBytes(value: ArrayBuffer): void {
    if (value.byteLength == 0) {
      this.length++; // nil byte
      return;
    }
    this.writeBytesLength(value.byteLength);
    this.length += value.byteLength;
  }

  writeBigInt(value: BigInt): void {
    const str = value.toString();
    this.writeString(str);
  }

  writeBigNumber(value: BigNumber): void {
    const str = value.toString();
    this.writeString(str);
  }

  writeBigFraction(value: BigFraction): void {
    const numerator = value.numerator.toString();
    const denominator = value.denominator.toString();
    this.writeString(numerator);
    this.writeString(denominator);
  }

  writeFraction<T extends number>(value: Fraction<T>): void {
    if (isSigned<T>()) {
      switch (sizeof<T>()) {
        case sizeof<i8>():
          this.writeInt8(<i8>value.numerator);
          this.writeInt8(<i8>value.denominator);
          break;
        case sizeof<i16>():
          this.writeInt16(<i16>value.numerator);
          this.writeInt16(<i16>value.denominator);
          break;
        default:
          this.writeInt32(<i32>value.numerator);
          this.writeInt32(<i32>value.denominator);
      }
    } else {
      switch (sizeof<T>()) {
        case sizeof<u8>():
          this.writeUInt8(<u8>value.numerator);
          this.writeUInt8(<u8>value.denominator);
          break;
        case sizeof<u16>():
          this.writeUInt16(<u16>value.numerator);
          this.writeUInt16(<u16>value.denominator);
          break;
        default:
          this.writeUInt32(<u32>value.numerator);
          this.writeUInt32(<u32>value.denominator);
      }
    }
  }

  writeJSON(value: JSON.Value): void {
    const str = value.stringify();
    this.writeString(str);
  }

  writeArrayLength(length: u32): void {
    if (length < 16) {
      this.length++;
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.length += 3;
    } else {
      this.length += 5;
    }
  }

  writeArray<T>(a: Array<T>, fn: (sizer: Write, item: T) => void): void {
    this.writeArrayLength(a.length);
    for (let i: i32 = 0; i < a.length; i++) {
      fn(this, a[i]);
    }
  }

  writeMapLength(length: u32): void {
    if (length < 16) {
      this.length++;
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.length += 3;
    } else {
      this.length += 5;
    }
  }

  writeMap<K, V>(
    m: Map<K, V>,
    key_fn: (sizer: Write, key: K) => void,
    value_fn: (sizer: Write, value: V) => void
  ): void {
    this.writeMapLength(m.size);
    const keys = m.keys();
    for (let i: i32 = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = m.get(key);
      key_fn(this, key);
      value_fn(this, value);
    }
  }

  writeExtGenericMap<K, V>(
    m: Map<K, V>,
    key_fn: (encoder: Write, key: K) => void,
    value_fn: (encoder: Write, value: V) => void
  ): void {
    // type = GENERIC_MAP
    this.length++;

    const startingLength = this.length;

    this.writeMap(m, key_fn, value_fn);

    const byteLength: u32 = this.length - startingLength;

    if (byteLength <= <u32>u8.MAX_VALUE) {
      this.length += 2;
    } else if (byteLength <= <u32>u16.MAX_VALUE) {
      this.length += 3;
    } else {
      this.length += 5;
    }

    this.extByteLengths.push(byteLength);
  }

  writeOptionalBool(value: Option<bool>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeBool(value.unwrap());
  }

  writeOptionalInt8(value: Option<i8>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeInt8(value.unwrap());
  }

  writeOptionalInt16(value: Option<i16>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeInt16(value.unwrap());
  }

  writeOptionalInt32(value: Option<i32>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeInt32(value.unwrap());
  }

  writeOptionalUInt8(value: Option<u8>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeUInt8(value.unwrap());
  }

  writeOptionalUInt16(value: Option<u16>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeUInt16(value.unwrap());
  }

  writeOptionalUInt32(value: Option<u32>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeUInt32(value.unwrap());
  }

  writeOptionalFloat32(value: Option<f32>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeFloat32(value.unwrap());
  }

  writeOptionalFloat64(value: Option<f64>): void {
    if (value.isNone) {
      this.writeNil();
      return;
    }

    this.writeFloat64(value.unwrap());
  }

  writeOptionalString(value: string | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeString(value);
  }

  writeOptionalBytes(value: ArrayBuffer | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBytes(value);
  }

  writeOptionalBigInt(value: BigInt | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBigInt(value);
  }

  writeOptionalBigNumber(value: BigNumber | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBigNumber(value);
  }

  writeOptionalBigFraction(value: BigFraction | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBigFraction(value);
  }

  writeOptionalFraction<T extends number>(value: Fraction<T> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeFraction<T>(value);
  }

  writeOptionalJSON(value: JSON.Value | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeJSON(value);
  }

  writeOptionalArray<T>(
    a: Array<T> | null,
    fn: (sizer: Write, item: T) => void
  ): void {
    if (a === null) {
      this.writeNil();
      return;
    }

    this.writeArray(a, fn);
  }

  writeOptionalMap<K, V>(
    m: Map<K, V> | null,
    key_fn: (sizer: Write, key: K) => void,
    value_fn: (sizer: Write, value: V) => void
  ): void {
    if (m === null) {
      this.writeNil();
      return;
    }

    this.writeMap(m, key_fn, value_fn);
  }

  writeOptionalExtGenericMap<K, V>(
    m: Map<K, V> | null,
    key_fn: (sizer: Write, key: K) => void,
    value_fn: (sizer: Write, value: V) => void
  ): void {
    if (m === null) {
      this.writeNil();
      return;
    }
    this.writeExtGenericMap(m, key_fn, value_fn);
  }
}
