#[non_exhaustive]
pub struct Format;

impl Format {
    pub const ERROR: u8 = 0;
    pub const FOUR_LEAST_SIG_BITS_IN_BYTE: u8 = 0x0f;
    pub const FOUR_SIG_BITS_IN_BYTE: u8 = 0xf0;
    pub const POSITIVE_FIXINT: u8 = 0x00;
    pub const FIXMAP: u8 = 0x80;
    pub const FIXARRAY: u8 = 0x90;
    pub const FIXSTR: u8 = 0xa0;
    pub const NIL: u8 = 0xc0;
    pub const FALSE: u8 = 0xc2;
    pub const TRUE: u8 = 0xc3;
    pub const BIN8: u8 = 0xc4;
    pub const BIN16: u8 = 0xc5;
    pub const BIN32: u8 = 0xc6;
    pub const EXT8: u8 = 0xc7;
    pub const EXT16: u8 = 0xc8;
    pub const EXT32: u8 = 0xc9;
    pub const FLOAT32: u8 = 0xca;
    pub const FLOAT64: u8 = 0xcb;
    pub const UINT8: u8 = 0xcc;
    pub const UINT16: u8 = 0xcd;
    pub const UINT32: u8 = 0xce;
    pub const UINT64: u8 = 0xcf;
    pub const INT8: u8 = 0xd0;
    pub const INT16: u8 = 0xd1;
    pub const INT32: u8 = 0xd2;
    pub const INT64: u8 = 0xd3;
    pub const FIXEXT1: u8 = 0xd4;
    pub const FIXEXT2: u8 = 0xd5;
    pub const FIXEXT4: u8 = 0xd6;
    pub const FIXEXT8: u8 = 0xd7;
    pub const FIXEXT16: u8 = 0xd8;
    pub const STR8: u8 = 0xd9;
    pub const STR16: u8 = 0xda;
    pub const STR32: u8 = 0xdb;
    pub const ARRAY16: u8 = 0xdc;
    pub const ARRAY32: u8 = 0xdd;
    pub const MAP16: u8 = 0xde;
    pub const MAP32: u8 = 0xdf;
    pub const NEGATIVE_FIXINT: u8 = 0xe0;

    pub fn is_float_32(u: u8) -> bool {
        u == Self::FLOAT32
    }

    pub fn is_float_64(u: u8) -> bool {
        u == Self::FLOAT64
    }

    pub fn is_fixed_int(u: u8) -> bool {
        u >> 7 == 0
    }

    pub fn is_negative_fixed_int(u: u8) -> bool {
        (u & 0xe0) == Self::NEGATIVE_FIXINT
    }

    pub fn is_fixed_map(u: u8) -> bool {
        (u & 0xf0) == Self::FIXMAP
    }

    pub fn is_fixed_array(u: u8) -> bool {
        (u & 0xf0) == Self::FIXARRAY
    }

    pub fn is_fixed_string(u: u8) -> bool {
        (u & 0xe0) == Self::FIXSTR
    }

    pub fn is_nil(u: u8) -> bool {
        u == Self::NIL
    }
}
