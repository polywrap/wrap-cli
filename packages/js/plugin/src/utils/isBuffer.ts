export function isBuffer(maybeBuf: unknown): maybeBuf is BufferSource {
  if (maybeBuf instanceof ArrayBuffer || ArrayBuffer.isView(maybeBuf)) {
    return true;
  } else {
    return false;
  }
}
