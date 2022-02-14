import { DataView } from "./DataView";
import {
  Format,
  isFloat32,
  isFloat64,
  isFixedInt,
  isNegativeFixedInt,
  isFixedMap,
  isFixedArray,
  isFixedString,
} from "./Format";
import { Nullable } from "./Nullable";
import { Read } from "./Read";
import { BigInt } from "../math";
import { Context } from "../debug";
import { JSON } from "../json";

export class ReadDecoder extends Read {
  private readonly _context: Context;
  private _view: DataView;

  constructor(ua: ArrayBuffer, context: Context = new Context()) {
    super();
    this._context = context;
    this._view = new DataView(ua, 0, ua.byteLength, context);
  }

  context(): Context {
    return this._context;
  }

  readBool(): bool {
    const value = this._view.getUint8();
    if (value == Format.TRUE) {
      return true;
    } else if (value == Format.FALSE) {
      return false;
    }
    throw new TypeError(
      this._context.printWithContext(
        "Property must be of type 'bool'. " + this._getErrorMessage(value)
      )
    );
  }

  readInt8(): i8 {
    const value = this._readInt64();
    if (value <= i64(i8.MAX_VALUE) && value >= i64(i8.MIN_VALUE)) {
      return i8(value);
    }
    throw new RangeError(
      this._context.printWithContext(
        "integer overflow: value = " + value.toString() + "; bits = 8"
      )
    );
  }

  readInt16(): i16 {
    const value = this._readInt64();
    if (value <= i64(i16.MAX_VALUE) && value >= i64(i16.MIN_VALUE)) {
      return i16(value);
    }
    throw new RangeError(
      this._context.printWithContext(
        "integer overflow: value = " + value.toString() + "; bits = 16"
      )
    );
  }

  readInt32(): i32 {
    const value = this._readInt64();
    if (value <= i64(i32.MAX_VALUE) && value >= i64(i32.MIN_VALUE)) {
      return i32(value);
    }
    throw new RangeError(
      this._context.printWithContext(
        "integer overflow: value = " + value.toString() + "; bits = 32"
      )
    );
  }

  readUInt8(): u8 {
    const value = this._readUInt64();
    if (value <= u64(u8.MAX_VALUE) && value >= u64(u8.MIN_VALUE)) {
      return u8(value);
    }
    throw new RangeError(
      this._context.printWithContext(
        "unsigned integer overflow: value = " + value.toString() + "; bits = 8"
      )
    );
  }

  readUInt16(): u16 {
    const value = this._readUInt64();
    if (value <= u64(u16.MAX_VALUE) && value >= u64(u16.MIN_VALUE)) {
      return u16(value);
    }
    throw new RangeError(
      this._context.printWithContext(
        "unsigned integer overflow: value = " + value.toString() + "; bits = 16"
      )
    );
  }

  readUInt32(): u32 {
    const value = this._readUInt64();
    if (value <= u64(u32.MAX_VALUE) && value >= u64(u32.MIN_VALUE)) {
      return u32(value);
    }
    throw new RangeError(
      this._context.printWithContext(
        "unsigned integer overflow: value = " + value.toString() + "; bits = 32"
      )
    );
  }

  readFloat32(): f32 {
    const prefix = this._view.getUint8();
    if (isFloat32(prefix)) {
      return <f32>this._view.getFloat32();
    }
    throw new TypeError(
      this._context.printWithContext(
        "Property must be of type 'float32'. " + this._getErrorMessage(prefix)
      )
    );
  }

  readFloat64(): f64 {
    const prefix = this._view.getUint8();
    if (isFloat64(prefix)) {
      return <f64>this._view.getFloat64();
    }
    throw new Error(
      this._context.printWithContext(
        "Property must be of type 'float64'. " + this._getErrorMessage(prefix)
      )
    );
  }

  readStringLength(): u32 {
    if (this.isNextNil()) {
      return 0;
    }
    const leadByte = this._view.getUint8();
    if (isFixedString(leadByte)) {
      return leadByte & 0x1f;
    }
    if (isFixedArray(leadByte)) {
      return <u32>(leadByte & Format.FOUR_LEAST_SIG_BITS_IN_BYTE);
    }
    switch (leadByte) {
      case Format.STR8:
        return <u32>this._view.getUint8();
      case Format.STR16:
        return <u32>this._view.getUint16();
      case Format.STR32:
        return this._view.getUint32();
      case Format.NIL:
        return 0;
    }

    throw new TypeError(
      this._context.printWithContext(
        "Property must be of type 'string'. " + this._getErrorMessage(leadByte)
      )
    );
  }

  readString(): string {
    const strLen = this.readStringLength();
    const stringBytes = this._view.getBytes(strLen);
    return String.UTF8.decode(stringBytes);
  }

  readBytesLength(): u32 {
    if (this.isNextNil()) {
      return 0;
    }
    const leadByte = this._view.getUint8();
    if (isFixedArray(leadByte)) {
      return <u32>(leadByte & Format.FOUR_LEAST_SIG_BITS_IN_BYTE);
    }
    switch (leadByte) {
      case Format.BIN8:
        return <u32>this._view.getUint8();
      case Format.BIN16:
        return <u32>this._view.getUint16();
      case Format.BIN32:
        return this._view.getUint32();
      case Format.NIL:
        return 0;
    }
    throw new TypeError(
      this._context.printWithContext(
        "Property must be of type 'bytes'. " + this._getErrorMessage(leadByte)
      )
    );
  }

  readBytes(): ArrayBuffer {
    const arrLength = this.readBytesLength();
    const arrBytes = this._view.getBytes(arrLength);
    return arrBytes;
  }

  readBigInt(): BigInt {
    const str = this.readString();
    return BigInt.fromString(str);
  }

  readJSON(): JSON.Value {
    const str = this.readString();
    return JSON.parse(str);
  }

  readArrayLength(): u32 {
    if (this.isNextNil()) {
      return 0;
    }
    const leadByte = this._view.getUint8();
    if (isFixedArray(leadByte)) {
      return <u32>(leadByte & Format.FOUR_LEAST_SIG_BITS_IN_BYTE);
    }
    switch (leadByte) {
      case Format.ARRAY16:
        return <u32>this._view.getUint16();
      case Format.ARRAY32:
        return this._view.getUint32();
      case Format.NIL:
        return 0;
    }
    throw new TypeError(
      this._context.printWithContext(
        "Property must be of type 'array'. " + this._getErrorMessage(leadByte)
      )
    );
  }

  readArray<T>(fn: (reader: Read) => T): Array<T> {
    const size = this.readArrayLength();
    const a = new Array<T>();
    for (let i: u32 = 0; i < size; i++) {
      this._context.push("array[" + i.toString() + "]");
      const item = fn(this);
      a.push(item);
      this._context.pop();
    }
    return a;
  }

  readMapLength(): u32 {
    if (this.isNextNil()) {
      return 0;
    }
    const leadByte = this._view.getUint8();
    if (isFixedMap(leadByte)) {
      return <u32>(leadByte & Format.FOUR_LEAST_SIG_BITS_IN_BYTE);
    }
    switch (leadByte) {
      case Format.MAP16:
        return <u32>this._view.getUint16();
      case Format.MAP32:
        return this._view.getUint32();
      case Format.NIL:
        return 0;
    }
    throw new TypeError(
      this._context.printWithContext(
        "Property must be of type 'map'. " + this._getErrorMessage(leadByte)
      )
    );
  }

  readMap<K, V>(
    key_fn: (reader: Read) => K,
    value_fn: (reader: Read) => V
  ): Map<K, V> {
    const size = this.readMapLength();
    const m = new Map<K, V>();
    for (let i: u32 = 0; i < size; i++) {
      this._context.push("map[" + i.toString() + "]");
      const key = key_fn(this);
      const value = value_fn(this);
      m.set(key, value);
      this._context.pop();
    }
    return m;
  }

  readNullableBool(): Nullable<bool> {
    if (this.isNextNil()) {
      return Nullable.fromNull<bool>();
    }
    return Nullable.fromValue<bool>(this.readBool());
  }

  readNullableInt8(): Nullable<i8> {
    if (this.isNextNil()) {
      return Nullable.fromNull<i8>();
    }
    return Nullable.fromValue<i8>(this.readInt8());
  }

  readNullableInt16(): Nullable<i16> {
    if (this.isNextNil()) {
      return Nullable.fromNull<i16>();
    }
    return Nullable.fromValue<i16>(this.readInt16());
  }

  readNullableInt32(): Nullable<i32> {
    if (this.isNextNil()) {
      return Nullable.fromNull<i32>();
    }
    return Nullable.fromValue<i32>(this.readInt32());
  }

  readNullableUInt8(): Nullable<u8> {
    if (this.isNextNil()) {
      return Nullable.fromNull<u8>();
    }
    return Nullable.fromValue<u8>(this.readUInt8());
  }

  readNullableUInt16(): Nullable<u16> {
    if (this.isNextNil()) {
      return Nullable.fromNull<u16>();
    }
    return Nullable.fromValue<u16>(this.readUInt16());
  }

  readNullableUInt32(): Nullable<u32> {
    if (this.isNextNil()) {
      return Nullable.fromNull<u32>();
    }
    return Nullable.fromValue<u32>(this.readUInt32());
  }

  readNullableFloat32(): Nullable<f32> {
    if (this.isNextNil()) {
      return Nullable.fromNull<f32>();
    }
    return Nullable.fromValue<f32>(this.readFloat32());
  }

  readNullableFloat64(): Nullable<f64> {
    if (this.isNextNil()) {
      return Nullable.fromNull<f64>();
    }
    return Nullable.fromValue<f64>(this.readFloat64());
  }

  readNullableString(): string | null {
    if (this.isNextNil()) {
      return null;
    }
    return this.readString();
  }

  readNullableBytes(): ArrayBuffer | null {
    if (this.isNextNil()) {
      return null;
    }
    return this.readBytes();
  }

  readNullableBigInt(): BigInt | null {
    if (this.isNextNil()) {
      return null;
    }
    return this.readBigInt();
  }

  readNullableJSON(): JSON.Value | null {
    if (this.isNextNil()) {
      return null;
    }

    return this.readJSON();
  }

  readNullableArray<T>(fn: (decoder: Read) => T): Array<T> | null {
    if (this.isNextNil()) {
      return null;
    }
    return this.readArray(fn);
  }

  readNullableMap<K, V>(
    key_fn: (decoder: Read) => K,
    value_fn: (decoder: Read) => V
  ): Map<K, V> | null {
    if (this.isNextNil()) {
      return null;
    }
    return this.readMap(key_fn, value_fn);
  }

  isNextNil(): bool {
    const format = this._view.peekUint8();
    if (format == Format.NIL) {
      this._view.discard(1);
      return true;
    }
    return false;
  }

  isNextString(): bool {
    const format = this._view.peekUint8();
    return (
      isFixedString(format) ||
      format == Format.STR8 ||
      format == Format.STR16 ||
      format == Format.STR32
    );
  }

  private _readInt64(): i64 {
    const prefix = this._view.getUint8();

    if (isFixedInt(prefix)) {
      return i64(prefix);
    }
    if (isNegativeFixedInt(prefix)) {
      return i64(i8(prefix));
    }
    switch (prefix) {
      case Format.INT8:
        return i64(this._view.getInt8());
      case Format.INT16:
        return i64(this._view.getInt16());
      case Format.INT32:
        return i64(this._view.getInt32());
      case Format.INT64:
        return this._view.getInt64();
      case Format.UINT8:
        return i64(this._view.getUint8());
      case Format.UINT16:
        return i64(this._view.getUint16());
      case Format.UINT32:
        return i64(this._view.getUint32());
      case Format.UINT64: {
        const value = this._view.getUint64();
        if (value <= u64(i64.MAX_VALUE)) {
          return i64(value);
        }
        throw new RangeError(
          this._context.printWithContext(
            "integer overflow: value = " + value.toString() + "; bits = 64"
          )
        );
      }
      default:
        throw new TypeError(
          this._context.printWithContext(
            "Property must be of type 'int'. " + this._getErrorMessage(prefix)
          )
        );
    }
  }

  private _readUInt64(): u64 {
    const prefix = this._view.getUint8();

    if (isFixedInt(prefix)) {
      return u64(prefix);
    } else if (isNegativeFixedInt(prefix)) {
      throw new RangeError(
        this._context.printWithContext(
          "unsigned integer cannot be negative. " +
            this._getErrorMessage(prefix)
        )
      );
    }

    switch (prefix) {
      case Format.UINT8:
        return u64(this._view.getUint8());
      case Format.UINT16:
        return u64(this._view.getUint16());
      case Format.UINT32:
        return u64(this._view.getUint32());
      case Format.UINT64:
        return this._view.getUint64();
      case Format.INT8: {
        const int8 = this._view.getInt8();
        if (int8 >= 0) {
          return u64(int8);
        }
        throw new RangeError(
          this._context.printWithContext(
            "unsigned integer cannot be negative. " +
              this._getErrorMessage(prefix)
          )
        );
      }
      case Format.INT16: {
        const int16 = this._view.getInt16();
        if (int16 >= 0) {
          return u64(int16);
        }
        throw new RangeError(
          this._context.printWithContext(
            "unsigned integer cannot be negative. " +
              this._getErrorMessage(prefix)
          )
        );
      }
      case Format.INT32: {
        const int32 = this._view.getInt32();
        if (int32 >= 0) {
          return u64(int32);
        }
        throw new RangeError(
          this._context.printWithContext(
            "unsigned integer cannot be negative. " +
              this._getErrorMessage(prefix)
          )
        );
      }
      case Format.INT64: {
        const int64 = this._view.getInt64();
        if (int64 >= 0) {
          return u64(int64);
        }
        throw new RangeError(
          this._context.printWithContext(
            "unsigned integer cannot be negative. " +
              this._getErrorMessage(prefix)
          )
        );
      }
      default:
        throw new TypeError(
          this._context.printWithContext(
            "Property must be of type 'uint'. " + this._getErrorMessage(prefix)
          )
        );
    }
  }

  private _skip(): void {
    // getSize handles discarding 'msgpack header' info
    let numberOfObjectsToDiscard = this._getSize();

    while (numberOfObjectsToDiscard > 0) {
      this._getSize(); // discard next object
      numberOfObjectsToDiscard--;
    }
  }

  private _getSize(): i32 {
    const leadByte = this._view.getUint8(); // will discard one
    let objectsToDiscard = <i32>0;
    // Handled for fixed values
    if (isNegativeFixedInt(leadByte)) {
      // noop, will just discard the leadbyte
    } else if (isFixedInt(leadByte)) {
      // noop, will just discard the leadbyte
    } else if (isFixedString(leadByte)) {
      const strLength = leadByte & 0x1f;
      this._view.discard(strLength);
    } else if (isFixedArray(leadByte)) {
      objectsToDiscard = <i32>(leadByte & Format.FOUR_LEAST_SIG_BITS_IN_BYTE);
    } else if (isFixedMap(leadByte)) {
      objectsToDiscard =
        2 * <i32>(leadByte & Format.FOUR_LEAST_SIG_BITS_IN_BYTE);
    } else {
      switch (leadByte) {
        case Format.NIL:
          break;
        case Format.TRUE:
          break;
        case Format.FALSE:
          break;
        case Format.BIN8:
          this._view.discard(<i32>this._view.getUint8());
          break;
        case Format.BIN16:
          this._view.discard(<i32>this._view.getUint16());
          break;
        case Format.BIN32:
          this._view.discard(<i32>this._view.getUint32());
          break;
        case Format.FLOAT32:
          this._view.discard(4);
          break;
        case Format.FLOAT64:
          this._view.discard(8);
          break;
        case Format.UINT8:
          this._view.discard(1);
          break;
        case Format.UINT16:
          this._view.discard(2);
          break;
        case Format.UINT32:
          this._view.discard(4);
          break;
        case Format.UINT64:
          this._view.discard(8);
          break;
        case Format.INT8:
          this._view.discard(1);
          break;
        case Format.INT16:
          this._view.discard(2);
          break;
        case Format.INT32:
          this._view.discard(4);
          break;
        case Format.INT64:
          this._view.discard(8);
          break;
        case Format.FIXEXT1:
          this._view.discard(2);
          break;
        case Format.FIXEXT2:
          this._view.discard(3);
          break;
        case Format.FIXEXT4:
          this._view.discard(5);
          break;
        case Format.FIXEXT8:
          this._view.discard(9);
          break;
        case Format.FIXEXT16:
          this._view.discard(17);
          break;
        case Format.STR8:
          this._view.discard(this._view.getUint8());
          break;
        case Format.STR16:
          this._view.discard(this._view.getUint16());
          break;
        case Format.STR32:
          this._view.discard(this._view.getUint32());
          break;
        case Format.ARRAY16:
          objectsToDiscard = <i32>this._view.getUint16();
          break;
        case Format.ARRAY32:
          objectsToDiscard = <i32>this._view.getUint32();
          break;
        case Format.MAP16:
          objectsToDiscard = 2 * <i32>this._view.getUint16();
          break;
        case Format.MAP32:
          objectsToDiscard = 2 * <i32>this._view.getUint32();
          break;
        default:
          throw new TypeError(
            this._context.printWithContext(
              "invalid prefix; cannot get size due to bad encoding for value: " +
                leadByte.toString()
            )
          );
      }
    }

    return objectsToDiscard;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _getErrorMessage(leadByte: u8): string {
    if (isNegativeFixedInt(leadByte)) {
      return "Found 'int'.";
    } else if (isFixedInt(leadByte)) {
      return "Found 'int'.";
    } else if (isFixedString(leadByte)) {
      return "Found 'string'.";
    } else if (isFixedArray(leadByte)) {
      return "Found 'array'.";
    } else if (isFixedMap(leadByte)) {
      return "Found 'map'.";
    } else {
      switch (leadByte) {
        case Format.NIL:
          return "Found 'nil'.";
        case Format.TRUE:
        case Format.FALSE:
          return "Found 'bool'.";
        case Format.BIN8:
          return "Found 'BIN8'.";
        case Format.BIN16:
          return "Found 'BIN16'.";
        case Format.BIN32:
          return "Found 'BIN32'.";
        case Format.FLOAT32:
          return "Found 'float32'.";
        case Format.FLOAT64:
          return "Found 'float64'.";
        case Format.UINT8:
          return "Found 'uint8'.";
        case Format.UINT16:
          return "Found 'uint16'.";
        case Format.UINT32:
          return "Found 'uint32'.";
        case Format.UINT64:
          return "Found 'uint64'.";
        case Format.INT8:
          return "Found 'int8'.";
        case Format.INT16:
          return "Found 'int16'.";
        case Format.INT32:
          return "Found 'int32'.";
        case Format.INT64:
          return "Found 'int64'.";
        case Format.FIXEXT1:
          return "Found 'FIXEXT1'.";
        case Format.FIXEXT2:
          return "Found 'FIXEXT2'.";
        case Format.FIXEXT4:
          return "Found 'FIXEXT4'.";
        case Format.FIXEXT8:
          return "Found 'FIXEXT8'.";
        case Format.FIXEXT16:
          return "Found 'FIXEXT16'.";
        case Format.STR8:
        case Format.STR16:
        case Format.STR32:
          return "Found 'string'.";
        case Format.ARRAY16:
        case Format.ARRAY32:
          return "Found 'array'.";
        case Format.MAP16:
        case Format.MAP32:
          return "Found 'map'.";
        default:
          throw new TypeError(
            "invalid prefix, bad encoding for val: " + leadByte.toString()
          );
      }
    }
  }
}
