import {
  Encoder,
  Decoder,
  ExtensionCodec,
  encode,
  decode
} from "@msgpack/msgpack";

export type MsgPackEncoder = Encoder;
export type MsgPackDecoder = Decoder;

enum ExtensionTypes {
  // must be in range 0-127
  GENERIC_MAP = 1
}

const extensionCodec = new ExtensionCodec();

// Generic Map: Map<K, V>
extensionCodec.register({
  type: ExtensionTypes.GENERIC_MAP,
  encode: (object: unknown): Uint8Array | null => {
    if (object instanceof Map) {
      let optimized: Record<string | number, unknown> = {}
      for (let [key, value] of object) {
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

export function createMsgPackEncoder(): MsgPackEncoder {
  return new Encoder(
    extensionCodec,
    undefined,      // context
    undefined,      // maxDepth
    undefined,      // initialBufferSize
    undefined,      // sortKeys
    undefined,      // forceFloat32
    true,           // ignoreUndefined
    undefined       // forceIntegerToFloat
  );
}

export function createMsgPackDecoder(): MsgPackDecoder {
  return new Decoder(
    extensionCodec
  );
}
