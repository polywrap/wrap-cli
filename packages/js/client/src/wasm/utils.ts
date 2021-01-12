export function memcpy (
  src: Uint8Array,
  srcOffset: number,
  dst: Uint8Array,
  dstOffset: number,
  length: number
): Uint8Array {
  src = (src.subarray || src.slice ? src : src.buffer) as Uint8Array
  dst = (dst.subarray || dst.slice ? dst : dst.buffer) as Uint8Array

  src = srcOffset ? src.subarray ?
    src.subarray(srcOffset, length && srcOffset + length) :
    src.slice(srcOffset, length && srcOffset + length) : src

  if (dst.set) {
    dst.set(src, dstOffset)
  } else {
    for (let i=0; i<src.length; i++) {
      dst[i + dstOffset] = src[i]
    }
  }

  return dst
}
