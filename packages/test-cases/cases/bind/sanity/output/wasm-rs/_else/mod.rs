use serde::{Serialize, Deserialize};
pub mod serialization;
use polywrap_wasm_rs::{
    BigInt,
    BigNumber,
    Map,
    DecodeError,
    EncodeError,
    Read,
    Write,
    JSON,
};
pub use serialization::{
    deserialize_else,
    read_else,
    serialize_else,
    write_else
};


#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Else {
    pub _else: String,
}

impl Else {
    pub fn new() -> Else {
        Else {
            _else: String::new(),
        }
    }

    pub fn to_buffer(args: &Else) -> Result<Vec<u8>, EncodeError> {
        serialize_else(args).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn from_buffer(args: &[u8]) -> Result<Else, DecodeError> {
        deserialize_else(args).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }

    pub fn write<W: Write>(args: &Else, writer: &mut W) -> Result<(), EncodeError> {
        write_else(args, writer).map_err(|e| EncodeError::TypeWriteError(e.to_string()))
    }

    pub fn read<R: Read>(reader: &mut R) -> Result<Else, DecodeError> {
        read_else(reader).map_err(|e| DecodeError::TypeReadError(e.to_string()))
    }
}
