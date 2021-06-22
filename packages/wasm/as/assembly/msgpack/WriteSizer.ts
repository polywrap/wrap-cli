import { Write } from "./Write";
import { Nullable } from "./Nullable";
import { BigInt } from "../BigInt";
import { Context } from "./Context";

export class WriteSizer extends Write {
  length: i32;
  private readonly _context: Context;

  constructor(context: Context = new Context()) {
    super();
    this._context = context;
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
    this.writeInt64(<i64>value);
  }

  writeInt16(value: i16): void {
    this.writeInt64(<i64>value);
  }

  writeInt32(value: i32): void {
    this.writeInt64(<i64>value);
  }

  writeInt64(value: i64): void {
    if (value >= -(1 << 5) && value < 1 << 7) {
      this.length++;
    } else if (value < 1 << 7 && value >= -(1 << 7)) {
      this.length += 2;
    } else if (value < 1 << 15 && value >= -(1 << 15)) {
      this.length += 3;
    } else if (value < 1 << 31 && value >= -(1 << 31)) {
      this.length += 5;
    } else {
      this.length += 9;
    }
  }

  writeUInt8(value: u8): void {
    this.writeUInt64(<u64>value);
  }

  writeUInt16(value: u16): void {
    this.writeUInt64(<u64>value);
  }

  writeUInt32(value: u32): void {
    this.writeUInt64(<u64>value);
  }

  writeUInt64(value: u64): void {
    if (value < 1 << 7) {
      this.length++;
    } else if (value < 1 << 8) {
      this.length += 2;
    } else if (value < 1 << 16) {
      this.length += 3;
    } else if (value < (<u64>1) << 32) {
      this.length += 5;
    } else {
      this.length += 9;
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
      this.length++; //nil byte
      return;
    }
    this.writeBytesLength(value.byteLength);
    this.length += value.byteLength;
  }

  writeBigInt(value: BigInt): void {
    const str = value.toString();
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

  writeNullableBool(value: Nullable<bool>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeBool(value.value);
  }

  writeNullableInt8(value: Nullable<i8>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeInt8(value.value);
  }

  writeNullableInt16(value: Nullable<i16>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeInt16(value.value);
  }

  writeNullableInt32(value: Nullable<i32>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeInt32(value.value);
  }

  writeNullableInt64(value: Nullable<i64>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeInt64(value.value);
  }

  writeNullableUInt8(value: Nullable<u8>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeUInt8(value.value);
  }

  writeNullableUInt16(value: Nullable<u16>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeUInt16(value.value);
  }

  writeNullableUInt32(value: Nullable<u32>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeUInt32(value.value);
  }

  writeNullableUInt64(value: Nullable<u64>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeUInt64(value.value);
  }

  writeNullableFloat32(value: Nullable<f32>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeFloat32(value.value);
  }

  writeNullableFloat64(value: Nullable<f64>): void {
    if (value.isNull) {
      this.writeNil();
      return;
    }

    this.writeFloat64(value.value);
  }

  writeNullableString(value: string | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeString(value);
  }

  writeNullableBytes(value: ArrayBuffer | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBytes(value);
  }

  writeNullableBigInt(value: BigInt | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBigInt(value);
  }

  writeNullableArray<T>(
    a: Array<T> | null,
    fn: (sizer: Write, item: T) => void
  ): void {
    if (a === null) {
      this.writeNil();
      return;
    }
    this.writeArray(a, fn);
  }

  writeNullableMap<K, V>(
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
}
