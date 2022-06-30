import {
  Encoder,
  Decoder,
  ExtensionCodec,
  encode,
  decode,
} from "@msgpack/msgpack";

enum ExtensionTypes {
  // must be in range 0-127
  GENERIC_MAP = 1,
}

const extensionCodec = new ExtensionCodec();

// Generic Map: Map<K, V>
extensionCodec.register({
  type: ExtensionTypes.GENERIC_MAP,
  encode: (object: unknown): Uint8Array | null => {
    if (object instanceof Map) {
      const optimized: Record<string | number, unknown> = {};
      for (const [key, value] of object) {
        optimized[key] = value;
      }
      return encode(optimized);
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const map = decode(data) as Record<string | number, unknown>;
    return new Map(Object.entries(map));
  },
});

export function msgpackEncode(object: unknown): Uint8Array {
  const encoder = new Encoder(
    extensionCodec,
    undefined, // context
    undefined, // maxDepth
    undefined, // initialBufferSize
    undefined, // sortKeys
    undefined, // forceFloat32
    true, // ignoreUndefined
    undefined // forceIntegerToFloat
  );

  return encoder.encode(object);
}

export function msgpackDecode(buffer: ArrayBuffer): unknown {
  const decoder = new Decoder(extensionCodec);
  return decoder.decode(buffer);
}

export function isBuffer(maybeBuf: unknown): maybeBuf is BufferSource {
  if (maybeBuf instanceof ArrayBuffer || ArrayBuffer.isView(maybeBuf)) {
    return true;
  } else {
    return false;
  }
}
