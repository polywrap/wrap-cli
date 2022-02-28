import {
  E_INVALIDLENGTH,
  BLOCK_MAXSIZE,
  throwByteIndexOutOfRange,
} from "./utils";
import { Context } from "../debug";

export class DataView {
  @unsafe
  readonly dataStart: u32;
  readonly buffer: ArrayBuffer;
  readonly byteLength: i32;
  private _byteOffset: i32;
  private _context: Context;

  constructor(
    buffer: ArrayBuffer,
    byte_offset: i32 = 0,
    byte_length: i32 = buffer.byteLength,
    context: Context = new Context()
  ) {
    if (
      i32(<u32>byte_length > <u32>BLOCK_MAXSIZE) |
      i32(<u32>byte_offset + byte_length > <u32>buffer.byteLength)
    ) {
      throw new RangeError(
        context.printWithContext(
          "DataView.constructor" +
            ": " +
            E_INVALIDLENGTH +
            "[byte_length: " +
            byte_length.toString() +
            " BLOCK_MAXSIZE: " +
            BLOCK_MAXSIZE.toString() +
            " byte_offset: " +
            byte_offset.toString() +
            "buffer.byteLength: " +
            buffer.byteLength.toString() +
            "]"
        )
      );
    }

    this.buffer = buffer; // retains
    const dataStart = changetype<u32>(buffer);
    this.dataStart = dataStart;
    this.byteLength = byte_length;
    this._byteOffset = byte_offset;
    this._context = context;
  }

  getBytes(length: i32): ArrayBuffer {
    this._checkIndexInRange("getBytes", length);
    const result = this.buffer.slice(
      this._byteOffset,
      this._byteOffset + length
    );
    this._byteOffset += length;
    return result;
  }

  setBytes(buf: ArrayBuffer): void {
    this._checkIndexInRange("setBytes", buf.byteLength);
    memory.copy(
      changetype<i32>(this.dataStart) + this._byteOffset,
      changetype<i32>(buf),
      buf.byteLength
    );
    this._byteOffset += buf.byteLength;
  }

  peekUint8(): u8 {
    this._checkIndexInRange("peekUint8", 0);
    return bswap(load<u8>(this.dataStart + this._byteOffset));
  }

  discard(length: i32): void {
    this._checkIndexInRange("discard", length);
    this._byteOffset += length;
  }

  getFloat32(): f32 {
    this._checkIndexInRange("getFloat32", 4);
    const result = reinterpret<f32>(
      bswap(load<u32>(this.dataStart + this._byteOffset))
    );
    this._byteOffset += 4;
    return result;
  }

  getFloat64(): f64 {
    this._checkIndexInRange("getFloat64", 8);
    const result = reinterpret<f64>(
      bswap(load<u64>(this.dataStart + this._byteOffset))
    );
    this._byteOffset += 8;
    return result;
  }

  getInt8(): i8 {
    this._checkIndexInRange("getInt8", 1);
    const result = load<i8>(this.dataStart + this._byteOffset);
    this._byteOffset++;
    return bswap(result);
  }

  getInt16(): i16 {
    this._checkIndexInRange("getInt16", 2);
    const result = load<i16>(this.dataStart + this._byteOffset);
    this._byteOffset += 2;
    return bswap(result);
  }

  getInt32(): i32 {
    this._checkIndexInRange("getInt32", 4);
    const result = load<i32>(this.dataStart + this._byteOffset);
    this._byteOffset += 4;
    return bswap(result);
  }

  getUint8(): u8 {
    this._checkIndexInRange("getUint8", 1);
    const result = load<u8>(this.dataStart + this._byteOffset);
    this._byteOffset++;
    return bswap(result);
  }

  getUint16(): u16 {
    this._checkIndexInRange("getUint16", 2);
    const result = load<u16>(this.dataStart + this._byteOffset);
    this._byteOffset += 2;
    return bswap(result);
  }

  getUint32(): u32 {
    this._checkIndexInRange("getUint32", 4);
    const result = load<u32>(this.dataStart + this._byteOffset);
    this._byteOffset += 4;
    return bswap(result);
  }

  setFloat32(value: f32): void {
    this._checkIndexInRange("setFloat32", 4);
    store<u32>(
      this.dataStart + this._byteOffset,
      bswap(reinterpret<u32>(value))
    );
    this._byteOffset += 4;
  }

  setFloat64(value: f64): void {
    this._checkIndexInRange("setFloat64", 8);
    store<u64>(
      this.dataStart + this._byteOffset,
      bswap(reinterpret<u64>(value))
    );
    this._byteOffset += 8;
  }

  setInt8(value: i8): void {
    this._checkIndexInRange("setInt8", 1);
    store<i8>(this.dataStart + this._byteOffset, bswap(value));
    this._byteOffset++;
  }

  setInt16(value: i16): void {
    this._checkIndexInRange("setInt16", 2);
    store<i16>(this.dataStart + this._byteOffset, bswap(value));
    this._byteOffset += 2;
  }

  setInt32(value: i32): void {
    this._checkIndexInRange("setInt32", 4);
    store<i32>(this.dataStart + this._byteOffset, bswap(value));
    this._byteOffset += 4;
  }

  setUint8(value: u8): void {
    this._checkIndexInRange("setUint8", 1);
    store<u8>(this.dataStart + this._byteOffset, bswap(value));
    this._byteOffset++;
  }

  setUint16(value: u16): void {
    this._checkIndexInRange("setUint16", 2);
    store<i32>(this.dataStart + this._byteOffset, bswap(value));
    this._byteOffset += 2;
  }

  setUint32(value: u32): void {
    this._checkIndexInRange("setUint32", 4);
    store<u32>(this.dataStart + this._byteOffset, bswap(value));
    this._byteOffset += 4;
  }

  // Non-standard additions that make sense in WebAssembly, but won't work in JS:
  getInt64(): i64 {
    this._checkIndexInRange("getInt64", 8);
    const result = load<i64>(this.dataStart + this._byteOffset);
    this._byteOffset += 8;
    return bswap(result);
  }

  getUint64(): u64 {
    this._checkIndexInRange("getUint64", 8);
    const result = load<u64>(this.dataStart + this._byteOffset);
    this._byteOffset += 8;
    return bswap(result);
  }

  toString(): string {
    return "[object DataView]";
  }

  private _checkIndexInRange(method: string, length: i32): void {
    if (this._byteOffset + length > this.byteLength) {
      throwByteIndexOutOfRange(
        this._context,
        method,
        length,
        this._byteOffset,
        this.byteLength
      );
    }
  }
}
