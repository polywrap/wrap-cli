//! Errors returned from I/O `Write` and `Read` operations

use super::Format;
use polywrap_msgpack_serde::{JSON, ParseBigIntError};
use thiserror::Error;

/// Errors from encoding data
#[derive(Debug, Error)]
pub enum EncodeError {
    #[error("{0}")]
    NilWriteError(String),

    #[error("{0}")]
    FormatWriteError(String),

    #[error("{0}")]
    BooleanWriteError(String),

    #[error("{0}")]
    BinWriteError(String),

    #[error("{0}")]
    BigIntWriteError(String),

    #[error("{0}")]
    JSONWriteError(String),

    #[error("{0}")]
    Float32WriteError(String),

    #[error("{0}")]
    Float64WriteError(String),

    #[error("{0}")]
    Uint8WriteError(String),

    #[error("{0}")]
    Uint16WriteError(String),

    #[error("{0}")]
    Uint32WriteError(String),

    #[error("{0}")]
    Int8WriteError(String),

    #[error("{0}")]
    Int16WriteError(String),

    #[error("{0}")]
    Int32WriteError(String),

    #[error("{0}")]
    StrWriteError(String),

    #[error("{0}")]
    TypeWriteError(String),

    #[error("{0}")]
    IOError(String),
}

impl From<std::io::Error> for EncodeError {
    fn from(e: std::io::Error) -> Self {
        EncodeError::IOError(e.to_string())
    }
}

impl From<JSON::Error> for EncodeError {
    fn from(e: JSON::Error) -> EncodeError {
        EncodeError::JSONWriteError(e.to_string())
    }
}

/// Errors from decoding data
#[derive(Debug, Error)]
pub enum DecodeError {
    #[error("Found NIL, but expected: '{0}'")]
    FoundNilButExpected(String),

    #[error("{0}")]
    BooleanReadError(String),

    #[error("{0}")]
    BytesReadError(String),

    #[error("{0}")]
    ParseBigIntError(String),

    #[error("{0}")]
    ParseBigNumberError(String),

    #[error("{0}")]
    IntReadError(String),

    #[error("{0}")]
    UintReadError(String),

    #[error("{0}")]
    FloatReadError(String),

    #[error("{0}")]
    BigIntReadError(String),

    #[error("{0}")]
    BigNumberReadError(String),

    #[error("{0}")]
    JSONReadError(String),

    #[error("{0}")]
    IntRangeError(String),

    #[error("{0}")]
    ArrayReadError(String),

    #[error("{0}")]
    MapReadError(String),

    #[error("{0}")]
    ExtGenericMapReadError(String),

    #[error("{0}")]
    StrReadError(String),

    #[error("{0}")]
    EnumReadError(String),

    #[error("UnknownFieldName: '{0}'")]
    UnknownFieldName(String),

    #[error("{0}")]
    WrongMsgPackFormat(String),

    #[error("Missing required field: '{0}'")]
    MissingField(String),

    #[error("{0}")]
    TypeReadError(String),

    #[error("{0}")]
    IOError(String),
}

impl From<std::io::Error> for DecodeError {
    fn from(e: std::io::Error) -> Self {
        DecodeError::IOError(e.to_string())
    }
}

impl From<JSON::Error> for DecodeError {
    fn from(e: JSON::Error) -> DecodeError {
        DecodeError::JSONReadError(e.to_string())
    }
}

impl From<ParseBigIntError> for DecodeError {
    fn from(e: ParseBigIntError) -> Self {
        DecodeError::BigIntReadError(e.to_string())
    }
}

/// Error types for CustomEnum
#[derive(Debug, Error)]
pub enum EnumTypeError {
    #[error("{0}")]
    EnumProcessingError(String),

    #[error("{0}")]
    ParseEnumError(String),
}

impl From<EnumTypeError> for DecodeError {
  fn from(e: EnumTypeError) -> Self {
      DecodeError::EnumReadError(e.to_string())
  }
}

pub fn get_error_message(format: Format) -> String {
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
        Format::NegativeFixInt(_) | Format::PositiveFixInt(_) => "Found 'int'.".to_string(),
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
        Format::FixStr(_) | Format::Str8 | Format::Str16 | Format::Str32 => "Found 'string'.".to_string(),
        Format::FixArray(_) | Format::Array16 | Format::Array32 => "Found 'array'.".to_string(),
        Format::FixMap(_) | Format::Map16 | Format::Map32 => "Found 'map'.".to_string(),
    }
}
