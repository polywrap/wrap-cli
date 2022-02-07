//! Errors returned from I/O `Write` and `Read` operations

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

    #[error("Uint64WriteError: '{0}'")]
    Uint64WriteError(String),

    #[error("Int8WriteError: '{0}'")]
    Int8WriteError(String),

    #[error("Int16WriteError: '{0}'")]
    Int16WriteError(String),

    #[error("Int32WriteError: '{0}'")]
    Int32WriteError(String),

    #[error("Int64WriteError: '{0}'")]
    Int64WriteError(String),

    #[error("StrWriteError: '{0}'")]
    StrWriteError(String),

    #[error("ArrayWriteError: '{0}'")]
    ArrayWriteError(String),

    #[error("MapWriteError: '{0}'")]
    MapWriteError(String),
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

    #[error("NilReadError: '{0}'")]
    NilReadError(String),

    #[error("FormatReadError: '{0}'")]
    FormatReadError(String),

    #[error("BooleanReadError: '{0}'")]
    BooleanReadError(String),

    #[error("BinReadError: '{0}'")]
    BinReadError(String),

    #[error("Float32ReadError: '{0}'")]
    Float32ReadError(String),

    #[error("Float64ReadError: '{0}'")]
    Float64ReadError(String),

    #[error("Uint8ReadError: '{0}'")]
    Uint8ReadError(String),

    #[error("Uint16ReadError: '{0}'")]
    Uint16ReadError(String),

    #[error("Uint32ReadError: '{0}'")]
    Uint32ReadError(String),

    #[error("Uint64ReadError: '{0}'")]
    Uint64ReadError(String),

    #[error("Int8ReadError: '{0}'")]
    Int8ReadError(String),

    #[error("Int16ReadError: '{0}'")]
    Int16ReadError(String),

    #[error("Int32ReadError: '{0}'")]
    Int32ReadError(String),

    #[error("Int64ReadError: '{0}'")]
    Int64ReadError(String),

    #[error("StrReadError: '{0}'")]
    StrReadError(String),

    #[error("ArrayReadError: '{0}'")]
    ArrayReadError(String),

    #[error("MapReadError: '{0}'")]
    MapReadError(String),

    #[error("UnknownFieldName: '{0}'")]
    UnknownFieldName(String),

    #[error("WrongMsgPackFormat: '{0}'")]
    WrongMsgPackFormat(String),

    #[error("Missing required field: '{0}'")]
    MissingField(String),
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
