export const enum Format {
  ERROR = 0,
  FOUR_LEAST_SIG_BITS_IN_BYTE = 0x0f,
  FOUR_SIG_BITS_IN_BYTE = 0xf0,
  POSITIVE_FIXINT = 0x00,
  FIXMAP = 0x80,
  FIXARRAY = 0x90,
  FIXSTR = 0xa0,
  NIL = 0xc0,
  FALSE = 0xc2,
  TRUE = 0xc3,
  BIN8 = 0xc4,
  BIN16 = 0xc5,
  BIN32 = 0xc6,
  EXT8 = 0xc7,
  EXT16 = 0xc8,
  EXT32 = 0xc9,
  FLOAT32 = 0xca,
  FLOAT64 = 0xcb,
  UINT8 = 0xcc,
  UINT16 = 0xcd,
  UINT32 = 0xce,
  UINT64 = 0xcf,
  INT8 = 0xd0,
  INT16 = 0xd1,
  INT32 = 0xd2,
  INT64 = 0xd3,
  FIXEXT1 = 0xd4,
  FIXEXT2 = 0xd5,
  FIXEXT4 = 0xd6,
  FIXEXT8 = 0xd7,
  FIXEXT16 = 0xd8,
  STR8 = 0xd9,
  STR16 = 0xda,
  STR32 = 0xdb,
  ARRAY16 = 0xdc,
  ARRAY32 = 0xdd,
  MAP16 = 0xde,
  MAP32 = 0xdf,
  NEGATIVE_FIXINT = 0xe0,
}

export function isFloat32(u: u8): bool {
  return u == Format.FLOAT32;
}

export function isFloat64(u: u8): bool {
  return u == Format.FLOAT64;
}

export function isFixedInt(u: u8): bool {
  return u >> 7 == 0;
}

export function isNegativeFixedInt(u: u8): bool {
  return (u & 0xe0) == Format.NEGATIVE_FIXINT;
}

export function isFixedMap(u: u8): bool {
  return (u & 0xf0) == Format.FIXMAP;
}

export function isFixedArray(u: u8): bool {
  return (u & 0xf0) == Format.FIXARRAY;
}

export function isFixedString(u: u8): bool {
  return (u & 0xe0) == Format.FIXSTR;
}

export function isNil(u: u8): bool {
  return u == Format.NIL;
}
