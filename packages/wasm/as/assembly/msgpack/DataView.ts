import { E_INVALIDLENGTH, BLOCK_MAXSIZE, throwIndexOutOfRange } from "./utils";
import { Context } from "./Context";

export class DataView {
  @unsafe
  readonly dataStart: u32;
  readonly buffer: ArrayBuffer;
  readonly byteLength: i32;
  private byteOffset: i32;
  private context: Context;

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
    this.byteOffset = byte_offset;
    this.context = context;
  }

  getBytes(length: i32): ArrayBuffer {
    this.checkIndexInRange("getBytes", length);
    const result = this.buffer.slice(this.byteOffset, this.byteOffset + length);
    this.byteOffset += length;
    return result;
  }

  setBytes(buf: ArrayBuffer): void {
    this.checkIndexInRange("setBytes", buf.byteLength);
    memory.copy(
      changetype<i32>(this.dataStart) + this.byteOffset,
      changetype<i32>(buf),
      buf.byteLength
    );
    this.byteOffset += buf.byteLength;
  }

  peekUint8(): u8 {
    this.checkIndexInRange("peekUint8", 0);
    return bswap(load<u8>(this.dataStart + this.byteOffset));
  }

  discard(length: i32): void {
    this.checkIndexInRange("discard", length);
    this.byteOffset += length;
  }

  getFloat32(): f32 {
    this.checkIndexInRange("getFloat32", 4);
    const result = reinterpret<f32>(
      bswap(load<u32>(this.dataStart + this.byteOffset))
    );
    this.byteOffset += 4;
    return result;
  }

  getFloat64(): f64 {
    this.checkIndexInRange("getFloat64", 8);
    const result = reinterpret<f64>(
      bswap(load<u64>(this.dataStart + this.byteOffset))
    );
    this.byteOffset += 8;
    return result;
  }

  getInt8(): i8 {
    this.checkIndexInRange("getInt8", 1);
    const result = load<i8>(this.dataStart + this.byteOffset);
    this.byteOffset++;
    return bswap(result);
  }

  getInt16(): i16 {
    this.checkIndexInRange("getInt16", 2);
    const result = load<i16>(this.dataStart + this.byteOffset);
    this.byteOffset += 2;
    return bswap(result);
  }

  getInt32(): i32 {
    this.checkIndexInRange("getInt32", 4);
    const result = load<i32>(this.dataStart + this.byteOffset);
    this.byteOffset += 4;
    return bswap(result);
  }

  getUint8(): u8 {
    this.checkIndexInRange("getUint8", 1);
    const result = load<u8>(this.dataStart + this.byteOffset);
    this.byteOffset++;
    return bswap(result);
  }

  getUint16(): u16 {
    this.checkIndexInRange("getUint16", 2);
    const result = load<u16>(this.dataStart + this.byteOffset);
    this.byteOffset += 2;
    return bswap(result);
  }

  getUint32(): u32 {
    this.checkIndexInRange("getUint32", 4);
    const result = load<u32>(this.dataStart + this.byteOffset);
    this.byteOffset += 4;
    return bswap(result);
  }

  setFloat32(value: f32): void {
    this.checkIndexInRange("setFloat32", 4);
    store<u32>(
      this.dataStart + this.byteOffset,
      bswap(reinterpret<u32>(value))
    );
    this.byteOffset += 4;
  }

  setFloat64(value: f64): void {
    this.checkIndexInRange("setFloat64", 8);
    store<u64>(
      this.dataStart + this.byteOffset,
      bswap(reinterpret<u64>(value))
    );
    this.byteOffset += 8;
  }

  setInt8(value: i8): void {
    this.checkIndexInRange("setInt8", 1);
    store<i8>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset++;
  }

  setInt16(value: i16): void {
    this.checkIndexInRange("setInt16", 2);
    store<i16>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset += 2;
  }

  setInt32(value: i32): void {
    this.checkIndexInRange("setInt32", 4);
    store<i32>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset += 4;
  }

  setUint8(value: u8): void {
    this.checkIndexInRange("setUint8", 1);
    store<u8>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset++;
  }

  setUint16(value: u16): void {
    this.checkIndexInRange("setUint16", 2);
    store<i32>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset += 2;
  }

  setUint32(value: u32): void {
    this.checkIndexInRange("setUint32", 4);
    store<u32>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset += 4;
  }

  // Non-standard additions that make sense in WebAssembly, but won't work in JS:
  getInt64(): i64 {
    this.checkIndexInRange("getInt64", 8);
    const result = load<i64>(this.dataStart + this.byteOffset);
    this.byteOffset += 8;
    return bswap(result);
  }

  getUint64(): u64 {
    this.checkIndexInRange("getUint64", 8);
    const result = load<u64>(this.dataStart + this.byteOffset);
    this.byteOffset += 8;
    return bswap(result);
  }

  setInt64(value: i64): void {
    this.checkIndexInRange("setInt64", 8);
    store<i64>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset += 8;
  }

  setUint64(value: u64): void {
    this.checkIndexInRange("setUint64", 8);
    store<u64>(this.dataStart + this.byteOffset, bswap(value));
    this.byteOffset += 8;
  }

  toString(): string {
    return "[object DataView]";
  }

  private checkIndexInRange(method: string, length: i32): void {
    if (this.byteOffset + length > this.byteLength) {
      throwIndexOutOfRange(
        this.context,
        method,
        length,
        this.byteOffset,
        this.byteLength
      );
    }
  }
}
