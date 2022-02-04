//! Errors returned from I/O `Write` and `Read` operations

use num_derive::FromPrimitive;
use thiserror::Error;

/// Errors from encoding data
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum EncodeError {
    #[error("NilWriteError")]
    NilWriteError,

    #[error("FormatWriteError")]
    FormatWriteError,

    #[error("BooleanWriteError")]
    BooleanWriteError,

    #[error("BinWriteError")]
    BinWriteError,

    #[error("BigIntWriteError")]
    BigIntWriteError,

    #[error("Float32WriteError")]
    Float32WriteError,

    #[error("Float64WriteError")]
    Float64WriteError,

    #[error("Uint8WriteError")]
    Uint8WriteError,

    #[error("Uint16WriteError")]
    Uint16WriteError,

    #[error("Uint32WriteError")]
    Uint32WriteError,

    #[error("Uint64WriteError")]
    Uint64WriteError,

    #[error("Int8WriteError")]
    Int8WriteError,

    #[error("Int16WriteError")]
    Int16WriteError,

    #[error("Int32WriteError")]
    Int32WriteError,

    #[error("Int64WriteError")]
    Int64WriteError,

    #[error("StrWriteError")]
    StrWriteError,

    #[error("ArrayWriteError")]
    ArrayWriteError,

    #[error("MapWriteError")]
    MapWriteError,

    #[error("CustomEnumEncodeError")]
    CustomEnumEncodeError,
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
#[derive(Error, Debug)]
pub enum DecodeError {
    #[error("BytesReadError")]
    BytesReadError,

    #[error("ParseBigIntError")]
    ParseBigIntError,

    #[error("NilReadError")]
    NilReadError,

    #[error("FormatReadError")]
    FormatReadError,

    #[error("BooleanReadError")]
    BooleanReadError,

    #[error("BinReadError")]
    BinReadError,

    #[error("Float32ReadError")]
    Float32ReadError,

    #[error("Float64ReadError")]
    Float64ReadError,

    #[error("Uint8ReadError")]
    Uint8ReadError,

    #[error("Uint16ReadError")]
    Uint16ReadError,

    #[error("Uint32ReadError")]
    Uint32ReadError,

    #[error("Uint64ReadError")]
    Uint64ReadError,

    #[error("Int8ReadError")]
    Int8ReadError,

    #[error("Int16ReadError")]
    Int16ReadError,

    #[error("Int32ReadError")]
    Int32ReadError,

    #[error("Int64ReadError")]
    Int64ReadError,

    #[error("StrReadError")]
    StrReadError,

    #[error("ArrayReadError")]
    ArrayReadError,

    #[error("MapReadError")]
    MapReadError,

    #[error("UnknownFieldName")]
    UnknownFieldName,

    #[error("CustomEnumDecodeError")]
    CustomEnumDecodeError,

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
