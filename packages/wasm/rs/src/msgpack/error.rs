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
