import { DataView } from "./DataView";
import { WriteSizer } from "./WriteSizer";
import { Format } from "./Format";
import { ExtensionType } from "./ExtensionType";
import { Write } from "./Write";
import { BigInt, BigNumber } from "../math";
import { Context } from "../debug";
import { JSON } from "../json";
import { Nullable } from "../containers";

export class WriteEncoder extends Write {
  private readonly _context: Context;
  private _view: DataView;
  private _sizer: WriteSizer;
  private _extCtr: u32;

  constructor(
    ua: ArrayBuffer,
    sizer: WriteSizer,
    context: Context = new Context()
  ) {
    super();
    this._context = context;
    this._view = new DataView(ua, ua.byteLength, context);
    this._sizer = sizer;
    this._extCtr = 0;
  }

  context(): Context {
    return this._context;
  }

  writeNil(): void {
    this._view.setUint8(<u8>Format.NIL);
  }

  writeBool(value: bool): void {
    this._view.setUint8(value ? <u8>Format.TRUE : <u8>Format.FALSE);
  }

  writeInt8(value: i8): void {
    this.writeInt32(<i32>value);
  }

  writeInt16(value: i16): void {
    this.writeInt32(<i32>value);
  }

  writeInt32(value: i32): void {
    if (value >= 0 && value < 1 << 7) {
      this._view.setUint8(<u8>value);
    } else if (value < 0 && value >= -(1 << 5)) {
      this._view.setUint8((<u8>value) | (<u8>Format.NEGATIVE_FIXINT));
    } else if (value <= <i32>i8.MAX_VALUE && value >= <i32>i8.MIN_VALUE) {
      this._view.setUint8(<u8>Format.INT8);
      this._view.setInt8(<i8>value);
    } else if (value <= <i32>i16.MAX_VALUE && value >= <i32>i16.MIN_VALUE) {
      this._view.setUint8(<u8>Format.INT16);
      this._view.setInt16(<i16>value);
    } else {
      this._view.setUint8(<u8>Format.INT32);
      this._view.setInt32(<i32>value);
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
      this._view.setUint8(<u8>value);
    } else if (value <= <u32>u8.MAX_VALUE) {
      this._view.setUint8(<u8>Format.UINT8);
      this._view.setUint8(<u8>value);
    } else if (value <= <u32>u16.MAX_VALUE) {
      this._view.setUint8(<u8>Format.UINT16);
      this._view.setUint16(<u16>value);
    } else {
      this._view.setUint8(<u8>Format.UINT32);
      this._view.setUint32(<u32>value);
    }
  }

  writeFloat32(value: f32): void {
    this._view.setUint8(<u8>Format.FLOAT32);
    this._view.setFloat32(value);
  }

  writeFloat64(value: f64): void {
    this._view.setUint8(<u8>Format.FLOAT64);
    this._view.setFloat64(value);
  }

  writeStringLength(length: u32): void {
    if (length < 32) {
      this._view.setUint8((<u8>length) | (<u8>Format.FIXSTR));
    } else if (length <= <u32>u8.MAX_VALUE) {
      this._view.setUint8(<u8>Format.STR8);
      this._view.setUint8(<u8>length);
    } else if (length <= <u32>u16.MAX_VALUE) {
      this._view.setUint8(<u8>Format.STR16);
      this._view.setUint16(<u16>length);
    } else {
      this._view.setUint8(<u8>Format.STR32);
      this._view.setUint32(length);
    }
  }

  writeString(value: string): void {
    const buf = String.UTF8.encode(value);
    this.writeStringLength(buf.byteLength);
    this._view.setBytes(buf);
  }

  writeBytesLength(length: u32): void {
    if (length <= <u32>u8.MAX_VALUE) {
      this._view.setUint8(<u8>Format.BIN8);
      this._view.setUint8(<u8>length);
    } else if (length <= <u32>u16.MAX_VALUE) {
      this._view.setUint8(<u8>Format.BIN16);
      this._view.setUint16(<u16>length);
    } else {
      this._view.setUint8(<u8>Format.BIN32);
      this._view.setUint32(length);
    }
  }

  writeBytes(value: ArrayBuffer): void {
    if (value.byteLength == 0) {
      this.writeNil();
      return;
    }
    this.writeBytesLength(value.byteLength);
    this._view.setBytes(value);
  }

  writeBigInt(value: BigInt): void {
    const str = value.toString();
    this.writeString(str);
  }

  writeBigNumber(value: BigNumber): void {
    const str = value.toString();
    this.writeString(str);
  }

  writeJSON(value: JSON.Value): void {
    const str = value.stringify();
    this.writeString(str);
  }

  writeArrayLength(length: u32): void {
    if (length < 16) {
      this._view.setUint8((<u8>length) | (<u8>Format.FIXARRAY));
    } else if (length <= <u32>u16.MAX_VALUE) {
      this._view.setUint8(<u8>Format.ARRAY16);
      this._view.setUint16(<u16>length);
    } else {
      this._view.setUint8(<u8>Format.ARRAY32);
      this._view.setUint32(length);
    }
  }

  writeArray<T>(a: Array<T>, fn: (encoder: Write, item: T) => void): void {
    this.writeArrayLength(a.length);
    for (let i: i32 = 0; i < a.length; i++) {
      fn(this, a[i]);
    }
  }

  writeMapLength(length: u32): void {
    if (length < 16) {
      this._view.setUint8((<u8>length) | (<u8>Format.FIXMAP));
    } else if (length <= <u32>u16.MAX_VALUE) {
      this._view.setUint8(<u8>Format.MAP16);
      this._view.setUint16(<u16>length);
    } else {
      this._view.setUint8(<u8>Format.MAP32);
      this._view.setUint32(length);
    }
  }

  writeMap<K, V>(
    m: Map<K, V>,
    key_fn: (encoder: Write, key: K) => void,
    value_fn: (encoder: Write, value: V) => void
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
    const index = this._extCtr;
    this._extCtr += 1;

    if (this._extCtr > <u32>this._sizer.extByteLengths.length) {
      throw new RangeError(
        this._context.printWithContext(
          "writeExtGenericMap" +
            ": Invalid ext index " +
            index.toString() +
            ", ext cache length" +
            this._sizer.extByteLengths.length.toString()
        )
      );
    }

    const byteLength = this._sizer.extByteLengths[index];

    // Encode the extension format + bytelength
    if (byteLength <= <u32>u8.MAX_VALUE) {
      this._view.setUint8(<u8>Format.EXT8);
      this._view.setUint8(<u8>byteLength);
    } else if (byteLength <= <u32>u16.MAX_VALUE) {
      this._view.setUint8(<u8>Format.EXT16);
      this._view.setUint16(<u16>byteLength);
    } else {
      this._view.setUint8(<u8>Format.EXT32);
      this._view.setUint32(byteLength);
    }
    // Set the extension type
    this._view.setUint8(<u8>ExtensionType.GENERIC_MAP);

    this.writeMap(m, key_fn, value_fn);
  }

  writeOptionalBool(value: Nullable<bool> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeBool(value.unwrap());
  }

  writeOptionalInt8(value: Nullable<i8> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeInt8(value.unwrap());
  }

  writeOptionalInt16(value: Nullable<i16> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeInt16(value.unwrap());
  }

  writeOptionalInt32(value: Nullable<i32> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeInt32(value.unwrap());
  }

  writeOptionalUInt8(value: Nullable<u8> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeUInt8(value.unwrap());
  }

  writeOptionalUInt16(value: Nullable<u16> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeUInt16(value.unwrap());
  }

  writeOptionalUInt32(value: Nullable<u32> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeUInt32(value.unwrap());
  }

  writeOptionalFloat32(value: Nullable<f32> | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeFloat32(value.unwrap());
  }

  writeOptionalFloat64(value: Nullable<f64> | null): void {
    if (value === null) {
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

  writeOptionalJSON(value: JSON.Value | null): void {
    if (value === null) {
      this.writeNil();
      return;
    }

    this.writeJSON(value);
  }

  writeOptionalArray<T>(
    a: Array<T> | null,
    fn: (encoder: Write, item: T) => void
  ): void {
    if (a === null) {
      this.writeNil();
      return;
    }
    this.writeArray(a, fn);
  }

  writeOptionalMap<K, V>(
    m: Map<K, V> | null,
    key_fn: (encoder: Write, key: K) => void,
    value_fn: (encoder: Write, value: V) => void
  ): void {
    if (m === null) {
      this.writeNil();
      return;
    }
    this.writeMap(m, key_fn, value_fn);
  }

  writeOptionalExtGenericMap<K, V>(
    m: Map<K, V> | null,
    key_fn: (encoder: Write, key: K) => void,
    value_fn: (encoder: Write, value: V) => void
  ): void {
    if (m === null) {
      this.writeNil();
      return;
    }
    this.writeExtGenericMap(m, key_fn, value_fn);
  }
}
