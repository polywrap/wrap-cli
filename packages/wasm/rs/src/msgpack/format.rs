use byteorder::{self, ReadBytesExt, WriteBytesExt};

const FIX_ARRAY_SIZE: u8 = 0x0f;
const FIX_MAP_SIZE: u8 = 0x0f;
const FIX_STR_SIZE: u8 = 0x1f;

/// Format markers in the MsgPack specification
/// The `Reserved` variant is not used, according to the spec.
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Format {
    PositiveFixInt(u8),
    FixMap(u8),
    FixArray(u8),
    FixStr(u8),
    Nil,
    Reserved,
    False,
    True,
    Bin8,
    Bin16,
    Bin32,
    Ext8,
    Ext16,
    Ext32,
    Float32,
    Float64,
    Uint8,
    Uint16,
    Uint32,
    Uint64,
    Int8,
    Int16,
    Int32,
    Int64,
    FixExt1,
    FixExt2,
    FixExt4,
    FixExt8,
    FixExt16,
    Str8,
    Str16,
    Str32,
    Array16,
    Array32,
    Map16,
    Map32,
    NegativeFixInt(i8),
}

impl Format {
    pub fn is_positive_fixed_int(u: u8) -> bool {
        u >> 7 == 0
    }

    pub fn is_negative_fixed_int(u: u8) -> bool {
        (u & 0xe0) == Format::to_u8(&Format::NegativeFixInt(u as i8))
    }

    pub fn is_fixed_map(u: u8) -> bool {
        (u & 0xf0) == Format::to_u8(&Format::FixMap(u))
    }

    pub fn is_fixed_array(u: u8) -> bool {
        (u & 0xf0) == Format::to_u8(&Format::FixArray(u))
    }

    pub fn is_fixed_string(u: u8) -> bool {
        (u & 0xe0) == Format::to_u8(&Format::FixStr(u))
    }

    pub fn set_format<W: std::io::Write>(
        writer: &mut W,
        format: Format,
    ) -> Result<(), std::io::Error> {
        WriteBytesExt::write_u8(writer, format.to_u8())?;
        
        Ok(())
    }

    pub fn get_format<R: std::io::Read>(reader: &mut R) -> Result<Format, std::io::Error> {
        let bytesval = ReadBytesExt::read_u8(reader)?;
        Ok(Format::from_u8(bytesval))
    }

    /// Converts a single byte to its MsgPack marker representation
    pub fn from_u8(val: u8) -> Format {
        match val {
            0x00..=0x7f => Format::PositiveFixInt(val),
            0x80..=0x8f => Format::FixMap(val & FIX_MAP_SIZE),
            0x90..=0x9f => Format::FixArray(val & FIX_ARRAY_SIZE),
            0xa0..=0xbf => Format::FixStr(val & FIX_STR_SIZE),
            0xc0 => Format::Nil,
            0xc1 => Format::Reserved,
            0xc2 => Format::False,
            0xc3 => Format::True,
            0xc4 => Format::Bin8,
            0xc5 => Format::Bin16,
            0xc6 => Format::Bin32,
            0xc7 => Format::Ext8,
            0xc8 => Format::Ext16,
            0xc9 => Format::Ext32,
            0xca => Format::Float32,
            0xcb => Format::Float64,
            0xcc => Format::Uint8,
            0xcd => Format::Uint16,
            0xce => Format::Uint32,
            0xcf => Format::Uint64,
            0xd0 => Format::Int8,
            0xd1 => Format::Int16,
            0xd2 => Format::Int32,
            0xd3 => Format::Int64,
            0xd4 => Format::FixExt1,
            0xd5 => Format::FixExt2,
            0xd6 => Format::FixExt4,
            0xd7 => Format::FixExt8,
            0xd8 => Format::FixExt16,
            0xd9 => Format::Str8,
            0xda => Format::Str16,
            0xdb => Format::Str32,
            0xdc => Format::Array16,
            0xdd => Format::Array32,
            0xde => Format::Map16,
            0xdf => Format::Map32,
            0xe0..=0xff => Format::NegativeFixInt(val as i8),
        }
    }

    /// Converts a MsgPack marker into a single byte
    pub fn to_u8(&self) -> u8 {
        match *self {
            Format::PositiveFixInt(val) => val,
            Format::FixMap(val) => 0x80 | (val & FIX_MAP_SIZE),
            Format::FixArray(val) => 0x90 | (val & FIX_ARRAY_SIZE),
            Format::FixStr(val) => 0xa0 | (val & FIX_STR_SIZE),
            Format::Nil => 0xc0,
            Format::Reserved => 0xc1,
            Format::False => 0xc2,
            Format::True => 0xc3,
            Format::Bin8 => 0xc4,
            Format::Bin16 => 0xc5,
            Format::Bin32 => 0xc6,
            Format::Ext8 => 0xc7,
            Format::Ext16 => 0xc8,
            Format::Ext32 => 0xc9,
            Format::Float32 => 0xca,
            Format::Float64 => 0xcb,
            Format::Uint8 => 0xcc,
            Format::Uint16 => 0xcd,
            Format::Uint32 => 0xce,
            Format::Uint64 => 0xcf,
            Format::Int8 => 0xd0,
            Format::Int16 => 0xd1,
            Format::Int32 => 0xd2,
            Format::Int64 => 0xd3,
            Format::FixExt1 => 0xd4,
            Format::FixExt2 => 0xd5,
            Format::FixExt4 => 0xd6,
            Format::FixExt8 => 0xd7,
            Format::FixExt16 => 0xd8,
            Format::Str8 => 0xd9,
            Format::Str16 => 0xda,
            Format::Str32 => 0xdb,
            Format::Array16 => 0xdc,
            Format::Array32 => 0xdd,
            Format::Map16 => 0xde,
            Format::Map32 => 0xdf,
            Format::NegativeFixInt(val) => val as u8,
        }
    }
}

impl std::fmt::Display for Format {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl From<u8> for Format {
    #[inline]
    fn from(val: u8) -> Format {
        Format::from_u8(val)
    }
}

impl Into<u8> for Format {
    #[inline]
    fn into(self) -> u8 {
        self.to_u8()
    }
}
