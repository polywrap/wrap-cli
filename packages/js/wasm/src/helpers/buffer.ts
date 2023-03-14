/* eslint-disable @typescript-eslint/ban-ts-comment */
export function isBuffer(maybeBuf: unknown): maybeBuf is BufferSource {
  if (maybeBuf instanceof ArrayBuffer || ArrayBuffer.isView(maybeBuf)) {
    return true;
  } else {
    return false;
  }
}

export function writeString(
  str: string,
  dst: ArrayBuffer,
  dstOffset: number
): Uint8Array {
  const encoder = new TextEncoder();
  const strBuffer = encoder.encode(str);
  const view = new Uint8Array(dst);
  return memcpy(strBuffer, 0, view, dstOffset, strBuffer.byteLength);
}

export function writeBytes(
  bytes: ArrayBuffer,
  dst: ArrayBuffer,
  dstOffset: number
): Uint8Array {
  const bytesView = new Uint8Array(bytes);
  const dstView = new Uint8Array(dst);
  return memcpy(bytesView, 0, dstView, dstOffset, bytesView.byteLength);
}

export function readBytes(
  from: ArrayBuffer,
  offset: number,
  length: number
): ArrayBuffer {
  const buffer = new ArrayBuffer(length);
  writeBytes(from.slice(offset, offset + length), buffer, 0);
  return buffer;
}

export function readString(
  from: ArrayBuffer,
  offset: number,
  length: number
): string {
  const buffer = readBytes(from, offset, length);
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

function memcpy(
  src: Uint8Array,
  srcOffset: number,
  dst: Uint8Array,
  dstOffset: number,
  length: number
): Uint8Array {
  // @ts-ignore
  src = (src.subarray || src.slice ? src : src.buffer) as Uint8Array;
  // @ts-ignore
  dst = (dst.subarray || dst.slice ? dst : dst.buffer) as Uint8Array;

  src = srcOffset
    ? src.subarray
      ? src.subarray(srcOffset, length && srcOffset + length)
      : src.slice(srcOffset, length && srcOffset + length)
    : src;

  if (dst.set) {
    dst.set(src, dstOffset);
  } else {
    for (let i = 0; i < src.length; i++) {
      dst[i + dstOffset] = src[i];
    }
  }

  return dst;
}
