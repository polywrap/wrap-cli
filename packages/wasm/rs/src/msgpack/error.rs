//! Errors returned from I/O `Write` and `Read` operations

use super::Format;
use thiserror::Error;

/// Errors from encoding data
#[derive(Debug, Error)]
pub enum EncodeError {
    #[error("NilWriteError: '{0}'")]
    NilWriteError(String),

    #[error("FormatWriteError: '{0}'")]
    FormatWriteError(String),

    #[error("BooleanWriteError: '{0}'")]
    BooleanWriteError(String),

    #[error("BinWriteError: '{0}'")]
    BinWriteError(String),

    #[error("BigIntWriteError: '{0}'")]
    BigIntWriteError(String),

    #[error("JSONWriteError: '{0}'")]
    JSONWriteError(String),

    #[error("Float32WriteError: '{0}'")]
    Float32WriteError(String),

    #[error("Float64WriteError: '{0}'")]
    Float64WriteError(String),

    #[error("Uint8WriteError: '{0}'")]
    Uint8WriteError(String),

    #[error("Uint16WriteError: '{0}'")]
    Uint16WriteError(String),

    #[error("Uint32WriteError: '{0}'")]
    Uint32WriteError(String),

    #[error("Int8WriteError: '{0}'")]
    Int8WriteError(String),

    #[error("Int16WriteError: '{0}'")]
    Int16WriteError(String),

    #[error("Int32WriteError: '{0}'")]
    Int32WriteError(String),

    #[error("StrWriteError: '{0}'")]
    StrWriteError(String),

    #[error("Error in serializing {0}")]
    TypeWriteError(String),
}

impl From<String> for EncodeError {
    fn from(e: String) -> Self {
        e.into()
    }
}

impl From<EncodeError> for String {
    fn from(e: EncodeError) -> Self {
        e.into()
    }
}

impl From<EncodeError> for std::io::Error {
    fn from(e: EncodeError) -> Self {
        e.into()
    }
}

impl From<std::io::Error> for EncodeError {
    fn from(e: std::io::Error) -> Self {
        e.into()
    }
}

impl From<serde_json::Error> for EncodeError {
    fn from(e: serde_json::Error) -> EncodeError {
        e.into()
    }
}

impl From<EncodeError> for serde_json::Error {
    fn from(e: EncodeError) -> Self {
        e.into()
    }
}

/// Errors from decoding data
#[derive(Debug, Error)]
pub enum DecodeError {
    #[error("BytesReadError: '{0}'")]
    BytesReadError(String),

    #[error("ParseBigIntError: '{0}'")]
    ParseBigIntError(String),

    #[error("JSONReadError: '{0}'")]
    JSONReadError(String),

    #[error("{0}")]
    IntRangeError(String),

    #[error("StrReadError: '{0}'")]
    StrReadError(String),

    #[error("UnknownFieldName: '{0}'")]
    UnknownFieldName(String),

    #[error("{0}")]
    WrongMsgPackFormat(String),

    #[error("Missing required field: '{0}'")]
    MissingField(String),

    #[error("Error in deserializing {0}")]
    TypeReadError(String),
}

impl From<String> for DecodeError {
    fn from(e: String) -> Self {
        e.into()
    }
}

impl From<DecodeError> for String {
    fn from(e: DecodeError) -> Self {
        e.into()
    }
}

impl From<DecodeError> for std::io::Error {
    fn from(e: DecodeError) -> Self {
        e.into()
    }
}

impl From<std::io::Error> for DecodeError {
    fn from(e: std::io::Error) -> Self {
        e.into()
    }
}

impl From<serde_json::Error> for DecodeError {
    fn from(e: serde_json::Error) -> DecodeError {
        e.into()
    }
}

impl From<DecodeError> for serde_json::Error {
    fn from(e: DecodeError) -> Self {
        e.into()
    }
}

impl From<num_bigint::ParseBigIntError> for DecodeError {
    fn from(e: num_bigint::ParseBigIntError) -> Self {
        e.into()
    }
}

impl From<DecodeError> for num_bigint::ParseBigIntError {
    fn from(e: DecodeError) -> Self {
        e.into()
    }
}

/// Error types for CustomEnum
#[derive(Debug, Error)]
pub enum EnumTypeError {
    #[error("EnumProcessingError: '{0}'")]
    EnumProcessingError(String),

    #[error("ParseEnumError: '{0}'")]
    ParseEnumError(String),
}

impl From<String> for EnumTypeError {
    fn from(e: String) -> Self {
        e.into()
    }
}

impl From<EnumTypeError> for String {
    fn from(e: EnumTypeError) -> Self {
        e.into()
    }
}

impl From<EnumTypeError> for std::io::Error {
    fn from(e: EnumTypeError) -> Self {
        e.into()
    }
}

impl From<std::io::Error> for EnumTypeError {
    fn from(e: std::io::Error) -> Self {
        e.into()
    }
}

pub fn get_error_message(format: Format) -> String {
    if Format::is_negative_fixed_int(format.to_u8())
        || Format::is_positive_fixed_int(format.to_u8())
    {
        return String::from("Found 'int'.");
    } else if Format::is_fixed_string(format.to_u8()) {
        return String::from("Found 'string'.");
    } else if Format::is_fixed_array(format.to_u8()) {
        return String::from("Found 'array'.");
    } else if Format::is_fixed_map(format.to_u8()) {
        return String::from("Found 'map'.");
    } else {
        match format {
            Format::Nil => "Found 'nil'.".to_string(),
            Format::Reserved => "Found 'reserved'.".to_string(),
            Format::False | Format::True => "Found 'bool'.".to_string(),
            Format::Bin8 => "Found 'BIN8'.".to_string(),
            Format::Bin16 => "Found 'BIN16'.".to_string(),
            Format::Bin32 => "Found 'BIN32'.".to_string(),
            Format::Ext8 => "Found 'EXT8'.".to_string(),
            Format::Ext16 => "Found 'EXT16'.".to_string(),
            Format::Ext32 => "Found 'EXT32'.".to_string(),
            Format::Float32 => "Found 'float32'.".to_string(),
            Format::Float64 => "Found 'float64'.".to_string(),
            Format::Uint8 => "Found 'uint8'.".to_string(),
            Format::Uint16 => "Found 'uint16'.".to_string(),
            Format::Uint32 => "Found 'uint32'.".to_string(),
            Format::Uint64 => "Found 'uint64'.".to_string(),
            Format::Int8 => "Found 'int8'.".to_string(),
            Format::Int16 => "Found 'int16'.".to_string(),
            Format::Int32 => "Found 'int32'.".to_string(),
            Format::Int64 => "Found 'int64'.".to_string(),
            Format::FixExt1 => "Found 'FIXEXT1'.".to_string(),
            Format::FixExt2 => "Found 'FIXEXT2'.".to_string(),
            Format::FixExt4 => "Found 'FIXEXT4'.".to_string(),
            Format::FixExt8 => "Found 'FIXEXT8'.".to_string(),
            Format::FixExt16 => "Found 'FIXEXT16'.".to_string(),
            Format::Str8 | Format::Str16 | Format::Str32 => "Found 'string'.".to_string(),
            Format::Array16 | Format::Array32 => "Found 'array'.".to_string(),
            Format::Map16 | Format::Map32 => "Found 'map'.".to_string(),
            _ => format!(
                "invalid prefix, bad encoding for val: {}",
                &format.to_u8().to_string()
            ),
        }
    }
}
