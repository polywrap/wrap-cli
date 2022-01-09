//! Errors returned from I/O `Write` and `Read` operations

use num_derive::FromPrimitive;
use thiserror::Error;

/// Error types
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum MsgPackError {
    /// Error from decoding data
    #[error("Error from decoding data")]
    DecodingError,
    /// Error from encoding data
    #[error("Error from encoding data")]
    EncodingError,
    /// Error in reading MsgPack format
    #[error("Error in reading MsgPack format")]
    FormatReadError,
    /// Error in writing MsgPack format
    #[error("Error in writing MsgPack format")]
    FormatWriteError,
}

impl From<MsgPackError> for std::io::Error {
    fn from(e: MsgPackError) -> Self {
        e.into()
    }
}

impl From<std::io::Error> for MsgPackError {
    fn from(e: std::io::Error) -> Self {
        e.into()
    }
}

impl From<serde_json::Error> for MsgPackError {
    fn from(e: serde_json::Error) -> MsgPackError {
        e.into()
    }
}

/// Errors from encoding data
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum EncodingError {
    #[error("FixIntWriteError")]
    FixIntWriteError,

    #[error("FixMapWriteError")]
    FixMapWriteError,

    #[error("FixArrayWriteError")]
    FixArrayWriteError,

    #[error("FixStrWriteError")]
    FixStrWriteError,

    #[error("NilWriteError")]
    NilWriteError,

    #[error("FormatWriteError")]
    FormatWriteError,

    #[error("BooleanWriteError")]
    BooleanWriteError,

    #[error("BinWriteError")]
    BinWriteError,

    #[error("ExtWriteError")]
    ExtWriteError,

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

    #[error("FixExtWriteError")]
    FixExtWriteError,

    #[error("StrWriteError")]
    StrWriteError,

    #[error("ArrayWriteError")]
    ArrayWriteError,

    #[error("MapWriteError")]
    MapWriteError,
}

impl From<EncodingError> for std::io::Error {
    fn from(e: EncodingError) -> Self {
        e.into()
    }
}

impl From<std::io::Error> for EncodingError {
    fn from(e: std::io::Error) -> Self {
        e.into()
    }
}

impl From<serde_json::Error> for EncodingError {
    fn from(e: serde_json::Error) -> EncodingError {
        e.into()
    }
}

/// Errors from decoding data
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum DecodingError {
    #[error("FixIntReadError")]
    FixIntReadError,

    #[error("FixMapReadError")]
    FixMapReadError,

    #[error("FixArrayReadError")]
    FixArrayReadError,

    #[error("FixStrReadError")]
    FixStrReadError,

    #[error("NilReadError")]
    NilReadError,

    #[error("FormatReadError")]
    FormatReadError,

    #[error("BooleanReadError")]
    BooleanReadError,

    #[error("BinReadError")]
    BinReadError,

    #[error("ExtReadError")]
    ExtReadError,

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

    #[error("FixExtReadError")]
    FixExtReadError,

    #[error("StrReadError")]
    StrReadError,

    #[error("ArrayReadError")]
    ArrayReadError,

    #[error("MapReadError")]
    MapReadError,
}

impl From<DecodingError> for std::io::Error {
    fn from(e: DecodingError) -> Self {
        e.into()
    }
}

impl From<std::io::Error> for DecodingError {
    fn from(e: std::io::Error) -> Self {
        e.into()
    }
}

impl From<serde_json::Error> for DecodingError {
    fn from(e: serde_json::Error) -> DecodingError {
        e.into()
    }
}
