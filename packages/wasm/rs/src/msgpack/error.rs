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

impl From<serde_json::Error> for EncodeError {
    fn from(e: serde_json::Error) -> EncodeError {
        EncodeError::JSONWriteError(e.to_string())
    }
}

/// Errors from decoding data
#[derive(Debug, Error)]
pub enum DecodeError {
    #[error("Found NIL, but expected: '{0}'")]
    FoundNilButExpected(String),

    #[error("BooleanReadError: '{0}'")]
    BooleanReadError(String),

    #[error("BytesReadError: '{0}'")]
    BytesReadError(String),

    #[error("ParseBigIntError: '{0}'")]
    ParseBigIntError(String),

    #[error("IntReadError: '{0}'")]
    IntReadError(String),

    #[error("UintReadError: '{0}'")]
    UintReadError(String),

    #[error("FloatReadError: '{0}'")]
    FloatReadError(String),

    #[error("BigIntReadError: '{0}'")]
    BigIntReadError(String),

    #[error("JSONReadError: '{0}'")]
    JSONReadError(String),

    #[error("{0}")]
    IntRangeError(String),

    #[error("ArrayReadError: '{0}'")]
    ArrayReadError(String),

    #[error("MapReadError: '{0}'")]
    MapReadError(String),

    #[error("StrReadError: '{0}'")]
    StrReadError(String),

    #[error("EnumReadError: '{0}'")]
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

impl From<serde_json::Error> for DecodeError {
    fn from(e: serde_json::Error) -> DecodeError {
        DecodeError::JSONReadError(e.to_string())
    }
}

impl From<num_bigint::ParseBigIntError> for DecodeError {
    fn from(e: num_bigint::ParseBigIntError) -> Self {
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
        _ => format!(
            "invalid prefix, bad encoding for val: {}",
            &format.to_u8().to_string()
        ),
    }
}
