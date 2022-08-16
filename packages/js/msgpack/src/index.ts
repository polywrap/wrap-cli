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

function sanitizeObj(obj: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "function") {
      delete obj[key];
    } else if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      const sanitized = sanitizeObj(
        obj[key] as Record<string, unknown>
      );

      if (Array.isArray(obj[key])) {
        obj[key] = Object.values(sanitized);
      } else {
        obj[key] = sanitized;
      }
    }
  }

  return obj;
}

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

  if (typeof object === "object") {
    object = sanitizeObj(object as Record<string, unknown>);
  }

  return encoder.encode(object);
}

export function msgpackDecode(
  buffer: ArrayLike<number> | BufferSource
): unknown {
  const decoder = new Decoder(extensionCodec);
  return decoder.decode(buffer);
}
