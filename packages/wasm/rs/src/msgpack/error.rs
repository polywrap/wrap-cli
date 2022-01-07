//! Errors returned from I/O `Write` and `Read` operations

/// Main error type for I/O `Write` operations
pub struct EncodingError(pub std::io::Error);

impl From<serde_json::Error> for EncodingError {
    fn from(err: serde_json::Error) -> EncodingError {
        err.into()
    }
}

impl std::fmt::Display for EncodingError {
    #[cold]
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str("error while encoding MsgPack value")
    }
}

/// Main error type for I/O `Read` operations
pub struct DecodingError(pub std::io::Error);

impl From<std::io::Error> for DecodingError {
    #[cold]
    fn from(err: std::io::Error) -> DecodingError {
        DecodingError(err)
    }
}

impl From<serde_json::Error> for DecodingError {
    fn from(err: serde_json::Error) -> DecodingError {
        err.into()
    }
}

impl std::fmt::Display for DecodingError {
    #[cold]
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str("error while decoding MsgPack value")
    }
}
