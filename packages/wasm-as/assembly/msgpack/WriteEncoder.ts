import { DataView } from "./DataView";
import { Format } from "./Format";
import { Write } from "./Write";

export class WriteEncoder implements Write {
  private view: DataView;

  constructor(ua: ArrayBuffer) {
    this.view = new DataView(ua, 0, ua.byteLength);
  }

  writeNil(): void {
    this.view.setUint8(<u8>Format.NIL);
  }

  writeBool(value: bool): void {
    this.view.setUint8(value ? <u8>Format.TRUE : <u8>Format.FALSE);
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
    if (value >= 0 && value < 1 << 7) {
      this.view.setUint8(<u8>value);
    } else if (value < 0 && value >= -(1 << 5)) {
      this.view.setUint8((<u8>value) | (<u8>Format.NEGATIVE_FIXINT));
    } else if (value <= <i64>i8.MAX_VALUE && value >= <i64>i8.MIN_VALUE) {
      this.view.setUint8(<u8>Format.INT8);
      this.view.setInt8(<i8>value);
    } else if (value <= <i64>i16.MAX_VALUE && value >= <i64>i16.MIN_VALUE) {
      this.view.setUint8(<u8>Format.INT16);
      this.view.setInt16(<i16>value);
    } else if (value <= <i64>i32.MAX_VALUE && value >= <i64>i32.MIN_VALUE) {
      this.view.setUint8(<u8>Format.INT32);
      this.view.setInt32(<i32>value);
    } else {
      this.view.setUint8(<u8>Format.INT64);
      this.view.setInt64(value);
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
      this.view.setUint8(<u8>value);
    } else if (value <= <u64>u8.MAX_VALUE) {
      this.view.setUint8(<u8>Format.UINT8);
      this.view.setUint8(<u8>value);
    } else if (value <= <u64>u16.MAX_VALUE) {
      this.view.setUint8(<u8>Format.UINT16);
      this.view.setUint16(<u16>value);
    } else if (value <= <u64>u32.MAX_VALUE) {
      this.view.setUint8(<u8>Format.UINT32);
      this.view.setUint32(<u32>value);
    } else {
      this.view.setUint8(<u8>Format.UINT64);
      this.view.setUint64(value);
    }
  }

  writeFloat32(value: f32): void {
    this.view.setUint8(<u8>Format.FLOAT32);
    this.view.setFloat32(value);
  }

  writeFloat64(value: f64): void {
    this.view.setUint8(<u8>Format.FLOAT64);
    this.view.setFloat64(value);
  }

  writeStringLength(length: u32): void {
    if (length < 32) {
      this.view.setUint8((<u8>length) | (<u8>Format.FIXSTR));
    } else if (length <= <u32>u8.MAX_VALUE) {
      this.view.setUint8(<u8>Format.STR8);
      this.view.setUint8(<u8>length);
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.view.setUint8(<u8>Format.STR16);
      this.view.setUint16(<u16>length);
    } else {
      this.view.setUint8(<u8>Format.STR32);
      this.view.setUint32(length);
    }
  }

  writeString(value: string): void {
    const buf = String.UTF8.encode(value);
    this.writeStringLength(buf.byteLength);
    this.view.setBytes(buf);
  }

  writeBytesLength(length: u32): void {
    if (length <= <u32>u8.MAX_VALUE) {
      this.view.setUint8(<u8>Format.BIN8);
      this.view.setUint8(<u8>length);
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.view.setUint8(<u8>Format.BIN16);
      this.view.setUint16(<u16>length);
    } else {
      this.view.setUint8(<u8>Format.BIN32);
      this.view.setUint32(length);
    }
  }

  writeBytes(value: ArrayBuffer): void {
    if (value.byteLength == 0) {
      this.writeNil();
      return;
    }
    this.writeBytesLength(value.byteLength);
    this.view.setBytes(value);
  }

  writeArraySize(length: u32): void {
    if (length < 16) {
      this.view.setInt8((<u8>length) | (<u8>Format.FIXARRAY));
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.view.setUint8(<u8>Format.ARRAY16);
      this.view.setUint16(<u16>length);
    } else {
      this.view.setUint8(<u8>Format.ARRAY32);
      this.view.setUint32(length);
    }
  }

  writeArray<T>(a: Array<T>, fn: (encoder: Write, item: T) => void): void {
    this.writeArraySize(a.length);
    for (let i: i32 = 0; i < a.length; i++) {
      fn(this, a[i]);
    }
  }

  writeMapSize(length: u32): void {
    if (length < 16) {
      this.view.setInt8((<u8>length) | (<u8>Format.FIXMAP));
    } else if (length <= <u32>u16.MAX_VALUE) {
      this.view.setUint8(<u8>Format.MAP16);
      this.view.setUint16(<u16>length);
    } else {
      this.view.setUint8(<u8>Format.MAP32);
      this.view.setUint32(length);
    }
  }

  writeMap<K, V>(
    m: Map<K, V>,
    keyFn: (encoder: Write, key: K) => void,
    valueFn: (encoder: Write, value: V) => void
  ): void {
    this.writeMapSize(m.size);
    const keys = m.keys();
    for (let i: i32 = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = m.get(key);
      keyFn(this, key);
      valueFn(this, value);
    }
  }

  writeNullableBool(value: bool | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBool(value);
  }

  writeNullableInt8(value: i8 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeInt8(value);
  }

  writeNullableInt16(value: i16 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeInt16(value);
  }

  writeNullableInt32(value: i32 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeInt32(value);
  }

  writeNullableInt64(value: i64 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeInt64(value);
  }

  writeNullableUInt8(value: u8 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeUInt8(value);
  }

  writeNullableUInt16(value: u16 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeUInt16(value);
  }

  writeNullableUInt32(value: u32 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeUInt32(value);
  }

  writeNullableUInt64(value: u64 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeUInt64(value);
  }

  writeNullableFloat32(value: f32 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeFloat32(value);
  }

  writeNullableFloat64(value: f64 | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeFloat64(value);
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

  writeNullableArray<T>(
    a: Array<T> | null,
    fn: (encoder: Write, item: T) => void
  ): void {
    if (a === null) {
      this.writeNil();
      return;
    }
    this.writeArray(a, fn);
  }

  writeNullableMap<K, V>(
    m: Map<K, V> | null,
    keyFn: (encoder: Write, key: K) => void,
    valueFn: (encoder: Write, value: V) => void
  ): void {
    if (m === null) {
      this.writeNil();
      return;
    }
    this.writeMap(m, keyFn, valueFn);
  }
}
